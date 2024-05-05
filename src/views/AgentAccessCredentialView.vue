<template>
  <div class="agentAccessCredentialsViewContainer">
    <v-card class="agentAccessCredentialInputsMainContainer" elevation="3">
      <div class="agentAccessCredentialLeftInputsContainer">
        <v-select v-model="input.selectedLocalityID" :items="display.localityOptions" :loading="loader.localityOptions" :disabled="navigation.localityOptionsInputIsDisabled" item-value="localityID" item-title="localityName" append-inner-icon="mdi-store" label="Localidad" variant="solo-filled"></v-select>
      </div>
      <div class="agentAccessCredentialRightInputsContainer">
        <v-autocomplete v-model="input.selectedAgentID" :items="display.agentOptions" :loading="loader.agentOptions" :disabled="navigation.agentOptionsInputIsDisabled" item-value="agentID" item-title="agentName" label="Nombre del agente" variant="solo-filled"></v-autocomplete>
      </div>
    </v-card>
    <br><br>
    <v-card v-if="navigation.agentAccessCredentialsContainer" class="agentAccessCredentialsContainer" elevation="3">
      <div v-if="loader.selectAgentAccessCredentials" class="agentAccessCredentialsLoaderContainer">
        <br>
        <v-progress-circular color="primary" indeterminate></v-progress-circular>
        <br><br>
      </div>
      <div v-else>
        <h2>Facturar</h2>
        <div v-for="agentAccessCredential in input.agentAccessCredentials.filter(agentAccessCredential => agentAccessCredential.agentAccessCredentialCategory === 'Facturar')" v-bind:key="agentAccessCredential">
          <v-progress-circular v-if="agentAccessCredential.agentAccessCredentialLoader" color="primary" indeterminate></v-progress-circular>
          <v-switch v-else v-model="agentAccessCredential.agentAccessCredentialIsActive" @change="updateAgentAccessCredential(agentAccessCredential)" :label="agentAccessCredential.agentAccessCredentialName" color="primary" hide-details></v-switch>
        </div>
        <br><br>
        <h2>Agentes</h2>
        <div v-for="agentAccessCredential in input.agentAccessCredentials.filter(agentAccessCredential => agentAccessCredential.agentAccessCredentialCategory === 'Agentes')" v-bind:key="agentAccessCredential">
          <v-progress-circular v-if="agentAccessCredential.agentAccessCredentialLoader" color="primary" indeterminate></v-progress-circular>
          <v-switch v-else v-model="agentAccessCredential.agentAccessCredentialIsActive" @change="updateAgentAccessCredential(agentAccessCredential)" :label="agentAccessCredential.agentAccessCredentialName" color="primary" hide-details></v-switch>
        </div>
        <br><br>
        <h2>Inventario</h2>
        <div v-for="agentAccessCredential in input.agentAccessCredentials.filter(agentAccessCredential => agentAccessCredential.agentAccessCredentialCategory === 'Inventario')" v-bind:key="agentAccessCredential">
          <v-progress-circular v-if="agentAccessCredential.agentAccessCredentialLoader" color="primary" indeterminate></v-progress-circular>
          <v-switch v-else v-model="agentAccessCredential.agentAccessCredentialIsActive" @change="updateAgentAccessCredential(agentAccessCredential)" :label="agentAccessCredential.agentAccessCredentialName" color="primary" hide-details></v-switch>
        </div>
        <br><br>
        <h2>Localidades</h2>
        <div v-for="agentAccessCredential in input.agentAccessCredentials.filter(agentAccessCredential => agentAccessCredential.agentAccessCredentialCategory === 'Localidades')" v-bind:key="agentAccessCredential">
          <v-progress-circular v-if="agentAccessCredential.agentAccessCredentialLoader" color="primary" indeterminate></v-progress-circular>
          <v-switch v-else v-model="agentAccessCredential.agentAccessCredentialIsActive" @change="updateAgentAccessCredential(agentAccessCredential)" :label="agentAccessCredential.agentAccessCredentialName" color="primary" hide-details></v-switch>
        </div>
        
      </div>
    </v-card>
  </div>

</template>

<style scoped>
  .agentAccessCredentialsViewContainer {
    margin: 2% 3% 0% 3%;
  }

  .agentAccessCredentialInputsMainContainer {
    display: flex;
    padding: 1%;
  }

  .agentAccessCredentialLeftInputsContainer {
    width: 40%;
    margin-right: 1%;
  }

  .agentAccessCredentialRightInputsContainer {
    width: 60%;
    margin-left: 1%;
  }

  .agentAccessCredentialsContainer {
    max-height: 65vh;
    overflow-y: auto;
    width: 100%;
    padding: 1%;
  }

  .agentAccessCredentialsLoaderContainer {
    text-align: center;
  }

  
</style>


<script>
import { defineComponent } from 'vue';
import generalFunctions from '../generalFunctions.js';


export default defineComponent({
  name: 'AgentAccessCredentialView',

  mixins: [generalFunctions],

  data: () => ({
    input: 
    {
      agentAccessCredentials: [],
      selectedLocalityID: null,
      selectedAgentID: null
    },

    display: 
    {
      localityOptions: [],
      agentOptions: []
    },

    navigation: 
    {
      localityOptionsInputIsDisabled: false,
      agentOptionsInputIsDisabled: true,
      agentAccessCredentialsContainer: false
    },

    loader:
    {
      localityOptions: false,
      agentOptions: false,
      selectAgentAccessCredentials: false
    }
  }),

  watch: {
    'input.selectedLocalityID': function() {
      this.selectAgentByLocalityID();
    },

    'input.selectedAgentID': async function() {
      this.selectAgentAccessCredentialByAgentID();
    }
  },

  mounted(){
    this.selectLocalityIDAndLocalityName();
  },

  methods: {
    async selectAgentByLocalityID(){
      this.navigation.localityOptionsInputIsDisabled = true;
      this.navigation.agentOptionsInputIsDisabled = true;
      this.navigation.agentAccessCredentialsContainer = false;
      this.input.agentAccessCredentials = [];
      this.loader.agentOptions = true;
      const selectAgentByLocalityIDRequestQuery = {'localityID': this.input.selectedLocalityID};
      const selectAgentByLocalityIDResult = await this.executeHttpPostRequest('/agent/select/byLocalityID', selectAgentByLocalityIDRequestQuery);
      if (selectAgentByLocalityIDResult.success){
        this.navigation.agentOptionsInputIsDisabled = false;
        this.display.agentOptions = selectAgentByLocalityIDResult.result;
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al consultar los nombres de los agentes, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
      }
      this.navigation.localityOptionsInputIsDisabled = false;
      this.loader.agentOptions = false;
    },

    async selectAgentAccessCredentialByAgentID(){
      this.navigation.agentAccessCredentialsContainer = true;
      this.navigation.localityOptionsInputIsDisabled = true;
      this.navigation.agentOptionsInputIsDisabled = true;
      this.loader.selectAgentAccessCredentials = true;
      const selectAgentAccessCredentialsRequestQuery = {'agentID': this.input.selectedAgentID};
      const selectAgentAccessCredentialsResult = await this.executeHttpPostRequest('/agentAccessCredential/select/byAgentID', selectAgentAccessCredentialsRequestQuery);
      if (selectAgentAccessCredentialsResult.success){
        this.input.agentAccessCredentials = selectAgentAccessCredentialsResult.result.map(agentAccessCredential => ({...agentAccessCredential, agentAccessCredentialLoader: false}));
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al consultar las credenciales de acceso del agente, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
        this.navigation.agentAccessCredentialsContainer = false;
      }
      this.navigation.localityOptionsInputIsDisabled = false;
      this.navigation.agentOptionsInputIsDisabled = false;
      this.loader.selectAgentAccessCredentials = false;
    },

    async updateAgentAccessCredential(agentAccessCredential){
      agentAccessCredential.agentAccessCredentialLoader = true;
      const updateAgentAccessCredentialRequestQuery = {'agentAccessCredentialID': agentAccessCredential.agentAccessCredentialID, 'agentID': this.input.selectedAgentID, 'agentAccessCredentialIsActive': agentAccessCredential.agentAccessCredentialIsActive};
      const selectAgentAccessCredentialsResult = await this.executeHttpPostRequest('/agentAccessCredential/update', updateAgentAccessCredentialRequestQuery);
      if (selectAgentAccessCredentialsResult.success){
        this.$root.notification.showNotificationSnackbar({snackbarMessage: `Se le ha ${agentAccessCredential.agentAccessCredentialIsActive == true ? 'otorgado' : 'retirado'} la credencial de acceso '${agentAccessCredential.agentAccessCredentialName}' al agente seleccionado`, snackbarColor: 'success', snackbarTimer: 3000});
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al actualizar las credenciales de acceso del agente, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
        agentAccessCredential.agentAccessCredentialIsActive = !agentAccessCredential.agentAccessCredentialIsActive;
      }
      agentAccessCredential.agentAccessCredentialLoader = false;
    },

    async selectLocalityIDAndLocalityName(){
      this.navigation.localityOptionsInputIsDisabled = true;
      this.navigation.agentOptionsInputIsDisabled = true;
      this.loader.localityOptions = true;
      const selectLocalityIDAndLocalityNameResult = await this.executeHttpPostRequest('/locality/select/localityIDAndLocalityName');
      if (selectLocalityIDAndLocalityNameResult.success){
        this.display.localityOptions = selectLocalityIDAndLocalityNameResult.result;
        this.navigation.localityOptionsInputIsDisabled = false;
        this.navigation.agentOptionsInputIsDisabled = false;
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al consultar las localidades, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
      }
      this.loader.localityOptions = false;
    }
  }
});
</script>
