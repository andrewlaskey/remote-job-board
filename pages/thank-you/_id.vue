<template>
  <section>
    <div 
      v-if="post"
      class="section"
    >
      <div class="container">
        <header>
          <h1 class="title is-1 has-text-centered">
            Thank You
          </h1>
        </header>
        <div class="columns is-centered">
          <div class="column is-half content">
            <p>
              We have received your new post submission and it is currently awaiting approval. You should receive an email confirmation shortly.
            </p>
            <p>
              You may view the status of your job listing at any time 
              <nuxt-link :to="`/status/${post.id}`">
                here
              </nuxt-link>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <post-status 
        v-if="post"
        :post="post" 
      />
      <div v-else class="container">
        <p>
          That is not a valid post id.
        </p>
      </div>
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
