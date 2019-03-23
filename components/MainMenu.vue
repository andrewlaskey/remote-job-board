<template>
  <div id="main-menu">
    <nav class="navbar">
      <div class="navbar-brand">
        <nuxt-link class="navbar-item" to="/">
          <span class="title is-4 is-family-secondary">workremotelist.com</span>
        </nuxt-link>
        <div class="navbar-burger burger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="navbar-menu">
        <!-- Navbar End -->
        <div class="navbar-end">
          <div class="navbar-item has-dropdown is-hoverable">
            <nuxt-link class="navbar-link" to="/">
              <strong>Find a Job</strong>
            </nuxt-link>
            <div class="navbar-dropdown is-boxed">
              <nuxt-link v-for="(name, slug) in categories" :key="slug" class="navbar-item" :to="categoryUrl(slug)">
                {{ name }}
              </nuxt-link>
            </div>
          </div>

          <div class="navbar-item">
            <div class="field is-grouped">
              <p class="control">
                <nuxt-link class="button is-primary" to="/new">
                  <span class="icon">
                    <fa :icon="['fas', 'plus']" />
                  </span>
                  <span>
                    Post a Job
                  </span>
                </nuxt-link>
              </p>
            </div>
          </div>
        </div>
        <!-- /Navbar End -->
      </div>
    </nav>
  </div>
</template>

<script>
import options from './../helpers/options.js';

export default {
  name: 'MainMenu',

  components: {},

  data() {
    return {
      categories: {}
    };
  },

  computed: {},

  mounted() {
    this.categories = options.categoryOptions;
  },

  methods: {
    categoryUrl: options.getCategoryUrl
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  padding-left: 1em;
  padding-right: 1em;
}
</style>
