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
import PostDetail from '~/components/PostDetail.vue';

export default {
  components: {
    PostDetail
  },
  async asyncData({ app, params, payload }) {
    if (payload) {
      return {
        post: payload
      };
    } else {
      try {
        const post = await app.$fb.getPostBySlug(params.postSlug);

        return {
          post
        };
      } catch (error) {}
    }

    return {};
  }
};
</script>
