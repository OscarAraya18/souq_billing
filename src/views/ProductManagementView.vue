<template>
  <div class="productManagementViewContainer">
    <div class="productManagementInputContainer"> 
      <v-text-field 
        v-model="input.searchedProductIDOrName" 
        :loading="loader.selectProductLikeProductIDOrLikeProductName"
        @keydown.enter.prevent="selectProductLikeProductIDOrLikeProductName()"
        @click:append-inner="selectProductLikeProductIDOrLikeProductName()"
        ref="productIDOrNameInputReference"
        append-inner-icon="mdi-magnify"
        label="Código o nombre del producto"
        variant="solo-filled"
      ></v-text-field>

      <v-checkbox v-model="input.showInactiveProducts" label="Mostrar productos inactivos" color="info" class="showInactiveProductsCheckbox"></v-checkbox>

    </div>
    <v-card>
      <div class="currentProductsTableContainer">
        <v-data-table-virtual :headers="display.currentProductsTableHeaders" :items="display.currentProductsTableRows">
          <template v-slot:item.productCost="{ item }">
            ₡ {{ item.productCost.toLocaleString('en-US', {minimumFractionDigits: 3, maximumFractionDigits: 3}) }}
          </template>
          <template v-slot:item.productProfitMargin="{ item }">
            {{ item.productProfitMargin}} %
          </template>
          <template v-slot:item.productProfit="{ item }">
            ₡ {{ item.productProfit.toLocaleString('en-US', {minimumFractionDigits: 3, maximumFractionDigits: 3}) }}
          </template>
          <template v-slot:item.productPrice="{ item }">
            ₡ {{ item.productPrice.toLocaleString('en-US', {minimumFractionDigits: 3, maximumFractionDigits: 3}) }}
          </template>
          <template v-slot:item.updateProductAction="{ item }">
            <v-icon @click="openUpdateProductDialog(item)" color="success">mdi-pencil</v-icon>
          </template>
          <template v-slot:item.webPageProductAction="{ item }">
            <v-icon @click="openWebPageProductDialog(item)" color="info">mdi-web</v-icon>
          </template>
          <template v-slot:item.applicationProductAction="{ item }">
            <v-icon @click="openUpdateProductDialog(item)" color="warning">mdi-cellphone-wireless</v-icon>
          </template>
          <template v-slot:item.callCenterProductAction="{ item }">
            <v-icon @click="openCallCenterProductDialog(item)" color="#F9E530">mdi-phone</v-icon>
          </template>
          <template v-slot:item.activateDeactivateProductAction="{ item }">
            <div v-if="item.productIsActive">
              <v-icon @click="openDeactivateProductDialog(item)" color="error">mdi-trash-can</v-icon>
            </div>
            <div v-else>
              <v-icon @click="openActivateProductDialog(item)" color="success">mdi-archive</v-icon>
            </div>
          </template>
        </v-data-table-virtual>
      </div>
    </v-card>

    <v-dialog v-model="navigation.webPageProductDialogIsVisible" :persistent="navigation.webPageProductDialogIsPersistent" width="auto">
      <v-card width="700" class="webPageProductDialogContainer">
        <div v-if="loader.selectWebPageProduct"><v-progress-circular color="info" indeterminate></v-progress-circular></div>
        <div v-else>
          <div v-if="navigation.webPageProductIsNew">
            <div v-if="input.insertingWebPageProductProductID == null">
              <h3 class="activateDeactivateProductWarningLabel"><strong>¡ATENCIÓN!</strong></h3>
              <br>
              <p>Este producto de página web no está activado</p>
              <br>
              <p>Activar un producto de página web implica que el mismo será visible para los clientes que visiten la página web</p>
              <br>
              <p>El proceso de activación/desactivación de un producto de página web es reversible en caso de requerirse</p>
              <br>
              <p>Se recomienda que, antes de activar el producto de página web, revise si no se ha creado otro producto de página web que comparta las mismas características (SKU, nombre, entre otros) con el fin de reducir el riesgo de inconsistencias en la información. Si necesita asistencia, contacte con el administrador del sistema</p>
              <v-checkbox v-model="input.activateWebPageProductWarningAccepted" color="info" label="Deseo continuar con el proceso de activación" hide-details></v-checkbox>
              <br>
              <v-btn @click="openInsertWebPageProductDialog()" :disabled="!input.activateWebPageProductWarningAccepted" dark block height="38" color="success">
                <h3>ACTIVAR PRODUCTO DE PÁGINA WEB</h3>
                <v-icon style="margin-left: 20px;" dark right>mdi-archive</v-icon>
              </v-btn>
              <br>
              <v-btn @click="closeActivateProductDialog()" dark block height="38" color="info">
                <h3>CANCELAR</h3>
                <v-icon style="margin-left: 20px;" dark right>mdi-close</v-icon>
              </v-btn>
            </div>
            <div v-else>
              
              <div style="text-align: left;"><h4>Datos básicos del producto:</h4></div>
              <br>
              <v-card class="webpageProductDivisionContainer">
                <v-text-field v-model="input.insertingWebPageProductProductID" prepend-inner-icon="mdi-barcode" label="Código interno del producto" variant="solo-filled" readonly></v-text-field>
                <v-text-field v-model="input.insertingWebPageProductName" prepend-inner-icon="mdi-package-variant-closed" label="Nombre del producto" variant="solo-filled"></v-text-field>
                <v-autocomplete v-model="input.insertingWebPageProductSelectedCategory" :items="display.webpageProductCategoryOptions" :loading="loader.insertingWebPageProductDialog" item-title="webpageProductCategoryName" item-value="webpageProductCategoryID" append-inner-icon="mdi-source-branch" label="Categoría del producto" variant="solo-filled"></v-autocomplete>
                <v-autocomplete v-model="input.insertingWebPageProductSelectedBrand" :items="display.webpageProductBrandOptions" :loading="loader.insertingWebPageProductDialog" item-title="webpageProductBrandName" item-value="webpageProductBrandID" append-inner-icon="mdi-bookshelf" label="Marca del producto" variant="solo-filled"></v-autocomplete>
                <v-autocomplete v-model="input.insertingWebPageProductSelectedTags" :items="display.webpageProductTagOptions" :loading="loader.insertingWebPageProductDialog" multiple chips item-title="webpageProductTagName" item-value="webpageProductTagID" append-inner-icon="mdi-tag" label="Tags del producto" variant="solo-filled"></v-autocomplete>
              </v-card>

              <br><br>
              <div style="text-align: left;"><h4>Información adicional del producto:</h4></div>
              <br>
              <v-card class="webpageProductDivisionContainer">
                <v-data-table-virtual class="webpageProductAdditionalInformationTable" :headers="display.webpageProductAdditionalInformationHeaders" :items="display.webpageProductAdditionalInformationRows">
                  <template v-slot:item="row">
                    <tr v-if="row.item.webpageProductAdditionalInformationTitle == null">
                      <td><br><v-text-field v-model="input.insertingWebPageProductAdditionalInformationTitle" prepend-inner-icon="mdi-format-title" label="Título" variant="solo-filled"></v-text-field></td>
                      <td><br><v-textarea v-model="input.insertingWebPageProductAdditionalInformationDescription" rows="2" prepend-inner-icon="mdi-format-title" label="Descripción" variant="solo-filled"></v-textarea></td>
                      <td>No disponible</td>
                      <td><v-btn @click="preppendWebPageProductAdditionalInformation()" color="success" prepend-icon="mdi-plus-circle-outline" variant="elevated" text="AGREGAR"></v-btn></td>
                    </tr>
                    <tr v-else>
                      <td>{{row.item.webpageProductAdditionalInformationTitle}}</td>
                      <td>{{row.item.webpageProductAdditionalInformationDescription}}</td>
                      <td>
                        <div style="display: flex">
                          <v-icon 
                            @click="reduceWebPageProductAdditionalInformationIndex(row.item.webpageProductAdditionalInformationIndex)" 
                            v-if="row.item.webpageProductAdditionalInformationIndex != 0" 
                            style="margin-right: 5px; cursor: pointer;" 
                            color="info">mdi-arrow-up-circle-outline
                          </v-icon>
                          <v-icon 
                            @click="increaseWebPageProductAdditionalInformationIndex(row.item.webpageProductAdditionalInformationIndex)" 
                            v-if="row.item.webpageProductAdditionalInformationIndex != (display.webpageProductAdditionalInformationRows.length - 2)" 
                            style="cursor: pointer;" 
                            color="info">mdi-arrow-down-circle-outline
                          </v-icon>
                        </div>
                      </td>
                      <td><v-btn @click="discardWebPageProductAdditionalInformation(row.item.webpageProductAdditionalInformationTitle)" color="error" prepend-icon="mdi-close-circle-outline" variant="elevated" text="ELIMINAR"></v-btn></td>

                    </tr>
                  </template>
                </v-data-table-virtual>
              </v-card>
              



            </div>
          </div>
          <div v-else>

          </div>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="navigation.activateProductDialogIsVisible" :persistent="navigation.activateProductDialogIsPersistent" width="auto">
      <v-card width="600" class="activateDeactivateProductDialogContainer">
        <div v-if="navigation.productHasBeenActivated">
          <img :src="assets.successIcon" class="successIcon">
          <br>
          <p>El producto <strong>{{ display.activatingProductName }}</strong> ha sido activado exitosamente</p>
        </div>
        <div v-else>
          <div v-if="loader.activateProduct">
            <v-progress-circular color="success" indeterminate></v-progress-circular>
            <br><br>
            <p>El producto <strong>{{ display.activatingProductName }}</strong> está siendo activado...</p>
          </div>
          <div v-else>
            <h3 class="activateDeactivateProductWarningLabel"><strong>¡ATENCIÓN!</strong></h3>
            <br>
            <p>Activar un producto implica que el mismo volverá a ser visible en todos de los sistemas (facturación, página web, aplicación móvil o call center)</p>
            <br>
            <p>El proceso de activación/desactivación es reversible en caso de requerirse</p>
            <br>
            <p>Se recomienda que, antes de activar el producto, revise si no se ha creado otro producto que comparta las mismas características (SKU, nombre, entre otros) con el fin de reducir el riesgo de inconsistencias en la información. Si necesita asistencia, contacte con el administrador del sistema</p>
            <v-checkbox v-model="input.activateProductWarningAccepted" color="success" label="Deseo continuar con el proceso de activación" hide-details></v-checkbox>
            <br>
            <v-btn @click="activateProduct()" :disabled="!input.activateProductWarningAccepted" dark block height="38" color="success">
              <h3>ACTIVAR PRODUCTO</h3>
              <v-icon style="margin-left: 20px;" dark right>mdi-archive</v-icon>
            </v-btn>
            <br>
            <v-btn @click="closeActivateProductDialog()" dark block height="38" color="info">
              <h3>CANCELAR</h3>
              <v-icon style="margin-left: 20px;" dark right>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="navigation.deactivateProductDialogIsVisible" :persistent="navigation.deactivateProductDialogIsPersistent" width="auto">
      <v-card width="600" class="activateDeactivateProductDialogContainer">
        <div v-if="navigation.productHasBeenDeactivated">
          <img :src="assets.successIcon" class="successIcon">
          <br>
          <p>El producto <strong>{{ display.deactivatingProductName }}</strong> ha sido desactivado exitosamente</p>
        </div>
        <div v-else>
          <div v-if="loader.deactivateProduct">
            <v-progress-circular color="error" indeterminate></v-progress-circular>
            <br><br>
            <p>El producto <strong>{{ display.deactivatingProductName }}</strong> está siendo desactivado...</p>
          </div>
          <div v-else>
            <h3 class="activateDeactivateProductWarningLabel"><strong>¡ATENCIÓN!</strong></h3>
            <br>
            <p>Desactivar un producto implica que el mismo no será visible en ninguno de los sistemas (facturación, página web, aplicación móvil o call center)</p>
            <br>
            <p>La información del producto no se perderá de los registros anteriores a su desactivación. El proceso de activación/desactivación es reversible en caso de requerirse. Si necesita asistencia, contacte con el administrador del sistema</p>
            <br>
            <v-checkbox v-model="input.deactivateProductWarningAccepted" color="error" label="Deseo continuar con el proceso de desactivación" hide-details></v-checkbox>
            <br>
            <v-btn @click="deactivateProduct()" :disabled="!input.deactivateProductWarningAccepted" dark block height="38" color="error">
              <h3>DESACTIVAR PRODUCTO</h3>
              <v-icon style="margin-left: 20px;" dark right>mdi-trash-can</v-icon>
            </v-btn>
            <br>
            <v-btn @click="closeDeactivateProductDialog()" dark block height="38" color="info">
              <h3>CANCELAR</h3>
              <v-icon style="margin-left: 20px;" dark right>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
  .productManagementViewContainer {
    margin: 2% 3% 0% 3%;
  }

  .productManagementInputContainer {
    display: flex;
  }

  .showInactiveProductsCheckbox {
    margin-left: 1%;
  }

  .currentProductsTableContainer {
    max-height: 75vh;
    overflow-y: auto;
  }

  .webPageProductDialogContainer {
    padding: 20px;
    text-align: center;
  }

  .webpageProductDivisionContainer {
    padding: 10px;
    background-color: #e9e8e8;
  }

  .webpageProductImagesTable {
    max-height: 400px;
    overflow-y: auto;
  }

  .webpageProductAdditionalInformationTable {
    max-height: 300px;
    overflow-y: auto;
  }

  .callCenterProductDialogContainer {
    padding: 20px;
    text-align: center;
  }

  .activateDeactivateProductDialogContainer {
    padding: 20px;
    text-align: center;
  }

  .activateDeactivateProductWarningLabel {
    color: var(--warningFontColor);
  }

  .successIcon {
    width: 60px; 
    height: 60px;
  }

</style>

<script>
import { defineComponent } from 'vue';
import generalFunctions from '../generalFunctions.js';

import successIcon from '../assets/animatedIcons/success.gif';


export default defineComponent({
  name: 'ProductManagementView',

  mixins: [generalFunctions],

  data: () => ({
    assets: 
    {
      successIcon: successIcon
    },
    
    input: 
    {
      searchedProductIDOrName: null,
      showInactiveProducts: false,

      
      insertingWebPageProductProductID: null,
      insertingWebPageProductName: null,
      insertingWebPageProductSelectedCategory: null,
      insertingWebPageProductSelectedBrand: null,
      insertingWebPageProductSelectedTags: [],
      insertingWebPageProductShortDescription: null,
      insertingWebPageProductLongDescription: null,
      insertingWebPageProductAdditionalInformationTitle: null,
      insertingWebPageProductAdditionalInformationDescription: null,

      activateWebPageProductWarningAccepted: false,

      activateProductWarningAccepted: false,
      deactivateProductWarningAccepted: false
    },

    display:
    {
      currentProductsTableRows: [],
      currentProductsTableHeaders: 
      [
        {key: 'productID', title: 'Código interno'},
        {key: 'productSKU', title: 'SKU'},
        {key: 'productName', title: 'Nombre'},
        {key: 'productDescription', title: 'Descripción'},
        {key: 'productCost', title: 'Costo'},
        {key: 'productProfitMargin', title: 'Márgen de ganancia'},
        {key: 'productProfit', title: 'Ganancia'},
        {key: 'productPrice', title: 'Precio'},
        {key: 'updateProductAction', title: 'Modificar'},
        {key: 'webPageProductAction', title: 'Página web'},
        {key: 'applicationProductAction', title: 'Aplicación'},
        {key: 'callCenterProductAction', title: 'Call center'},
        {key: 'activateDeactivateProductAction', title: 'Activar/Desactivar'}
      ],

      webpageProductCategoryOptions: [],
      webpageProductBrandOptions: [],
      webpageProductTagOptions: [],

      webpageProductAdditionalInformationRows: [],
      webpageProductAdditionalInformationHeaders:
      [
        {key: 'webpageProductAdditionalInformationTitle', title: 'Título'},
        {key: 'webpageProductAdditionalInformationDescription', title: 'Descripción'},
        {key: 'webpageProductAdditionalInformationIndex', title: 'Subir/Bajar'},
        {key: 'webpageProductAdditionalInformationAction', title: 'Agregar/Eliminar'}
      ],

      activatingProductName: '',
      deactivatingProductName: ''
    },

    loader: 
    {
      selectProductLikeProductIDOrLikeProductName: false,

      selectWebPageProduct: false,
      insertingWebPageProductDialog: false,

      selectCallCenterProduct: false,
      activateProduct: false,
      deactivateProduct: false
    },

    navigation: 
    {
      webPageProductDialogIsVisible: false,
      webPageProductDialogIsPersistent: false,
      webPageProductIsNew: false,
      webPageProductOriginalProduct: null,      

      callCenterDialogIsVisible: false,
      callCenterDialogIsPersistent: false,
      callCenterOriginalProduct: null,

      activateProductDialogIsVisible: false,
      activateProductDialogIsPersistent: false,
      activatingProductID: null,
      productHasBeenActivated: false,

      deactivateProductDialogIsVisible: false,
      deactivateProductDialogIsPersistent: false,
      deactivatingProductID: null,
      productHasBeenDeactivated: false
    }
  }),

  watch: {
    'input.showInactiveProducts'(){
      this.selectProductLikeProductIDOrLikeProductName();
    }
  },

  methods: {
    async selectProductLikeProductIDOrLikeProductName(){
      this.loader.selectProductLikeProductIDOrLikeProductName = true;
      const selectProductLikeProductIDOrLikeProductNameRequestQuery = {'productIDOrProductName': this.input.searchedProductIDOrName, 'showInactiveProducts': this.input.showInactiveProducts};
      const selectProductLikeProductIDOrLikeProductNameResult = await this.executeHttpPostRequest('/product/select/likeProductIDOrLikeProductName', selectProductLikeProductIDOrLikeProductNameRequestQuery);
      if (selectProductLikeProductIDOrLikeProductNameResult.success){
        this.display.currentProductsTableRows = selectProductLikeProductIDOrLikeProductNameResult.result.map(product => ({...product, updateProductAction: '', webPageProductAction: '', applicationProductAction: '', callcenterProductAction: '', activateDeactivateProductAction: ''}));
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al consultar los productos, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
      }
      this.loader.selectProductLikeProductIDOrLikeProductName = false;
    },

    async activateProduct(){
      this.loader.activateProduct = true;
      this.loader.activateProductProgress = 0;
      this.navigation.activateProductDialogIsPersistent = true;
      const productIsActive = true;
      const updateProductIsActiveRequestQuery = {'productID': this.navigation.activatingProductID, 'productIsActive': productIsActive};
      const updateProductIsActiveResult = await this.executeHttpPostRequest('/product/update/productIsActive', updateProductIsActiveRequestQuery);
      if (updateProductIsActiveResult.success){
        await new Promise(updateProductIsAvailableDelayResolve => setTimeout(updateProductIsAvailableDelayResolve, 3000));
        this.navigation.productHasBeenActivated = true;
        this.selectProductLikeProductIDOrLikeProductName();
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al activar el producto, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
      }
      this.loader.activateProduct = false;
      this.navigation.activateProductDialogIsPersistent = false;
    },

    async deactivateProduct(){
      this.loader.deactivateProduct = true;
      this.navigation.deactivateProductDialogIsPersistent = true;
      const productIsActive = false;
      const updateProductIsActiveRequestQuery = {'productID': this.navigation.deactivatingProductID, 'productIsActive': productIsActive};
      const updateProductIsActiveResult = await this.executeHttpPostRequest('/product/update/productIsActive', updateProductIsActiveRequestQuery);
      if (updateProductIsActiveResult.success){
        await new Promise(updateProductIsAvailableDelayResolve => setTimeout(updateProductIsAvailableDelayResolve, 3000));
        this.navigation.productHasBeenDeactivated = true;
        this.selectProductLikeProductIDOrLikeProductName();
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al desactivar el producto, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
      }
      this.loader.deactivateProduct = false;
      this.navigation.deactivateProductDialogIsPersistent = false;
    },

    async openWebPageProductDialog(webPageProduct){
      this.loader.selectWebPageProduct = true;
      this.navigation.webPageProductDialogIsVisible = true;
      this.navigation.insertingWebPageProductProductID = null;
      this.input.activateWebPageProductWarningAccepted = false;
      const selectWebPageProductRequestQuery = {'webpageProductID': webPageProduct.productID};
      const selectWebPageProductResult = await this.executeHttpPostRequest('/webpageProduct/select', selectWebPageProductRequestQuery);
      if (selectWebPageProductResult.success){
        if (selectWebPageProductResult.result){
          this.navigation.webPageProductIsNew = false;
        } else {
          this.navigation.webPageProductIsNew = true;
        }
        this.navigation.webPageProductOriginalProduct = webPageProduct;
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al consultar el producto de página web, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
        this.navigation.webPageProductDialogIsVisible = false;
      }
      this.loader.selectWebPageProduct = false;
    },

    async openInsertWebPageProductDialog(){
      this.input.insertingWebPageProductProductID = this.navigation.webPageProductOriginalProduct.productID;
      this.input.insertingWebPageProductName =  this.navigation.webPageProductOriginalProduct.productName;
      this.input.insertingWebPageProductSelectedCategory = null;
      this.input.insertingWebPageProductSelectedBrand = null;
      this.input.insertingWebPageProductSelectedTags = [];
      this.input.insertingWebPageProductShortDescription = null;
      this.input.insertingWebPageProductLongDescription = null;
      this.display.webpageProductAdditionalInformationRows = [{'webpageProductAdditionalInformationTitle': null, 'webpageProductAdditionalInformationDescription': null, 'webpageProductAdditionalInformationIndex': null, 'webpageProductAdditionalInformationAction': null}];
      this.input.insertingWebPageProductAdditionalInformationTitle = null;
      this.input.insertingWebPageProductAdditionalInformationDescription = null;
      
      this.input.insertingWebPageProductSelectedTags = null;
      this.loader.insertingWebPageProductDialog = true;
      const selectWebPageProductCategoryResult = await this.executeHttpPostRequest('/webpageProductCategory/select');
      if (selectWebPageProductCategoryResult.success){
        this.display.webpageProductCategoryOptions = selectWebPageProductCategoryResult.result;
        const selectWebPageProductBrandResult = await this.executeHttpPostRequest('/webpageProductBrand/select');
        if (selectWebPageProductBrandResult.success){
          this.display.webpageProductBrandOptions = selectWebPageProductBrandResult.result;
          const selectWebPageProductTagResult = await this.executeHttpPostRequest('/webpageProductTag/select');
          if (selectWebPageProductTagResult.success){
            this.display.webpageProductTagOptions = selectWebPageProductTagResult.result;
          } else {
            this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al consultar las etiquetas del producto de página web, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
            this.navigation.webPageProductDialogIsVisible = false;
          }
        } else {
          this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al consultar las marcas del producto de página web, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
          this.navigation.webPageProductDialogIsVisible = false;
        }
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al consultar las categorías del producto de página web, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
        this.navigation.webPageProductDialogIsVisible = false;
      }
      this.loader.insertingWebPageProductDialog = false;
    },

    recalculateWebPageProductAdditionalInformationIndexes(){
      for (var index in this.display.webpageProductAdditionalInformationRows){
        this.display.webpageProductAdditionalInformationRows[index]['webpageProductAdditionalInformationIndex'] = index;
      }
    },

    preppendWebPageProductAdditionalInformation(){
      const regularExpressionChecker = /\S/;
      if (regularExpressionChecker.test(this.input.insertingWebPageProductAdditionalInformationTitle)){
        if (this.display.webpageProductAdditionalInformationRows.map(webpageProductAdditionalInformationRow => webpageProductAdditionalInformationRow['webpageProductAdditionalInformationTitle']).includes(this.input.insertingWebPageProductAdditionalInformationTitle)){
          this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ya existe una información adicional con el mismo título, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'warning', snackbarTimer: 3000});
        } else {
          if (regularExpressionChecker.test(this.input.insertingWebPageProductAdditionalInformationDescription)){
            this.display.webpageProductAdditionalInformationRows.unshift({'webpageProductAdditionalInformationTitle': this.input.insertingWebPageProductAdditionalInformationTitle, 'webpageProductAdditionalInformationDescription': this.input.insertingWebPageProductAdditionalInformationDescription, 'webpageProductAdditionalInformationIndex': 0, 'webpageProductAdditionalInformationAction': null});
            this.input.insertingWebPageProductAdditionalInformationTitle = null;
            this.input.insertingWebPageProductAdditionalInformationDescription = null;
            this.recalculateWebPageProductAdditionalInformationIndexes();
          } else {
            this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Debe colocar una descripción para la información adicional del producto de página web, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'warning', snackbarTimer: 3000});
          }
        }
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Debe colocar un título para la información adicional del producto de página web, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'warning', snackbarTimer: 3000});
      }
    },

    discardWebPageProductAdditionalInformation(webPageProductAdditionalInformationTitle){
      this.display.webpageProductAdditionalInformationRows = this.display.webpageProductAdditionalInformationRows.filter(webpageProductAdditionalInformationRow => webpageProductAdditionalInformationRow.webpageProductAdditionalInformationTitle != webPageProductAdditionalInformationTitle);
      this.recalculateWebPageProductAdditionalInformationIndexes();
    },

    reduceWebPageProductAdditionalInformationIndex(webPageProductAdditionalInformationIndex){
      const auxiliarWebPageProductAdditionalInformation = this.display.webpageProductAdditionalInformationRows[webPageProductAdditionalInformationIndex - 1];
      this.display.webpageProductAdditionalInformationRows[webPageProductAdditionalInformationIndex - 1] = this.display.webpageProductAdditionalInformationRows[webPageProductAdditionalInformationIndex];
      this.display.webpageProductAdditionalInformationRows[webPageProductAdditionalInformationIndex] = auxiliarWebPageProductAdditionalInformation;
      this.recalculateWebPageProductAdditionalInformationIndexes();
    },

    increaseWebPageProductAdditionalInformationIndex(webPageProductAdditionalInformationIndex){
      const auxiliarWebPageProductAdditionalInformation = this.display.webpageProductAdditionalInformationRows[webPageProductAdditionalInformationIndex + 1];
      this.display.webpageProductAdditionalInformationRows[webPageProductAdditionalInformationIndex + 1] = this.display.webpageProductAdditionalInformationRows[webPageProductAdditionalInformationIndex];
      this.display.webpageProductAdditionalInformationRows[webPageProductAdditionalInformationIndex] = auxiliarWebPageProductAdditionalInformation;
      this.recalculateWebPageProductAdditionalInformationIndexes();
    },

    openActivateProductDialog(activatingProduct){
      this.navigation.activatingProductID = activatingProduct.productID;
      this.display.activatingProductName = activatingProduct.productName;
      this.input.activateProductWarningAccepted = false;
      this.navigation.productHasBeenActivated = false;
      this.navigation.activateProductDialogIsVisible = true;
    },

    openDeactivateProductDialog(deactivatingProduct){
      this.navigation.deactivatingProductID = deactivatingProduct.productID;
      this.display.deactivatingProductName = deactivatingProduct.productName;
      this.input.deactivateProductWarningAccepted = false;
      this.navigation.productHasBeenDeactivated = false;
      this.navigation.deactivateProductDialogIsVisible = true;
    },

    closeActivateProductDialog(){
      this.navigation.activateProductDialogIsVisible = false;
    },

    closeDeactivateProductDialog(){
      this.navigation.deactivateProductDialogIsVisible = false;
    },
    
  },

  mounted(){
    
  }

});

</script>