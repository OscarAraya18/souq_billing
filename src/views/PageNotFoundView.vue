<template>
  <PageNotFound></PageNotFound>
</template>

<script>
import { defineComponent } from 'vue';
import PageNotFound from '../components/PageNotFound.vue';

export default defineComponent({
  name: 'PageNotFoundView',
  components: {PageNotFound}
  
});
</script>
