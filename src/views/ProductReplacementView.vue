<template>
  <div class="productReplacementViewContainer">
    <v-card class="productReplacementInputsMainContainer" elevation="3">
      <div class="productReplacementLeftInputsContainer">
        <v-select v-model="input.selectedLocalityID" :items="display.localityOptions" :loading="loader.localityOptions" item-title="localityName" item-value="localityID" append-inner-icon="mdi-store" label="Localidad" variant="solo-filled"></v-select>
        <v-text-field v-model="input.productIDOrName" append-inner-icon="mdi-magnify" label="Código o nombre del producto (opcional)" variant="solo-filled"></v-text-field>
      </div>
      <div class="productReplacementCenterInputsContainer">
        <v-text-field v-model="display.startDateFormatted" @click="navigation.startDatePickerIsVisible = true" readonly label="Fecha inicial" append-inner-icon="mdi-calendar"></v-text-field>
        <v-dialog v-model="navigation.startDatePickerIsVisible" width="20%">
          <v-card style="display: flex;">
            <v-date-picker v-model="input.startDate" hide-header color="primary" width="100%"></v-date-picker>
            <v-chip @click="input.startDate = new Date()" class="selectTodayChip" color="primary" variant="flat">Hoy</v-chip>
          </v-card>
        </v-dialog>
        <v-text-field v-model="display.endDateFormatted" @click="navigation.endDatePickerIsVisible = true" readonly label="Fecha final" append-inner-icon="mdi-calendar"></v-text-field>
        <v-dialog v-model="navigation.endDatePickerIsVisible" width="20%">
          <v-card>
            <v-date-picker v-model="input.endDate" hide-header color="primary" width="100%"></v-date-picker>
            <v-chip @click="input.startDate = new Date()" class="selectTodayChip" color="primary" variant="flat">Hoy</v-chip>
          </v-card>
        </v-dialog>
      </div>
      <div class="productReplacementRightInputsContainer">
        <div v-if="loader.selectProductReplacement" class="productReplacementLoaderContainer">
          <v-progress-circular color="primary" indeterminate class="productReplacementLoader"></v-progress-circular>
        </div>
        <div v-else>
          <v-btn @click="selectProductReplacement()" :disabled="navigation.selectProductReplacementIsDisabled" block dark height="38" color="primary" style="margin-bottom: 10px;">
            <h3>BUSCAR</h3>
            <v-icon style="margin-left: 20px;" dark right>mdi-magnify</v-icon>
          </v-btn>
          <v-btn @click="downloadExcelReport()" :disabled="navigation.excelReportIsDisabled" block dark height="38" color="green" style="margin-bottom: 10px;">
            <h3>DESCARGAR COMO EXCEL</h3>
            <v-icon style="margin-left: 20px;" dark right>mdi-microsoft-excel</v-icon>
          </v-btn>
          <v-btn @click="downloadPDFReport()" :disabled="navigation.pdfReportIsDisabled" block dark height="38" color="error">
            <h3>DESCARGAR COMO PDF</h3>
            <v-icon style="margin-left: 20px;" dark right>mdi-file-pdf-box</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card>
    <br><br>
    <v-card class="currentProductsTableContainer" elevation="3">
      <v-data-table :headers="display.currentProductsTableHeaders" :items="display.currentProducts">
        <template v-slot:item.productIsReady="{ item }">
          <v-checkbox v-model="item.productIsReady"></v-checkbox>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<style scoped>
  .productReplacementViewContainer {
    margin: 2% 3% 0% 3%;
  }

  .productReplacementInputsMainContainer {
    display: flex;
    padding: 1%;
  }

  .productReplacementLeftInputsContainer {
    width: 40%;
    margin-right: 1%;
  }

  .productReplacementCenterInputsContainer {
    width: 40%;
    margin-left: 1%;
    margin-right: 1%;
  }

  .productReplacementRightInputsContainer {
    width: 20%;
    margin-left: 1%;
  }

  .productReplacementLoaderContainer {
    text-align: center;
  }

  .productReplacementLoader {
    top: 55px;
    position: relative;
  }

  .startDateInputContainer {
    width: 50%;
    margin-right: 2%;
  }

  .endDateInputContainer {
    width: 50%;
    margin-left: 2%;
  }

  .currentProductsTableContainer {
    max-height: 550px;
    overflow-y: auto;
    padding: 1%;
  }

  .selectTodayChip {
    margin: 0% 5% 5% 5%;
    text-align: center;
    cursor: pointer;
  }
</style>

<script>
import { defineComponent } from 'vue';
import generalFunctions from '../generalFunctions.js';

export default defineComponent({
  name: 'ProductReplacementView',

  mixins: [generalFunctions],

  data: () => ({

    input: 
    {
      productIDOrName: '',
      selectedLocalityID: null,
      startDate: null,
      endDate: null
    },

    display: 
    {
      localityOptions: [],
      startDateFormatted: '',
      endDateFormatted: '',

      currentProducts: [],
      currentProductsTableHeaders: 
      [
        {key: 'productIsReady', title: 'LISTO'},
        {key: 'productID', title: 'CÓDIGO INTERNO'},
        {key: 'productSKU', title: 'SKU'},
        {key: 'productName', title: 'NOMBRE'},
        {key: 'productAmount', title: 'CANTIDAD'}
      ]
    },

    loader: 
    {
      selectProductReplacement: false,
      localityOptions: false
    },

    navigation: 
    {
      startDatePickerIsVisible: false,
      endDatePickerIsVisible: false,

      selectProductReplacementIsDisabled: false,

      excelReportIsDisabled: true,
      pdfReportIsDisabled: true,

      excelReportFile: null,
      excelReportName: '',

      pdfReportFile: null,
      pdfReportName: ''
    },

    localStorage:
    {
      userName: '',
      userUsername: '',
      userType: ''
    }

  }),

  watch: {
    'input.startDate': function() {
      this.display.startDateFormatted = new Date(this.input.startDate).toLocaleDateString('en-GB');
      this.navigation.startDatePickerIsVisible = false;
    },
    'input.endDate': function() {
      this.display.endDateFormatted = new Date(this.input.endDate).toLocaleDateString('en-GB');
      this.navigation.endDatePickerIsVisible = false;
    }
  },

  methods: {
    async selectLocalityIDAndLocalityName(){
      this.navigation.selectProductReplacementIsDisabled = true;
      this.loader.localityOptions = true;
      const selectLocalityIDAndLocalityNameResult = await this.executeHttpPostRequest('/locality/select/localityIDAndLocalityName');
      if (selectLocalityIDAndLocalityNameResult.success){
        this.navigation.selectProductReplacementIsDisabled = false;
        this.display.localityOptions = selectLocalityIDAndLocalityNameResult.result;
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al consultar las localidades, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
      }
      this.loader.localityOptions = false;
    },

    placeDefaultDates(){
      this.input.startDate = new Date(Date.now() - 86400000);
      this.input.endDate = new Date(Date.now() - 86400000);
    },

    getLocalStorageData(){
      this.localStorage.userName = localStorage.getItem('userName');
      this.localStorage.userUsername = localStorage.getItem('userUsername');
      this.localStorage.userType = localStorage.getItem('userType');
    },

    downloadExcelReport(){
      if ((this.navigation.excelReportIsDisabled == false) && (this.navigation.excelReportFile != null)){
        try {
          const downloadExcelReportURL = URL.createObjectURL(new Blob([new Uint8Array(this.navigation.excelReportFile)], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
          const downloadExcelReportElement = document.createElement('a');
          downloadExcelReportElement.href = downloadExcelReportURL;
          downloadExcelReportElement.download = this.navigation.excelReportName;
          document.body.appendChild(downloadExcelReportElement);
          downloadExcelReportElement.click();
          document.body.removeChild(downloadExcelReportElement);
          URL.revokeObjectURL(downloadExcelReportURL);
        } catch {
          this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al descargar el reporte como excel, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
        }
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al descargar el reporte como excel, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
      }
    },

    downloadPDFReport(){
      if ((this.navigation.pdfReportIsDisabled == false) && (this.navigation.pdfReportFile != null)){
        try {
          const downloadPDFReportURL = URL.createObjectURL(new Blob([new Uint8Array(this.navigation.pdfReportFile)], { type: 'application/pdf' }));
          const downloadPDFReportElement = document.createElement('a');
          downloadPDFReportElement.href = downloadPDFReportURL;
          downloadPDFReportElement.download = this.navigation.pdfReportName;
          document.body.appendChild(downloadPDFReportElement);
          downloadPDFReportElement.click();
          document.body.removeChild(downloadPDFReportElement);
          URL.revokeObjectURL(downloadPDFReportURL);
        } catch {
          this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al descargar el reporte como PDF, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
        }
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al descargar el reporte como PDF, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
      }
    },

    async selectProductReplacement(){
      if (this.input.selectedLocalityID != null){
        if (this.input.startDate != null){
          if (this.input.endDate != null){
            this.loader.selectProductReplacement = true;
            const selectInvoiceForProductReplacementRequestQuery = 
            {
              'productReplacementRequesterName': this.localStorage.userName,
              'invoiceLocalityID': this.input.selectedLocalityID,
              'invoiceProductCodeOrName': this.input.productIDOrName,
              'invoiceStartDate': this.input.startDate,
              'invoiceEndDate': this.input.endDate
            };
            const selectInvoiceForProductReplacementResult = await this.executeHttpPostRequest('/invoice/select/productReplacement', selectInvoiceForProductReplacementRequestQuery);
            this.loader.selectProductReplacement = false;
            if (selectInvoiceForProductReplacementResult.success){
              this.display.currentProducts = selectInvoiceForProductReplacementResult.result.productsForReplacement.map(product => ({...product, productIsReady: false}));
              if (selectInvoiceForProductReplacementResult.result.excelDocument.success){
                this.navigation.excelReportIsDisabled = false;
                this.navigation.excelReportFile = selectInvoiceForProductReplacementResult.result.excelDocument.result.data;
                this.navigation.excelReportName = selectInvoiceForProductReplacementResult.result.excelDocument.name;
              } else {
                this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al generar el reporte en excel, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
              }
              if (selectInvoiceForProductReplacementResult.result.pdfDocument.success){
                this.navigation.pdfReportIsDisabled = false;
                this.navigation.pdfReportFile = selectInvoiceForProductReplacementResult.result.pdfDocument.result.data;
                this.navigation.pdfReportName = selectInvoiceForProductReplacementResult.result.pdfDocument.name;
              } else {
                this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al generar el reporte en PDF, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
              }
            } else {
              this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al consultar la reposición de productos, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
              this.navigation.excelReportIsDisabled = true;
              this.navigation.pdfReportIsDisabled = true;
              this.navigation.excelReportFile = null;
              this.navigation.pdfReportFile = null;
              this.navigation.excelReportName = '';
              this.navigation.pdfReportName = '';
            }
          } else {
            this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Debe colocar una fecha final para la reposición de productos', snackbarColor: 'warning', snackbarTimer: 3000});
          }
        } else {
          this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Debe colocar una fecha inicial para la reposición de productos', snackbarColor: 'warning', snackbarTimer: 3000});
        }
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Debe colocar una localidad para la reposición de productos', snackbarColor: 'warning', snackbarTimer: 3000});
      }
    }
  },

  mounted(){
    this.selectLocalityIDAndLocalityName();
    this.placeDefaultDates();
    this.getLocalStorageData();
  }

});

</script>