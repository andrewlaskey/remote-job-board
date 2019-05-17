import firebase from '~/helpers/firebase.js';

export default (ctx, inject) => {
  inject('fb', firebase);
};
