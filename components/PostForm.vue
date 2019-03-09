<template>
  <div class="columns is-centered">
    <div class="column is-half">
      <h1 class="title is-1">
        Post a New Job
      </h1>
      
      <div v-if="step == 'success'" class="notification is-success">
        <h3 class="title is-4">Thanks for listing with us!</h3>
        <p>Your new job listing was submitted and pending approval.</p>
        <p>View your listing's status <nuxt-link v-bind:to="`status/${submitSuccess}`">here.</nuxt-link></p>
      </div>

      <form v-show="step == 'form'">

        <div class="field">
          <label class="label">
            Job Title
          </label>
          <div class="control">
            <input v-model="title" class="input" type="text" placeholder="ex: Front End Developer" required>
          </div>
        </div>

        <div class="field">
          <label class="label">
            Job Description
          </label>
          <div class="control">
            <vue-editor
              v-model="description"
              :editorToolbar="customToolbar"
              placeholder="Describe the position and your ideal candidate"></vue-editor>
          </div>
        </div>

        <div class="field">
          <label class="label">
            Category
          </label>
          <div class="select">
            <select v-model="category">
              <option v-for="(value, key) in categories" v-bind:key="key" v-bind:value="key">
                {{ value }}
              </option>
            </select>
          </div>
        </div>

        <div class="field">
          <label class="label">
            Type
          </label>
          <div class="select">
            <select v-model="type">
              <option v-for="(value, key) in typeOptions" v-bind:key="key" v-bind:value="key">
                {{ value }}
              </option>
            </select>
          </div>
        </div>

        <div class="field">
          <label class="label">
            Timezones
          </label>
          <label v-for="(value, key) in timezoneOptions" v-bind:key="key" class="checkbox">
            <input type="checkbox" v-bind:value="key" v-model="timezones">
            <span>{{ value }}</span>
          </label>
        </div>

        <div class="field">
          <label class="label">
            How to Apply
          </label>
          <div class="control">
            <vue-editor
              v-model="howToApply"
              :editorToolbar="customToolbar"
              placeholder="How should potential hires apply for this position?"></vue-editor>
          </div>
        </div>

        <div class="field">
          <label class="label">
            Email or Application URL (optional)
          </label>
          <div class="control">
            <input v-model="applyUrl" class="input" type="text" placeholder="ex: hr@yourcompany.com or https://yourcompany.com/applyhere" required>
          </div>
        </div>

        <h2 class="title is-3">Your Company</h2>

        <div class="field">
          <label class="label">
            Company Name
          </label>
          <div class="control">
            <input v-model="companyName" class="input" type="text" placeholder="ex: Widget Co." required>
          </div>
        </div>

        <div class="field">
          <label class="label">
            Website
          </label>
          <div class="control">
            <input v-model="companyUrl" class="input" type="text" placeholder="ex: https://widget.co" required>
          </div>
        </div>

        <div class="field">
          <label class="label">Company Logo</label>
          <figure class="image is-128x128" v-show="hasLogo">
            <img :src="companyLogo" alt="Your company's logo" />
            <button class="button image-reset" v-on:click.prevent="removeLogo">
              <span class="icon is-small">
                <fa :icon="['fas', 'times-circle']" />
              </span>
            </button>
          </figure>
          <div class="file" v-show="!hasLogo">
            <label class="file-label">
              <input id="logo-input" class="file-input" type="file" name="logo" v-on:change="onFileChange">
              <span class="file-cta">
                <span class="file-icon">
                  <fa :icon="['fas', 'upload']" />
                </span>
                <span class="file-label">
                  Choose a file…
                </span>
              </span>
            </label>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <button class="button is-primary" v-on:click.prevent="showPreview">
              Preview
            </button>
          </div>
        </div>

        <div v-show="!isFormValid" class="notification is-warning">
          <p>Please make sure all fields are filled out.</p>
        </div>
      </form>

      <div v-show="step == 'preview'">
        <div class="container">
          <post-detail :post="post"/>
        </div>
        <div>
          <button class="button" v-on:click.prevent="showForm">
            Go Back
          </button>
          <button class="button is-primary" v-bind:class="{ 'is-loading' : isLoading }" v-on:click.prevent="checkout">
            Pay and Post Job
          </button>
        </div>
        <div v-show="isError" class="notification is-danger">
          {{ errorMsg }}
        </div>
      </div>
    </div>
    <vue-stripe-checkout
      ref="checkoutRef"
      :image="image"
      :name="name"
      :description="stripeDescription"
      :amount="amount"
      :allow-remember-me="false"
      @done="done"
      @opened="opened"
      @closed="closed"
      @canceled="canceled"
    ></vue-stripe-checkout>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor';
import slugify from 'slugify';
import axios from 'axios';
import { log } from '~/helpers/logs.js';
import options from './../helpers/options.js';
import fb from './../helpers/firebase.js';
import PostDetail from './PostDetail.vue';

export default {
  name: 'PostForm',

  components: {
    PostDetail,
    VueEditor
  },

  data() {
    return {
      title: '',
      description: '',
      categories: {},
      category: 'code',
      timezoneOptions: {},
      timezones: [],
      typeOptions: {},
      type: 'full-time',
      howToApply: '',
      applyUrl: '',
      companyName: '',
      companyUrl: '',
      companyLogo: '',
      status: 'unpaid',
      hasLogo: false,
      post: {},
      isFormValid: true,
      isError: false,
      isLoading: false,
      submitSuccess: false,
      errorMsg: '',
      step: 'form',
      image: 'https://i.imgur.com/HhqxVCW.jpg',
      name: 'Remote Work List',
      stripeDescription: '60-day job listing',
      amount: 7500,
      customToolbar: [
        [{ header: 1 }, { header: 2 }],
        ['bold', 'italic', 'underline', 'strike'],
        [
          {
            list: 'ordered'
          },
          {
            list: 'bullet'
          }
        ]
      ]
    };
  },

  mounted() {
    this.categories = options.categoryOptions;
    this.timezoneOptions = options.timezoneOptions;
    this.typeOptions = options.workTypeOptions;
  },

  methods: {
    createPostSlug(str) {
      // Create a url friendly slug from a string
      // Add a date string to make slug unique to prevent duplicates
      return slugify(str, { lower: true }) + '-' + Date.now().toString(36);
    },

    validateForm() {
      if (this.title.length === 0) {
        return false;
      }

      if (this.description.length === 0) {
        return false;
      }

      if (this.companyName.length === 0) {
        return false;
      }

      if (this.companyUrl.length === 0) {
        return false;
      }

      if (this.howToApply.length === 0) {
        return false;
      }

      return true;
    },

    onError(msg) {
      this.isLoading = false;
      this.isError = true;
      this.errorMsg = msg;
    },

    onFileChange(e) {
      const input = e.target;

      if (input.files && input.files[0]) {
        if (!input.files[0].type.startsWith('image/')) {
          this.onError('Wrong file type');
          return;
        }

        this.hasLogo = true;
        this.companyLogo = window.URL.createObjectURL(input.files[0]);
      }
    },

    removeLogo() {
      this.hasLogo = false;
      this.companyLogo = '';
      document.querySelector('#logo-input').value = '';
    },

    selectedTimezones(timezoneArray) {
      // prettier-ignore
      return Object.values(timezoneArray).reduce((selectedTimezones, timezone) => {
        selectedTimezones[timezone] = Date.now();
        return selectedTimezones;
      }, {});
    },

    createNewPost(tokenId, email) {
      const api = `https://us-central1-remote-job-board.cloudfunctions.net/processNewPost`;
      const result = {
        success: false,
        message: ''
      };

      return axios
        .post(api, {
          token: tokenId,
          email,
          post: this.post
        })
        .then(response => {
          const data = response.data;

          if (data.error) {
            log(data.message);

            switch (data.errorType) {
              case 'card':
                result.message = data.message;
                break;
              case 'stripe':
                result.message = `There was an issue processing payment on Stripe. Please try again or contact support.`;
                break;
              case 'post':
                result.message = `Your payment went through, but there was a problem submitting your listing. Please contact support so we can resolve the issue.`;
                break;
              default:
                result.message = `There was a problem submitting your listing. Please contact support.`;
                break;
            }
          } else {
            result.success = true;
          }

          return result;
        })
        .catch(error => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            log(error.response.data);
            log(error.response.status);
            log(error.response.headers);
            result.message = `There was server error. Your card was not charged. Please contact support.`;
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            log(error.request);
            result.message = `We could not contact the server. Your card was not charged. Please try again or contact support.`;
          } else {
            // Something happened in setting up the request that triggered an Error
            log(error.message);
            result.message = `Something went wrong. Your card was not charged. Please contact support.`;
          }

          return result;
        });
    },

    createPostObject(logoUrl) {
      return {
        title: this.title,
        description: this.description,
        slug: this.createPostSlug(this.title),
        category: this.category,
        timezones: this.selectedTimezones(this.timezones),
        type: this.type,
        howToApply: this.howToApply,
        applyUrl: this.applyUrl,
        companyName: this.companyName,
        companyUrl: this.companyUrl,
        companyLogo: logoUrl,
        createDate: Date.now(),
        publishStatus: 'pending approval'
      };
    },

    showForm() {
      this.step = 'form';
    },

    showPreview() {
      this.isFormValid = this.validateForm();

      if (this.isFormValid) {
        this.post = this.createPostObject(this.companyLogo);
        this.step = 'preview';
      }
    },

    async uploadLogo() {
      try {
        const uploadFile = document.querySelector('#logo-input').files[0];
        let logoSaveUrlPath = '';

        if (uploadFile) {
          logoSaveUrlPath = await fb.uploadFile(uploadFile);
        }

        this.post.companyLogo = logoSaveUrlPath;
        return true;
      } catch (err) {
        log(err);
        return false;
      }
    },

    async checkout() {
      // Reset errors
      this.isError = false;
      this.isLoading = true;

      try {
        // Do Stripe stuff
        const { token } = await this.$refs.checkoutRef.open();

        // Upload logo if there is one
        const uploadSuccess = await this.uploadLogo();

        if (!uploadSuccess) {
          throw new Error(
            `There was a problem uploading your logo. Please try again or contact support.`
          );
        }

        // Charge card and create post
        const addedPost = await this.createNewPost(token.id, token.email);

        this.isLoading = false;

        if (addedPost) {
          this.step = 'success';
        }
      } catch (err) {
        this.onError(err.message);
      }
    },
    done({ token, args }) {
      // token - is the token object
      // args - is an object containing the billing and shipping address if enabled
      // do stuff...
      log('Done');
      log(token);
    },
    opened() {
      // do stuff
      log('Opened');
    },
    closed() {
      // do stuff
      log('Closed');
    },
    canceled() {
      // do stuff
      log('Canceled');
    }
  }
};
</script>

<style>
.checkbox {
  display: block;
}

.image-reset {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
