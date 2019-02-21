<template>
  <div class="job-status">
    <header class="section">
      <h1 class="title is-1">
        Job Listing Status
      </h1>
    </header>
    <div class="section">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <div>
              <p class="heading">Title</p>
              <p class="title is-4">{{ post.title }}</p>
            </div>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div>
              <p class="heading">Status</p>
              <p class="title is-5">{{ post.status }}</p>
            </div>
          </div>
          <div class="level-item">
            <div>
              <p class="heading">Created</p>
              <p class="title is-5">{{ postDateFormatted }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <p>If you have any questions about the status of your listing, please <nuxt-link :to="'/contact'">contact support.</nuxt-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'PostStatus',

  props: {
    post: {
      type: Object,
      default: function() {
        return {
          title: '',
          createDate: 0,
          status: ''
        };
      }
    }
  },

  data() {
    return {};
  },

  computed: {
    postDateFormatted() {
      if (this.post && this.post.hasOwnProperty('createDate')) {
        return moment(this.post.createDate).format('MMM DD YYYY');
      }

      return '';
    }
  }
};
</script>
