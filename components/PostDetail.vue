<template>
  <article class="job-detail">
    <header class="job-detail-header media">
      <figure v-if="post.companyLogo && post.companyLogo.length > 0" class="media-left">
        <p class="image is-96x96">
          <img :src="post.companyLogo" alt="logo">
        </p>
      </figure>
      <div class="media-content">
        <h1 class="title is-4">
          {{ post.title }}
        </h1>
        <h2 class="subtitle is-6">
          <a :href="post.companyUrl" target="_blank">
            {{ post.companyName }}
          </a>
        </h2>
        <div class="tags">
          <span v-for="(tag, index) in tags" :key="index" class="tag is-primary">
            {{ tag }}
          </span>
        </div>
        <p class="content">
          <em>Posted on: {{ createDateFormatted }}</em>
        </p>
      </div>
    </header>
    <div class="content" v-html="post.description" />
    <footer>
      <div class="message">
        <div class="message-body">
          <div class="content" v-html="post.howToApply" />
          <p v-if="post.applyUrl && post.applyUrl.length > 0">
            <a :href="post.applyUrl" class="button is-primary" target="_blank">
              Apply Now
            </a>
          </p>
        </div>
      </div>
    </footer>
  </article>
</template>

<script>
import moment from 'moment';
import options from './../helpers/options.js';

export default {
  name: 'PostDetail',
  props: {
    post: {
      type: Object,
      default: function() {
        return {
          title: '',
          companyUrl: '',
          companyName: '',
          companyLogo: '',
          createDate: 0,
          slug: '',
          category: '',
          type: '',
          timezones: {},
          description: '',
          howToApply: '',
          applyUrl: ''
        };
      }
    },
    edit: Boolean
  },
  data() {
    return {};
  },
  computed: {
    createDateFormatted() {
      if (this.post && this.post.createDate) {
        return moment(this.post.createDate).format('MM/DD/YYYY');
      }

      return '';
    },
    tags() {
      const timezones = Object.keys(this.post.timezones).map(slug => {
        return options.getTimezoneName(slug);
      });
      const category = options.getCategoryName(this.post.category);
      const type = options.getWorkTypeName(this.post.type);

      return [category, type, ...timezones];
    }
  }
};
</script>

<style lang="scss" scoped>
.job-detail {
  padding-bottom: 2em;
}

.job-detail-header {
  padding-bottom: 2em;
}

.tags:not(:last-child) {
  margin-bottom: 0;
}
</style>
