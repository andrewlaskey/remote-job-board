<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-three-quarters">
          <h1 class="title">
            Contact
          </h1>
          <form accept-charset="UTF-8" action="https://usebasin.com/f/6a4f72ca11e4" method="POST">
            <div class="field">
              <label class="label">
                Name
              </label>
              <div class="control">
                <input id="name" class="input" type="text" name="name" required>
              </div>
            </div>
            <div class="field">
              <label class="label">
                Email
              </label>
              <div class="control">
                <input id="email" class="input" type="email" name="email" required>
              </div>
            </div>
            <div class="field">
              <label class="label">
                Subject
              </label>
              <div class="control">
                <div class="select">
                  <select id="subject" name="subject">
                    <option>Edit my listing</option>
                    <option>Remove my listing</option>
                    <option>Report a listing</option>
                    <option>Payments</option>
                    <option>Feature Request</option>
                    <option>General question or comment</option>
                  </select>
                </div>
              </div>
            </div>
            <label class="label">
              Comment
            </label>
            <div class="field">
              <div class="control">
                <textarea id="comment" class="textarea" name="comment"></textarea>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <button class="button is-primary" type="submit">
                  Contact Us
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  components: {}
};
</script>
