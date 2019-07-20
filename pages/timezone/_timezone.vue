<template>
  <div>
    <div class="hero">
      <div class="hero-body">
        <div class="container">
          <h2 class="title is-3 has-text-centered is-family-secondary">
            {{ title }}
          </h2>
        </div>
      </div>
    </div>
    <section class="section">
      <posts-list :posts="posts" />
    </section>
  </div>
</template>

<script>
import options from '~/helpers/options.js';
import PostsList from '~/components/PostsList.vue';

export default {
  components: {
    PostsList
  },
  computed: {
    title() {
      return options.getTimezoneName(this.$route.params.timezone);
    }
  },
  async asyncData({ app, params }) {
    try {
      const posts = await app.$fb.getPostsByTimezone(params.timezone);

      return {
        posts
      };
    } catch (error) {}

    return {};
  }
};
</script>
