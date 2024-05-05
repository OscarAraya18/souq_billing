<template>
  <v-snackbar v-model="navigation.snackbarIsVisible" :color="display.snackbarColor" :timeout="display.snackbarTimer" top left>
    {{ display.snackbarMessage }}
  </v-snackbar>
</template>

<script>
export default {
  name: "NotificationSnackbar",

  data: () => ({
    navigation: 
    {
      snackbarIsVisible: false
    },

    display: 
    {
      snackbarMessage: '',
      snackbarColor: '',
      snackbarTimer: 0
    }

  }),

  methods:{
    showNotificationSnackbar(notificationSnackbarData) {
      this.display.snackbarMessage = notificationSnackbarData.snackbarMessage;
      this.display.snackbarColor = notificationSnackbarData.snackbarColor;
      this.display.snackbarTimer = notificationSnackbarData.snackbarTimer || 3000;
      this.navigation.snackbarIsVisible = true
    }
  }
}
</script>