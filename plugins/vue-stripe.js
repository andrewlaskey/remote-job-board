import Vue from 'vue';
import VueStripeCheckout from 'vue-stripe-checkout';
import { StripeConfig } from './../stripe.config.js';

Vue.use(VueStripeCheckout, StripeConfig.publishableKey);
