<template>
  <div>
    <div class="hero">
      <div class="hero-body">
        <div class="container">
          <h2 class="title is-3 has-text-centered is-family-secondary">Find and List Remote Job Opportunities</h2>
          <div class="content">
            <p class="has-text-centered">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p class="has-text-centered">
              <nuxt-link 
                :to="'/new'"
                class="button is-primary"
              >Post your job for 30 days for $100</nuxt-link>
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
import fb from '~/helpers/firebase.js';
import PostsList from '~/components/PostsList.vue';

export default {
  components: {
    PostsList
  },
  async asyncData(context) {
    try {
      const posts = await fb.getPosts();

      return {
        posts
      };
    } catch (error) {}

    return {};
  }
};
</script>
