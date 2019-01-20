<template>
  <div id="main-menu">
    <nav class="navbar">
      <div class="navbar-brand">
        <nuxt-link class="navbar-item" to="/">
          <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
        </nuxt-link>
        <div class="navbar-burger burger" data-target="navbarExampleTransparentExample">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div id="navbarExampleTransparentExample" class="navbar-menu">
        <!-- Navbar End -->
        <div class="navbar-end">
          <div class="navbar-item has-dropdown is-hoverable">
            <nuxt-link class="navbar-link" to="/">
              Find a Job
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
                <nuxt-link class="button" to="/new">
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
