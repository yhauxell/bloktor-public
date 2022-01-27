<template>
  <div>
    <Modal title="" :closable="false">
      <template #content>
        <div class="flex flex-col text-center justify-items-center">
          <img src="logo_bloktor.svg" alt="" class="w-1/3 self-center mb-10" />

          <h1 class="font-bold text-xl">Login</h1>
          <p class="mb-10">
            We use Google third party authentication SDK, Google's popup will
            come after you click the button bellow
          </p>
          <Button @click="onLogin" class="google-auth-btn w-1/2 self-center">
            Login with Google
          </Button>
        </div>
      </template>
    </Modal>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["login"]),

    onLogin() {
      this.login(() => {
        this.$router.push("/");
      });
    }
  }
};
</script>

<style scoped>
.google-auth-btn {
  @apply bg-white;
  background-image: url("/google-auth/btn_google_light_normal_ios.svg");
  background-position: left center;
  background-repeat: no-repeat;

  padding-left: 2.6rem;
  color: #000;
  border: 1px solid #ccc;
}
.google-auth-btn:hover {
  @apply bg-gray-50;
}
</style>
