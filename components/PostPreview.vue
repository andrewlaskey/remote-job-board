<template>
  <div class="job-preview columns">
    <div class="column is-one-third">
      <nuxt-link :to="postUrl">
        <h4 class="title is-4">
          {{ post.title }}
        </h4>
        <h5 class="subtitle is-5">
          {{ post.companyName }}
        </h5>
      </nuxt-link>
    </div>
    <div class="column">
      <nuxt-link :to="categoryUrl(post.category)">
        {{ categoryName(post.category) }}
      </nuxt-link>
    </div>
    <div class="column">
      <nuxt-link v-for="(value, slug) in post.timezones" :key="slug" :to="timezoneUrl(slug)">
        {{ timezoneName(slug) }}
      </nuxt-link>
    </div>
    <div class="column">
      <span>{{ postDateFormatted }}</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import options from './../helpers/options.js';

export default {
  name: 'PostPreview',
  props: {
    post: {
      type: Object,
      default: function() {
        return {
          title: '',
          companyName: '',
          createDate: 0,
          slug: '',
          category: '',
          timezone: ''
        };
      }
    },
    edit: Boolean
  },
  data() {
    return {};
  },
  computed: {
    postDateFormatted() {
      if (this.post && this.post.hasOwnProperty('createDate')) {
        return moment(this.post.createDate).fromNow();
      }

      return '';
    },
    postUrl() {
      let url = '';

      if (this.post && this.post.hasOwnProperty('slug')) {
        url = '/job/' + this.post.slug;

        if (this.edit) {
          url = '/edit/' + this.post.slug;
        }
      }

      return url;
    }
  },
  methods: {
    timezoneName(slug) {
      return options.getTimezoneName(slug);
    },
    categoryName(slug) {
      return options.getCategoryName(slug);
    },
    timezoneUrl: options.getTimezoneUrl,
    categoryUrl: options.getCategoryUrl
  }
};
</script>

<style>
.job-preview {
  margin-top: 0;
  margin-bottom: 0;
  text-align: right;
  border-top: 1px solid #dbdbdb;
}

.job-preview .column:first-child {
  text-align: left;
}

.job-preview a {
  display: block;
}
</style>
