<template>
  <div class="columns is-centered">
    <form class="column is-half">
      <h3>Post a New Job</h3>

      <div class="field">
        <label class="label">
          Job Title
        </label>
        <div class="control">
          <input v-model="title" class="input" type="text" placeholder="ex: Front End Developer">
        </div>
      </div>

      <div class="field">
        <label class="label">
          Job Description
        </label>
        <div class="control">
          <textarea v-model="description" class="textarea" placeholder="Describe the position and your ideal "></textarea>
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
        <label v-for="(value, key) in timezoneOptions" v-bind:key="key" class="checkbox" >
          <input type="checkbox" v-model="timezones">
          <span>{{ value }}</span>
        </label>
      </div>

      <div class="field">
        <label class="label">
          How to Apply
        </label>
        <div class="control">
          <textarea v-model="howToApply" class="textarea" placeholder="How should potential hires apply for this position"></textarea>
        </div>
      </div>

      <div class="field">
        <label class="label">
          Email or Application URL (optional)
        </label>
        <div class="control">
          <input v-model="applyUrl" class="input" type="text" placeholder="ex: hr@yourcompany.com or https://yourcompany.com/applyhere">
        </div>
      </div>

      <h4>Your Company</h4>

      <div class="field">
        <label class="label">
          Company Name
        </label>
        <div class="control">
          <input v-model="companyName" class="input" type="text" placeholder="ex: Widget Co.">
        </div>
      </div>

      <div class="field">
        <label class="label">
          Website
        </label>
        <div class="control">
          <input v-model="companyUrl" class="input" type="text" placeholder="ex: https://widget.co">
        </div>
      </div>

      <div class="field">
        <div class="control">
          <button class="button is-primary" v-on:click.prevent="createNewPost">
            Pay and Post Job
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import slugify from 'slugify';
import { log } from '~/helpers/logs.js';
import options from './../helpers/options.js';

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
      timezones: {},
      typeOptions: {},
      type: 'full-time',
      howToApply: '',
      applyUrl: '',
      companyName: '',
      companyUrl: '',
      companyLogo: '',
      status: 'unpaid',
      hasLogo: false
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

    createNewPost() {
      // Validate form - All fields filled out
      
      this.slug = this.createPostSlug(this.title);

      log(this.slug);
    }
  }
};
</script>
