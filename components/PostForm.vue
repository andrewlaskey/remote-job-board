<template>
  <div class="columns is-centered">
    <form class="column is-half">
      <h1 class="title is-1">Post a New Job</h1>

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
          <textarea v-model="description" class="textarea" placeholder="Describe the position and your ideal " required></textarea>
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
        <label v-for="(value, key) in timezoneOptions" v-bind:key="key" class="checkbox" >
          <input type="checkbox" v-bind:value="key" v-model="timezones">
          <span>{{ value }}</span>
        </label>
      </div>

      <div class="field">
        <label class="label">
          How to Apply
        </label>
        <div class="control">
          <textarea v-model="howToApply" class="textarea" placeholder="How should potential hires apply for this position" required></textarea>
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
          <button class="button is-primary" v-on:click.prevent="createNewPost">
            Pay and Post Job
          </button>
        </div>
      </div>

      <div class="notification is-warning" v-show="isError">
        {{ errorMsg }}
      </div>

      <div class="notification is-success" v-show="submitSuccess">
        Your job was posted!
      </div>
    </form>
  </div>
</template>

<script>
import slugify from 'slugify';
import { log } from '~/helpers/logs.js';
import options from './../helpers/options.js';
import fb from './../helpers/firebase.js';

export default {
  name: 'PostForm',

  data() {
    return {
      title: '',
      slug: '',
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
      isError: false,
      submitSuccess: false,
      errorMsg: ''
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

    async createNewPost() {
      // Reset errors
      this.isError = false;

      // Validate form - All fields filled out
      const validForm = this.validateForm();

      if (!validForm) {
        this.onError('Please make sure all fields are filled out.');
        return false;
      }

      this.slug = this.createPostSlug(this.title);

      try {
        const uploadFile = document.querySelector('#logo-input').value;
        let logoSaveUrlPath = '';

        if (uploadFile) {
          logoSaveUrlPath = await fb.uploadFile(uploadFile);
        }

        const post = {
          title: this.title,
          description: this.description,
          slug: this.slug,
          category: this.category,
          timezones: this.selectedTimezones(this.timezones),
          type: this.type,
          howToApply: this.howToApply,
          applyUrl: this.applyUrl,
          companyName: this.companyName,
          companyUrl: this.companyUrl,
          companyLogo: logoSaveUrlPath,
          paymentStatus: 'paid',
          publishStatus: 'unpublished',
          token:'tok_fakestripetoken'
        };

        const newPostId = await fb.createPost(post);

        if (newPostId) {
          this.submitSuccess = true;
          log(newPostId);
        } else {
          throw new Error('Error creating post');
        }
      } catch (error) {
        // prettier-ignore
        this.onError(`There was a problem creating this post. Contact support.`);
      }
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
