<template>
  <div class="container">
    <ul>
      <li v-for="(post, index) in posts" :key="index">
        <post-preview :post="post" />
      </li>
    </ul>
  </div>
</template>

<script>
import PostPreview from './PostPreview.vue';

export default {
  name: 'PostsList',

  components: {
    PostPreview
  },

  props: {
    posts: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },

  data() {
    return {};
  }
};
</script>
