<template>
  <section class="container">
    <div>
      <post-detail :post="post" />
    </div>
  </section>
</template>

<script>
import fb from '~/helpers/firebase.js';
import PostDetail from '~/components/PostDetail.vue';

export default {
  components: {
    PostDetail
  },
  async asyncData({ params }) {
    try {
      const post = await fb.getPostBySlug(params.postSlug);

      return {
        post
      };
    } catch (error) {}

    return {};
  }
};
</script>
