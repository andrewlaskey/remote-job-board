<template>
  <section class="container">
    <div>
      <posts-list :posts="posts" />
    </div>
  </section>
</template>

<script>
import fb from '~/helpers/firebase.js';
import PostsList from '~/components/PostsList.vue';

export default {
  components: {
    PostsList
  },
  async asyncData({ params }) {
    try {
      const posts = await fb.getPostsByCategory(params.category);

      return {
        posts
      };
    } catch (error) {}

    return {};
  }
};
</script>
