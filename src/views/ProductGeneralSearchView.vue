<template>
  <div class="productGeneralSearchViewContainer">
    <v-text-field 
      v-model="input.searchedProductIDOrName" 
      :loading="loader.selectProductLikeProductIDOrLikeProductName"
      @keydown.enter.prevent="selectProductLikeProductIDOrLikeProductName()"
      @keydown="startSelectProductLikeProductIDOrLikeProductNameTimer"
      @click:append-inner="selectProductLikeProductIDOrLikeProductName()"
      ref="productIDOrNameInputReference"
      append-inner-icon="mdi-magnify"
      label="Código o nombre del producto"
      variant="solo-filled"
    ></v-text-field>
    <br>
    <v-card>
      <div class="currentProductsTableContainer">
        <v-data-table :headers="display.currentProductsTableHeaders" :items="display.currentProducts">
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
            <v-icon @click="openUpdateProductModal(item)" color="success">mdi-pencil</v-icon>
          </template>
          <template v-slot:item.deleteProductAction="{ item }">
            <v-icon @click="openDeleteProductModal(item)" color="error">mdi-trash-can</v-icon>
          </template>
        </v-data-table>
      </div>
    </v-card>
    <v-dialog v-model="navigation.updateProductModalIsVisible" width="auto">
      <v-card width="500" class="updateProductModalContainer">
        <v-text-field v-model="input.updatedProduct.productID" :rules="[input.updatedProductRules.updateProductIDRequired]" prepend-inner-icon="mdi-barcode" label="Código interno del producto" variant="solo-filled"></v-text-field>
        <v-text-field v-model="input.updatedProduct.productSKU" :rules="[input.updatedProductRules.updateProductSKURequired]" prepend-inner-icon="mdi-barcode-scan" label="SKU del producto" variant="solo-filled"></v-text-field>
        <v-text-field v-model="input.updatedProduct.productName" :rules="[input.updatedProductRules.updateProductNameRequired]" prepend-inner-icon="mdi-package-variant-closed" label="Nombre del producto" variant="solo-filled"></v-text-field>
        <v-textarea v-model="input.updatedProduct.productDescription" :rules="[input.updatedProductRules.updateProductDescriptionRequired]" prepend-inner-icon="mdi-information-outline" label="Descripción del producto" variant="solo-filled"></v-textarea>
        <v-text-field v-model="input.updatedProduct.productCost" :rules="[input.updatedProductRules.updateProductCostRequired, input.updatedProductRules.updateProductCostNumeric]" prefix="₡" prepend-inner-icon="mdi-cash-minus" label="Costo del producto" variant="solo-filled"></v-text-field>
        <v-text-field v-model="input.updatedProduct.productProfitMargin" :rules="[input.updatedProductRules.updateProductProfitMarginRequired, input.updatedProductRules.updateProductProfitMarginNumeric]" suffix="%" prepend-inner-icon="mdi-division" label="Márgen de ganancia del producto" variant="solo-filled"></v-text-field>
        <v-text-field v-model="input.updatedProduct.productProfit" :rules="[input.updatedProductRules.updateProductProfitRequired, input.updatedProductRules.updateProductProfitNumeric]" prefix="₡" prepend-inner-icon="mdi-cash-plus" label="Ganancia del producto" variant="solo-filled"></v-text-field>
        <v-text-field v-model="input.updatedProduct.productPrice" :rules="[input.updatedProductRules.updateProductPriceRequired, input.updatedProductRules.updateProductPriceNumeric]" prefix="₡" prepend-inner-icon="mdi-cash" label="Precio del producto" variant="solo-filled"></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" prepend-icon="mdi-cancel" variant="elevated" text="CANCELAR"></v-btn>
          <v-btn color="success" prepend-icon="mdi-check-bold" variant="elevated" text="CONFIRMAR"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="navigation.deleteProductModalIsVisible" width="auto">
      <v-card width="250" class="updateProductModalContainer">
        <v-btn color="error" prepend-icon="mdi-cancel" variant="elevated" text="CANCELAR"></v-btn>
        <br>
        <v-btn color="success" prepend-icon="mdi-check-bold" variant="elevated" text="CONFIRMAR"></v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
  .productGeneralSearchViewContainer {
    margin: 2% 3% 0% 3%;
  }

  .currentProductsTableContainer {
    max-height: 650px;
    overflow-y: auto;
  }

  .updateProductModalContainer {
    padding: 20px;
  }
</style>


<script>
import { defineComponent } from 'vue';
import generalFunctions from '../generalFunctions.js';


export default defineComponent({
  name: 'ProductGeneralSearchView',

  mixins: [generalFunctions],

  data: () => ({

    input: 
    {
      productIDOrName: '',
      updatedProduct: null,
      deletedProduct: null,

      updatedProductRules: {
        updateProductIDRequired: value => /\S/.test(value) || 'El código interno del producto es obligatorio',
        updateProductSKURequired: value => /\S/.test(value) || 'El SKU del producto es obligatorio',
        updateProductNameRequired: value => /\S/.test(value) || 'El nombre del producto es obligatorio',
        updateProductDescriptionRequired: value => /\S/.test(value) || 'La descripción del producto es obligatoria',
        updateProductCostRequired: value => /\S/.test(value) || 'El costo del producto es obligatorio',
        updateProductProfitMarginRequired: value => /\S/.test(value) || 'El márgen de ganancia del producto es obligatorio',
        updateProductProfitRequired: value => /\S/.test(value) || 'La ganancia del producto es obligatoria',
        updateProductPriceRequired: value => /\S/.test(value) || 'El precio del producto es obligatorio',

        updateProductCostNumeric: value => /^-?\d*\.?\d+$/.test(value) || 'El costo del producto debe ser numérico',
        updateProductProfitMarginNumeric: value => /^-?\d*\.?\d+$/.test(value) || 'El márgen de ganancia del producto debe ser numérico',
        updateProductProfitNumeric: value => /^-?\d*\.?\d+$/.test(value) || 'La ganancia del producto debe ser numérica',
        updateProductPriceNumeric: value => /^-?\d*\.?\d+$/.test(value) || 'El precio del producto debe ser numérico',

        updateProductIDLength: value => value.length <= 50 || 'El código interno del producto no puede exceder los 50 caracteres',
        updateProductSKULength: value => value.length <= 50 || 'El SKU del producto no puede exceder los 50 caracteres',
        updateProductNameLength: value => value.length <= 100 || 'El nombre del producto no puede exceder los 100 caracteres',
        updateProductDescriptionLength: value => value.length <= 65000 || 'La descripción del producto no puede exceder los 65000 caracteres'
      }

    },

    loader:
    {
      selectProductLikeProductIDOrLikeProductName: false
    },

    display:
    {
      currentProducts: [],
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
        {key: 'deactivateProductAction', title: 'Desactivar'}
      ],
    },

    navigation: 
    {
      selectProductLikeProductIDOrLikeProductNameTimer: null,
      updateProductModalIsVisible: false,
      deleteProductModalIsVisible: false
    },

  }),

  mounted(){
    this.$refs.productIDOrNameInputReference.focus();
  },

  methods: {
    async openUpdateProductModal(updatedProduct){
      this.navigation.updateProductModalIsVisible = true;
      this.input.updatedProduct = updatedProduct;
    },

    async openDeleteProductModal(deletedProduct){
      this.navigation.deleteProductModalIsVisible = true;
      this.input.deletedProduct = deletedProduct;
    },

    async selectProductLikeProductIDOrLikeProductName(){
      this.loader.selectProductLikeProductIDOrLikeProductName = true;
      const selectProductLikeProductIDOrLikeProductNameRequestQuery = {'productIDOrProductName': this.input.searchedProductIDOrName, 'showInactiveProducts': true};
      const selectProductLikeProductIDOrLikeProductNameResult = await this.executeHttpPostRequest('/product/select/likeProductIDOrLikeProductName', selectProductLikeProductIDOrLikeProductNameRequestQuery);
      if (selectProductLikeProductIDOrLikeProductNameResult.success){
        this.display.currentProducts = selectProductLikeProductIDOrLikeProductNameResult.result.map(product => ({...product, updateProductAction: '', deactivateProductAction: ''}));
      } else {
        this.$root.notification.showNotificationSnackbar({snackbarMessage: 'Ha ocurrido un error inesperado al consultar los productos, por favor intente nuevamente. Si el problema persiste consulte a su administrador de sistema', snackbarColor: 'error', snackbarTimer: 3000});
      }
      this.loader.selectProductLikeProductIDOrLikeProductName = false;
    },

    async startSelectProductLikeProductIDOrLikeProductNameTimer(event){
      const keyPressed = event.key;
      if (keyPressed != 'Enter'){
        if (this.selectProductLikeProductIDOrLikeProductNameTimer != null){
          clearInterval(this.selectProductLikeProductIDOrLikeProductNameTimer);
        }
        this.selectProductLikeProductIDOrLikeProductNameTimer = setTimeout(() => {
          this.selectProductLikeProductIDOrLikeProductName();
        }, 1000);
      }
    }
  }
});
</script>
