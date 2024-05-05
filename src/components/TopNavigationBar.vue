<template>
  <v-app-bar color="info">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="changeNavigationDrawerIsVisible()"></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title @click="navigateTo('/bill')" class="navigationTopBarTitle">SOUQ</v-app-bar-title>

    <template v-slot:append>
      <v-btn icon><v-icon>mdi-account-circle</v-icon></v-btn>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-model="navigation.navigationDrawerIsVisible" absolute temporary class="bg-info" theme="dark" style="min-width: 20%;">
    <v-list>
      <v-list-item @click="navigateTo('/bill')" prepend-icon="mdi-cart" title="Facturar"></v-list-item>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-account-circle" title="Agentes"></v-list-item>
        </template>
        <v-list-item @click="navigateTo('/agentStore')" class="navigationDrawerOption" prepend-icon="mdi-store" title="Vendedores"></v-list-item>
        <v-list-item @click="navigateTo('/agentCallCenter')" class="navigationDrawerOption" prepend-icon="mdi-phone" title="Call center"></v-list-item>
        <v-list-item @click="navigateTo('/agentDelivery')" class="navigationDrawerOption" prepend-icon="mdi-motorbike" title="Motorizados"></v-list-item>
        <v-list-item @click="navigateTo('/agentAdministrator')" class="navigationDrawerOption" prepend-icon="mdi-security" title="Administradores"></v-list-item>
        <v-list-item @click="navigateTo('/agentAccessCredential')" class="navigationDrawerOption" prepend-icon="mdi-cog-outline" title="Credenciales de acceso"></v-list-item>
      </v-list-group>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-warehouse" title="Inventario"></v-list-item>
        </template>
        <v-list-item @click="navigateTo('/productGeneralSearch')" prepend-icon="mdi-magnify" title="Búsqueda general"></v-list-item>
        <v-list-item @click="navigateTo('/productManagement')" prepend-icon="mdi-cog" title="Manejo de productos"></v-list-item>
        <v-list-item @click="navigateTo('/productInAndOut')" prepend-icon="mdi-arrow-top-right-bottom-left" title="Entrada/Salida"></v-list-item>
        <v-list-item @click="navigateTo('/productReplacement')" prepend-icon="mdi-store" title="Reposición de inventario"></v-list-item>
      </v-list-group>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-store" title="Localidades"></v-list-item>
        </template>
        <v-list-item @click="navigateTo('/localityExpense')" prepend-icon="mdi-cash-multiple" title="Reporte de gastos"></v-list-item>
      </v-list-group>


    </v-list>
  </v-navigation-drawer>
    


</template>


<style scoped>
.navigationTopBarTitle {
  cursor: pointer;
}

</style>


<script>
import generalFunctions from '../generalFunctions.js';

export default {
  name: 'TopNavigationBar',

  mixins: [generalFunctions],

  data: () => ({
    navigation: 
    {
      navigationDrawerIsVisible: false
    },

    
  }),

  methods: {
    changeNavigationDrawerIsVisible(){
      this.navigation.navigationDrawerIsVisible = !this.navigation.navigationDrawerIsVisible;
    }

  }
}
</script>
