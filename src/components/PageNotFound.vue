<template>
  <div class="pageNotFoundContainer">
    <h1 class="pageNotFoundTitle">404</h1>
    <p class="pageNotFoundSubtitle">La página solicitada ha sido movida, eliminada o probablemente nunca existió</p>
    <br>
    <br>
    <v-btn color="black" size="x-large" @click="navigateTo('/')">
      <p class="pageNotFoundButtonText">Regresar al inicio</p>
    </v-btn>
  </div>
</template>

<style scoped>
  .pageNotFoundContainer{
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  .pageNotFoundTitle{
    font-size: 180px;
  }
  .pageNotFoundSubtitle{
    font-size: 25px;  
  }
  .pageNotFoundNote{
    font-size: 20px; 
    color: gray; 
  }
  .pageNotFoundButtonText{
    font-size: 20px;
  }

  @media screen and (max-width: 770px) {
    .pageNotFoundTitle{
      font-size: 160px;
    }
    .pageNotFoundSubtitle{
      font-size: 18px;
      color: gray;  
    }
    .pageNotFoundButtonText{
      font-size: 15px;
    }
  }

  @media screen and (max-width: 380px) {
    .pageNotFoundTitle{
      font-size: 140px;
    }
    .pageNotFoundSubtitle{
      font-size: 15px;
      color: gray;  
    }
    .pageNotFoundButtonText{
      font-size: 12px;
    }
  }
  
</style>

<script>
import generalFunctions from '../generalFunctions.js';

export default {
  name: 'PageNotFound',
  mixins: [generalFunctions],

  data: () => ({}),

  mounted(){},

  methods: {
  }

}
</script>
