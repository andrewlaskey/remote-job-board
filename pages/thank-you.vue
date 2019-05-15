<template>
  <section>
    <div class="section">
      <div class="container">
        <header>
          <h1 class="title is-1 has-text-centered">
            Thank You
          </h1>
        </header>
        <div class="columns is-centered">
          <div class="column is-half content">
            <p>We have received your new post submission and it is currently awaiting approval. You should receive an email confirmation shortly.</p>
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
import fb from '~/helpers/firebase.js';
import PostStatus from '~/components/PostStatus.vue';

export default {
  components: {
    PostStatus
  },
  async asyncData({ query }) {
    try {
      const post = await fb.getPostStatus(query.id);

      return {
        post
      };
    } catch (error) {}

    return undefined;
  }
};
</script>
