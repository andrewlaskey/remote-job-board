import pkg from './package';
import fb from './helpers/firebase.js';
import options from './helpers/options.js';

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
    { src: '~plugins/nuxt-quill-plugin.js', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc:https://github.com/nuxt-community/modules/tree/master/packages/bulma
    '@nuxtjs/pwa',
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

  generate: {
    routes: function() {
      return fb.getPosts().then(posts => {
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
