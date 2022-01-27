<template>
  <div class="hello">
    <button @click="executeGoogleSignIn">Sign in with Google</button>
    <button @click="executeGoogleSignOut">Sign out</button>
    
  </div>
</template>

<script>
import GoogleSignInService from "@/api/GoogleSignInService";

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  methods: {
    executeGoogleSignIn() {
      GoogleSignInService.signIn();
    },
    async executeGoogleSignOut(){
      const logout = await GoogleSignInService.signOut();
      console.log('logout', logout);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
