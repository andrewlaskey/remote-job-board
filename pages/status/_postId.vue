<template>
  <section class="section">
    <div class="container">
      <post-status :post="post" />
    </div>
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
