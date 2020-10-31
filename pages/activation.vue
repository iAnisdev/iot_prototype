<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-overlay :value="overlay">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-col align="center" justify="center" v-if="!overlay">
          <v-avatar class="profile" size="72" tile>
            <v-img src="/success.png" v-if="emailVerified"></v-img>
            <v-img src="/warning.png" v-if="!emailVerified"></v-img>
          </v-avatar>
          <br />
          <h3 class="green--text" v-if="emailVerified">Congratulations!</h3>
          <h3 class="red--text" v-if="!emailVerified">Error!</h3>
          <p v-if="emailVerified">Your email has been verified...</p>
          <p v-if="!emailVerified" class="red--text">{{emailErr}}</p>
          <nuxt-link to="/login" v-if="emailVerified">Login Now</nuxt-link>
          <nuxt-link to="/login" v-if="!emailVerified">Home Page</nuxt-link>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  auth: false,
  data: () => ({
    emailVerified: false,
    emailErr: null,
    overlay: false
  }),
  methods: {
    ...mapActions({
      verifiyEmail: "verifiyEmail"
    }),
    init(data) {
      this.overlay = true;
      this.verifiyEmail(data)
        .then(res => {
          this.emailVerified = true;
        })
        .catch(err => {
          this.emailVerified = false;
          this.emailErr = err.message;
        })
        .finally(() => {
          this.overlay = false;
        });
    }
  },
  mounted() {
    if (this.$route.query.email && this.$route.query.token) {
      this.init(this.$route.query);
    } else {
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.profile {
  margin-bottom: 2vh;
}
</style>
