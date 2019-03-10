<template>
  <footer id="footer" class="footer">
    <div class="columns is-centered">
      <div class="column is-6">
        <div class="level">
          <div class="level-item">
            <nuxt-link to="/">Home</nuxt-link>
          </div>
          <div class="level-item">
            <nuxt-link to="/">About</nuxt-link>
          </div>
          <div class="level-item">
            <nuxt-link to="/">Contact</nuxt-link>
          </div>
          <div class="level-item">
            <nuxt-link to="/new">
              <strong>Post a Job</strong>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'GlobalFooter',

  data() {
    return {};
  }
};
</script>
