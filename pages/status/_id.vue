<template>
  <section class="section">
    <div class="container">
      <header class="section">
        <h1 class="title is-1">
          Job Listing Status
        </h1>
      </header>
    </div>
    <post-status 
      v-if="post"
      :post="post" 
    />
    <div v-else class="container">
      <p>
        That is not a valid post id.
      </p>
    </div>
  </section>
</template>

<script>
import PostStatus from '~/components/PostStatus.vue';

export default {
  components: {
    PostStatus
  },
  async asyncData({ app, params }) {
    try {
      const post = await app.$fb.getPostStatus(params.id);

      return {
        post
      };
    } catch (error) {}

    return undefined;
  }
};
</script>
