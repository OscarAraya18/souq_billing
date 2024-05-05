<template>
  <v-app>
    <v-main>
      <NotificationSnackbar ref="notification"></NotificationSnackbar>

      <router-view/>
    </v-main>
  </v-app>
</template>

<style>
:root {
  --warningFontColor: #B00020;
}
</style>


<script>
import NotificationSnackbar from './components/NotificationSnackbar.vue';

export default {
  name: 'App',

  components: {NotificationSnackbar},

  data: () => ({}),

  mounted(){
    this.$root.notification = this.$refs.notification;

  }
}
</script>
