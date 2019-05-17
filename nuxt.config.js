import firebase from 'firebase';
import pkg from './package';
import options from './helpers/options.js';

require('dotenv').config();

export default {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '@/assets/main.scss',
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    'quill/dist/quill.core.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: '~/plugins/vue-stripe',
      ssr: false
    },
    { src: '~/plugins/nuxt-quill-plugin.js', ssr: false },
    {
      src: '~/plugins/firebase'
    }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc:https://github.com/nuxt-community/modules/tree/master/packages/bulma
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
    '@nuxtjs/axios',
    'nuxt-fontawesome'
  ],

  fontawesome: {
    component: 'fa',
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      }
    ]
  },

  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY
  },

  generate: {
    routes: function() {
      if (!firebase.apps.length) {
        firebase.initializeApp({
          apiKey: process.env.FIREBASE_API_KEY,
          authDomain: process.env.FIREBASE_AUTH_DOMAIN,
          databaseURL: process.env.FIREBASE_DATABASE_URL,
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
        });
      }

      const buildPostListFromQuery = querySnapshot => {
        const posts = [];

        querySnapshot.forEach(doc => {
          const post = doc.data();

          post.id = doc.id;

          posts.push(post);
        });

        return posts;
      };

      const getCollection = (published = true) => {
        const db = firebase.firestore();
        const collection = db.collection('jobs');

        if (published) {
          return collection.where('status', '==', 'published');
        }

        return collection;
      };

      const getPosts = async (published = true) => {
        try {
          const collection = getCollection(published);
          const posts = await collection
            .orderBy('createDate', 'desc')
            .get()
            .then(buildPostListFromQuery);

          return posts;
        } catch (error) {
          // console.log(error);
        }

        return undefined;
      };

      return getPosts().then(posts => {
        const postRoutes = posts.map(post => {
          return {
            route: `/job/${post.slug}`,
            payload: post
          };
        });

        const categories = Object.keys(options.categoryOptions).map(
          category => {
            return {
              route: `/category/${category}`,
              payload: null
            };
          }
        );

        const timezones = Object.keys(options.timezoneOptions).map(timezone => {
          return {
            route: `/timezone/${timezone}`,
            payload: null
          };
        });

        return [...postRoutes, ...categories, ...timezones];
      });
    }
  },

  /*
  ** Build configuration
  */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
};
