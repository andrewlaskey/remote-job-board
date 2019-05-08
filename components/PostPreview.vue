<template>
  <div class="job-preview">
    <div class="columns">
      <div class="column is-1">
        <figure v-if="post.companyLogo && post.companyLogo.length > 0" class="image is-64x64">
          <img :src="post.companyLogo" alt="Logo">
        </figure>
      </div>
      <div class="column is-one-third">
        <nuxt-link :to="postUrl">
          <h4 class="title is-5">
            {{ post.title }}
          </h4>
          <h5 class="subtitle is-6">
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
        <span class="is-hidden-desktop">
          Posted 
        </span>
        <span>
          {{ postDateFormatted }}
        </span>
      </div>
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
          companyLogo: '',
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

<style lang="scss">
@import './../assets/variables';

.job-preview {
  margin-top: 0;
  margin-bottom: 0;

  @media only screen and (max-width: 1023px) {
    margin-bottom: 1em;
    padding-bottom: 1em;
    border-bottom: 1px solid #dbdbdb;
  }
}

.job-preview .column:nth-child(n + 2) {
  @media only screen and (max-width: 1023px) {
    padding-top: 0;
    padding-bottom: 0;
  }

  @media only screen and (min-width: 1024px) {
    border-bottom: 1px solid #dbdbdb;
    text-align: right;
  }
}

.job-preview .column:nth-child(2) {
  text-align: left;
}

.job-preview a {
  display: block;

  .title {
    &:hover,
    &:focus {
      color: $primary;
    }
  }
}

.job-preview .columns {
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 0;
  margin-right: 0;
}
</style>
