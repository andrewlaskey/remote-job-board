<template>
  <div>
    <div class="hero">
      <div class="hero-body">
        <div class="container">
          <h2 class="title is-3 has-text-centered is-family-secondary">
            Find and List Remote Job Opportunities
          </h2>
          <div class="content">
            <p class="has-text-centered">
              Amazing jobs and employees are everywhere.<br>Leave the office behind and join the growing community of teams doing their best work remotely.
            </p>
            <p class="has-text-centered">
              <nuxt-link 
                :to="'/new'"
                class="button is-primary"
              >
                Post your job for 30 days for $100
              </nuxt-link>
            </p>
          </div>
        </div>
      </div>
    </div>
    <section class="section">
      <posts-list :posts="posts" />
    </section>
  </div>
</template>

<script>
import PostsList from '~/components/PostsList.vue';

export default {
  components: {
    PostsList
  },
  async asyncData({ app }) {
    try {
      const posts = await app.$fb.getPosts();

      return {
        posts
      };
    } catch (error) {}

    return {};
  }
};
</script>
