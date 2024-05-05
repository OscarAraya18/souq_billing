<template>
  <div>
    <TopNavigationBar />
    <router-view />
  </div>
</template>

<script>
import TopNavigationBar from '../components/TopNavigationBar.vue';

export default {
  components: {
    TopNavigationBar
  }
}
</script>

<style>
</style>