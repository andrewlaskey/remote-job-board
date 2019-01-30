import Vue from 'vue';
import VueStripeCheckout from 'vue-stripe-checkout';
import { publishableKey as stripePubKey } from './../stripe.config.js';

Vue.use(VueStripeCheckout, stripePubKey);
