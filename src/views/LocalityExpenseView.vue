<template>
  <div class="localityExpenseViewContainer">
    <v-card class="localityExpenseChartsContainer" elevation="3">
      <div class="localityExpenseChartsInputContainer">
        <v-select v-model="input.selectedLocalityIDS" :items="display.localityOptions" :loading="loader.localityOptions" multiple chips item-title="localityName" item-value="localityID" append-inner-icon="mdi-store" label="Localidad" variant="solo-filled" class="localityOptionsInput"></v-select>
        <v-text-field v-model="display.startDateFormatted" @click="navigation.startDatePickerIsVisible = true" readonly label="Fecha inicial" append-inner-icon="mdi-calendar" class="initialDateInput"></v-text-field>
        <v-dialog v-model="navigation.startDatePickerIsVisible" width="20%">
          <v-card style="display: flex;">
            <v-date-picker v-model="input.startDate" hide-header color="primary" width="100%"></v-date-picker>
            <v-chip @click="input.startDate = new Date()" class="selectTodayChip" color="primary" variant="flat">Hoy</v-chip>
          </v-card>
        </v-dialog>
        <v-text-field v-model="display.endDateFormatted" @click="navigation.endDatePickerIsVisible = true" readonly label="Fecha final" append-inner-icon="mdi-calendar" class="endDateInput"></v-text-field>
        <v-dialog v-model="navigation.endDatePickerIsVisible" width="20%">
          <v-card>
            <v-date-picker v-model="input.endDate" hide-header color="primary" width="100%"></v-date-picker>
            <v-chip @click="input.endDate = new Date()" class="selectTodayChip" color="primary" variant="flat">Hoy</v-chip>
          </v-card>
        </v-dialog>
      </div>
      <div class="localityExpenseChartsButtonContainer">
        <div v-if="loader.selectLocalityExpense" class="localityExpenseLoaderContainer">
          <v-progress-circular color="primary" indeterminate></v-progress-circular>
        </div>
        <div v-else>
          <v-btn @click="selectLocalityExpenseByLocalityExpenseLocalityIDAndByLocalityExpenseDateTime()" :disabled="navigation.selectLocalityExpenseIsDisabled" dark block height="38" color="primary">
            <h3>BUSCAR</h3>
            <v-icon style="margin-left: 20px;" dark right>mdi-magnify</v-icon>
          </v-btn>
          <br>
          <v-btn @click="openInsertLocalityExpenseModal()" :disabled="navigation.selectLocalityExpenseIsDisabled" dark block height="38" color="success">
            <h3>AGREGAR</h3>
            <v-icon style="margin-left: 20px;" dark right>mdi-plus-circle</v-icon>
          </v-btn>
          <v-dialog v-model="navigation.insertLocalityExpenseModalIsVisible" width="500">
            <v-card width="500" class="insertLocalityExpenseModalContainer">
              <v-text-field v-model="input.insertedLocalityExpenseName" :rules="[input.insertedLocalityExpenseRules.insertedLocalityExpenseNameRequired, input.insertedLocalityExpenseRules.insertedLocalityExpenseNameLength]" prepend-inner-icon="mdi-message-text" label="Nombre del gasto" variant="solo-filled"></v-text-field>              
              <v-text-field v-model="input.insertedLocalityExpenseAmount" v-if="input.insertedLocalityExpenseCurrency == '₡'" :rules="[input.insertedLocalityExpenseRules.insertedLocalityExpenseAmountRequired, input.insertedLocalityExpenseRules.insertedLocalityExpenseAmountNumeric]" prefix="₡" prepend-inner-icon="mdi-cash-minus" label="Cantidad del gasto" variant="solo-filled"></v-text-field>
              <v-text-field v-model="input.insertedLocalityExpenseAmount" v-else :rules="[input.insertedLocalityExpenseRules.insertedLocalityExpenseAmountRequired, input.insertedLocalityExpenseRules.insertedLocalityExpenseAmountNumeric]" suffix="$" prepend-inner-icon="mdi-cash-minus" label="Cantidad del gasto" variant="solo-filled"></v-text-field>
              <v-select v-model="input.insertedLocalityExpenseCurrency" :items="display.localityExpenseCurrencyOptions" append-inner-icon="mdi-circle-multiple" label="Divisa del gasto" variant="solo-filled"></v-select>
              <v-textarea v-model="input.insertedLocalityExpenseDescription" :rules="[input.insertedLocalityExpenseRules.insertedLocalityExpenseDescriptionRequired, input.insertedLocalityExpenseRules.insertedLocalityExpenseDescriptionLength]" prepend-inner-icon="mdi-information-outline" label="Descripción del gasto" variant="solo-filled"></v-textarea>
              <v-text-field v-model="display.insertedLocalityExpenseDateFormatted" @click="navigation.insertedLocalityExpenseDatePickerIsVisible = true" readonly label="Fecha del gasto" append-inner-icon="mdi-calendar" class="initialDateInput"></v-text-field>
              <v-dialog v-model="navigation.insertedLocalityExpenseDatePickerIsVisible" width="20%">
                <v-card style="display: flex;">
                  <v-date-picker v-model="input.insertedLocalityExpenseDateTime" hide-header color="primary" width="100%"></v-date-picker>
                  <v-chip @click="input.insertedLocalityExpenseDateTime = new Date()" class="selectTodayChip" color="primary" variant="flat">Hoy</v-chip>
                </v-card>
              </v-dialog>
              <v-select v-model="input.insertedLocalityExpenseLocalityExpenseCategoryID" :items="display.localityExpenseCategoryOptions" item-title="localityExpenseCategoryName" item-value="localityExpenseCategoryID" append-inner-icon="mdi-chart-bar-stacked" label="Categoría del gasto" variant="solo-filled"></v-select>
              <v-select v-model="input.insertedLocalityExpenseLocalityID" :rules="[input.insertedLocalityExpenseRules.insertedLocalityExpenseLocalityIDRequired]" :items="display.localityOptions" :loading="loader.localityOptions" item-title="localityName" item-value="localityID" append-inner-icon="mdi-store" label="Localidad del gasto" variant="solo-filled" class="localityOptionsInput"></v-select>

            </v-card>
          </v-dialog>
        </div>
      </div>
    </v-card>

  </div>

</template>

<style scoped>
  .localityExpenseViewContainer {
    margin: 2% 3% 0% 3%;
  }

  .localityExpenseChartsContainer {
    padding: 1%;
    display: flex;
  }

  .localityExpenseChartsInputContainer {
    width: 80%;
    display: flex;
    margin-right: 1%;
    position: relative;
    top: 15px;
  }

  .localityOptionsInput {
    margin-right: 1%;
  }

  .initialDateInput {
    margin-left: 1%;
    margin-right: 1%;
  }

  .endDateInput {
    margin-left: 1%;
  }

  .selectTodayChip {
    margin: 0% 5% 5% 5%;
    text-align: center;
    cursor: pointer;
  }

  .localityExpenseChartsButtonContainer {
    position: relative;
    width: 20%;
    margin-left: 1%;
  }

  .localityExpenseLoaderContainer {
    text-align: center;
  }

  .insertLocalityExpenseModalContainer {
    padding: 20px;
  }

</style>

<script>
import { defineComponent } from 'vue';
import generalFunctions from '../generalFunctions.js';

export default defineComponent({
  name: 'LocalityExpenseView',
  mixins: [generalFunctions],


  data: () => ({
    input: 
    {
      selectedLocalityIDS: [],
      startDate: null,
      endDate: null,

      insertedLocalityExpenseName: '',
      insertedLocalityExpenseAmount: '',
      insertedLocalityExpenseCurrency: '₡',
      insertedLocalityExpenseDescription: '',
      insertedLocalityExpenseDateTime: null,
      insertedLocalityExpenseLocalityExpenseCategoryID: null,
      insertedLocalityExpenseLocalityID: null,
      insertedLocalityExpenseFile: null,

      insertedLocalityExpenseRules: {
        insertedLocalityExpenseNameRequired: value => /\S/.test(value) || 'El nombre del gasto es obligatorio',
        insertedLocalityExpenseAmountRequired: value => /\S/.test(value) || 'La cantidad del gasto es obligatoria',
        insertedLocalityExpenseDescriptionRequired: value => /\S/.test(value) || 'La descripción del gasto es obligatoria',
        insertedLocalityExpenseLocalityIDRequired: value => value != null || 'La localidad del gasto es obligatoria',

        insertedLocalityExpenseAmountNumeric: value => /^-?\d*\.?\d+$/.test(value) || 'La cantidad del gasto debe ser numérica',
        
        insertedLocalityExpenseNameLength: value => value.length <= 100 || 'El nombre del gasto no puede exceder los 100 caracteres',
        insertedLocalityExpenseDescriptionLength: value => value.length <= 65000 || 'El nombre del gasto no puede exceder los 65000 caracteres',

      }
    },

    display:
    {
      localityOptions: [],
      localityExpenseCurrencyOptions: ['₡', '$'],
      localityExpenseCategoryOptions: [],
      startDateFormatted: '',
      insertedLocalityExpenseDateFormatted: '',
      endDateFormatted: ''
    },

    loader:
    {
      localityOptions: false,
      selectLocalityExpense: false
    },

    navigation:
    {
      startDatePickerIsVisible: false,
      endDatePickerIsVisible: false,
      selectLocalityExpenseIsDisabled: false,
      insertLocalityExpenseModalIsVisible: false,
      insertedLocalityExpenseDatePickerIsVisible: false
    },


    options: {
      chart: {
        id: 'vuechart-example'
      },
      xaxis: {
        categories: [
         "Jan",
         "Feb",
         "Mar",
         "Apr",
         "May",
         "Jun",
         "Jul",
         "Aug",
         "Sep",
         "Oct",
         "Nov",
         "Dec"
        ]
      }
    },
    series: [{
      name: 'series-1',
      data: [55, 62, 89, 66, 98, 72, 101, 75, 94, 120, 117, 139]
    }]

  }),

  watch: {
    'input.startDate': function() {
      this.display.startDateFormatted = new Date(this.input.startDate).toLocaleDateString('en-GB');
      this.navigation.startDatePickerIsVisible = false;
    },
    'input.endDate': function() {
      this.display.endDateFormatted = new Date(this.input.endDate).toLocaleDateString('en-GB');
      this.navigation.endDatePickerIsVisible = false;
    },
    'input.insertedLocalityExpenseDateTime': function() {
      this.display.insertedLocalityExpenseDateFormatted = new Date(this.input.insertedLocalityExpenseDateTime).toLocaleDateString('en-GB');
      this.navigation.insertedLocalityExpenseDatePickerIsVisible = false;
    },
  },

  methods: {
    async selectLocalityIDAndLocalityName(){
      this.loader.localityOptions = true;
      this.navigation.selectLocalityExpenseIsDisabled = true;
      const selectLocalityIDAndLocalityNameResult = await this.executeHttpPostRequest('/locality/select/localityIDAndLocalityName');
      if (selectLocalityIDAndLocalityNameResult.success){
        this.navigation.selectLocalityExpenseIsDisabled = false;
        this.display.localityOptions = selectLocalityIDAndLocalityNameResult.result;
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al consultar las localidades, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
      }
      this.loader.localityOptions = false;
    },

    async selectLocalityExpenseCategoryIDAndLocalityExpenseCategoryName(){
      const selectLocalityExpenseCategoryIDAndLocalityExpenseCategoryNameResult = await this.executeHttpPostRequest('/localityExpenseCategory/select/localityExpenseCategoryIDAndLocalityExpenseCategoryName');
      if (selectLocalityExpenseCategoryIDAndLocalityExpenseCategoryNameResult.success){
        this.display.localityExpenseCategoryOptions = selectLocalityExpenseCategoryIDAndLocalityExpenseCategoryNameResult.result;
        return true;
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al consultar las categorías de los gastos, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
        return false;
      }
    },

    async openInsertLocalityExpenseModal(){
      if (await this.selectLocalityExpenseCategoryIDAndLocalityExpenseCategoryName()){
        this.navigation.insertLocalityExpenseModalIsVisible = true;
        this.input.insertedLocalityExpenseName = '';
        this.input.insertedLocalityExpenseAmount = '';
        this.input.insertedLocalityExpenseCurrency = '₡';
        this.input.insertedLocalityExpenseDescription = '';
        this.input.insertedLocalityExpenseDateTime = new Date();
        this.input.insertedLocalityExpenseLocalityExpenseCategoryID = null;
        this.input.insertedLocalityExpenseLocalityID = null;
        this.input.insertedLocalityExpenseFile = null;
      }
    },

    async selectLocalityExpenseByLocalityExpenseLocalityIDAndByLocalityExpenseDateTime(){
      if (this.input.selectedLocalityIDS.length > 0){
        if (this.input.startDate != null){
          if (this.input.endDate != null){
            this.loader.selectLocalityExpense = true;
            const selectLocalityExpenseRequestQuery = 
            {
              'localityExpenseLocalityIDS': this.input.selectedLocalityIDS,
              'localityExpenseStartDateTime': this.input.startDate,
              'localityExpenseEndDateTime': this.input.endDate
            };
            const selectLocalityExpenseResult = await this.executeHttpPostRequest('/localityExpense/select/byLocalityExpenseLocalityIDAndByLocalityExpenseDateTime', selectLocalityExpenseRequestQuery);
            if (selectLocalityExpenseResult.success){
              //
            } else {
              this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al consultar el reporte de gastos, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
            }
            this.loader.selectLocalityExpense = false;

          } else {
            this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Debe colocar una fecha final para el reporte de gastos', snackbarColor: 'warning', snackbarTimer: 3000});
          }
        } else {
          this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Debe colocar una fecha inicial para el reporte de gastos', snackbarColor: 'warning', snackbarTimer: 3000});
        }
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Debe colocar al menos una localidad para el reporte de gastos', snackbarColor: 'warning', snackbarTimer: 3000});
      }
    },

    placeDefaultDates(){
      this.input.startDate = new Date(new Date().setDate(1));
      this.input.endDate = new Date();
    }
  },


  mounted(){
    this.selectLocalityIDAndLocalityName();
    this.placeDefaultDates();
  }
});
</script>
