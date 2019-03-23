<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-three-quarters">
          <post-detail :post="post" />
        </div>
      </div>
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
