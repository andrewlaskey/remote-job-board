<template>
  <section class="section">
    <post-status :post="post" />
  </section>
</template>

<script>
import fb from '~/helpers/firebase.js';
import PostStatus from '~/components/PostStatus.vue';

export default {
  components: {
    PostStatus
  },
  async asyncData({ params }) {
    try {
      const post = await fb.getPostStatus(params.postId);

      return {
        post
      };
    } catch (error) {}

    return {};
  }
};
</script>
