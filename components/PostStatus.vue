<template>
  <div class="job-status">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <div>
              <p class="heading">
                Title
              </p>
              <p class="title is-4">
                <nuxt-link 
                  v-if="post.status === 'published'"
                  :to="`/job/${post.slug}`"
                >
                  {{ post.title }}
                </nuxt-link>
                <span v-else>
                  {{ post.title }}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div>
              <p class="heading">
                Status
              </p>
              <p class="title is-5">
                {{ post.status }}
              </p>
            </div>
          </div>
          <div class="level-item">
            <div>
              <p class="heading">
                Created
              </p>
              <p class="title is-5">
                {{ postDateFormatted }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <p v-if="post.status === 'published'">
        View your lising 
        <nuxt-link :to="`/job/${post.slug}`">
          here.
        </nuxt-link>
      </p>
      <p>
        If you have any questions about the status of your listing, please 
        <nuxt-link :to="'/contact'">
          contact support.
        </nuxt-link>
      </p>
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
      if (this.post && this.post.createDate) {
        return moment(this.post.createDate).format('MMM DD YYYY');
      }

      return '';
    }
  }
};
</script>
