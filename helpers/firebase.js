import firebase from 'firebase';
import 'firebase/firestore';
import { logError, log } from './logs';

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

function buildPostListFromQuery(querySnapshot) {
  const posts = [];

  querySnapshot.forEach(doc => {
    const post = doc.data();

    post.id = doc.id;

    posts.push(post);
  });

  return posts;
}

function getCollection(published = true) {
  const db = firebase.firestore();
  const collection = db.collection('jobs');

  if (published) {
    return collection.where('status', '==', 'published');
  }

  return collection;
}

const fb = {
  async getPosts(published = true) {
    try {
      const collection = getCollection(published);
      const posts = await collection
        .orderBy('createDate', 'desc')
        .get()
        .then(buildPostListFromQuery);

      return posts;
    } catch (error) {
      logError(error);
    }

    return undefined;
  },

  async getPostsByCategory(category, published = true) {
    try {
      const collection = getCollection(published);
      const posts = await collection
        .where('category', '==', category)
        .orderBy('createDate', 'desc')
        .get()
        .then(buildPostListFromQuery);

      return posts;
    } catch (error) {
      logError(error);
    }

    return undefined;
  },

  async getPostsByTimezone(timezone, published = true) {
    const timezoneQuery = 'timezones.' + timezone;

    try {
      const collection = getCollection(published);
      const posts = await collection
        .where(timezoneQuery, '>', 0)
        .orderBy(timezoneQuery, 'desc')
        .get()
        .then(buildPostListFromQuery);

      return posts;
    } catch (error) {
      logError(error);
    }

    return undefined;
  },

  async getPostStatus(id) {
    const db = firebase.firestore();

    try {
      const post = await db
        .collection(`status`)
        .doc(id)
        .get()
        .then(doc => {
          if (doc.exists) {
            return {
              id: doc.id,
              ...doc.data()
            };
          }

          return undefined;
        });

      return post;
    } catch (error) {
      logError(error);
    }

    return undefined;
  },

  async getPostBySlug(slug) {
    try {
      log(slug);
      const collection = getCollection(true);
      const post = await collection
        .where('slug', '==', slug)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
            return {};
          }

          return {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data()
          };
        });

      return post;
    } catch (error) {
      logError('getPostBySlug');
      logError(error);
    }

    return {};
  },

  // Create

  async createPost(post) {
    const db = firebase.firestore();

    try {
      const newPost = await db.collection('jobs').add(post);

      // Set the status in a separate, readable collection
      const postStatus = {
        title: post.title,
        status: post.publishStatus,
        createDate: post.createDate
      };

      await db
        .collection('status')
        .doc(newPost.id)
        .set(postStatus);

      log('New job created at ' + newPost.id);

      return newPost.id;
    } catch (error) {
      logError(error);
    }

    return undefined;
  },

  async uploadFile(logoFile) {
    const storageRef = firebase.storage().ref();

    try {
      const downloadPath = await storageRef
        .child('images/' + logoFile.name)
        .put(logoFile)
        .then(snapshot => snapshot.ref.getDownloadURL());

      return downloadPath;
    } catch (error) {
      logError(error);
    }

    return '';
  },

  async addPrivateData(email, token, postRef) {
    const db = firebase.firestore();

    try {
      const privateData = await db.collection(`jobs/${postRef}/private`).add({
        email,
        token
      });

      return privateData.id;
    } catch (error) {
      logError(error);
    }

    return false;
  }
};

export default fb;
