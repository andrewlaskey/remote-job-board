<template>
  <article class="job-detail">
    <header>
      <h1 class="title is-1">
        {{ post.title }}
      </h1>
    </header>
    <div class="content">
      {{ post.description }}
    </div>
    <footer>
      <div class="message">
        <div class="message-body">
          {{ post.howToApply }}
        </div>
      </div>
    </footer>
  </article>
</template>

<script>
export default {
  name: 'PostDetail',

  props: {
    post: {
      type: Object,
      default: function() {
        return {
          title: '',
          createDate: 0,
          slug: '',
          category: '',
          timezone: '',
          description: ''
        };
      }
    },
    edit: Boolean
  },

  data() {
    return {};
  }
};
</script>
