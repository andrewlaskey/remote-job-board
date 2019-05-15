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
    <div class="container" v-else>
      <p>
        That is not a valid post id.
      </p>
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
