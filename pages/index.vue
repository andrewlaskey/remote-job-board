<template>
  <section class="section">
    <posts-list :posts="posts" />
  </section>
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
