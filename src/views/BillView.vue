<template>
  <div class="billViewContainer">
    <div class="billViewMainContainer">
      <div class="billViewLeftContainer">
        <v-text-field
          v-model="input.searchedProductIDOrName"
          @keydown.enter.prevent="selectProductByProductIDOrProductNameForAppendIntoCurrentBilledProducts(input.searchedProductIDOrName)"
          ref="searchedProductIDOrNameInputReference"
          append-inner-icon="mdi-magnify"
          label="Código o nombre del producto"
          variant="solo-filled"
          class="searchedProductIDOrNameInput"
        ></v-text-field>
        <v-card class="filteredSearchedProductOptionsContainer" v-click-outside="handleCloseFilteredSearchedProductOptionsContainerAtOutsideClick">
          <div class="filteredSearchedProductOptionsListContainer">
            <v-list v-if="display.filteredSearchedProductOptions.length > 0" class="filteredSearchedProductOptionsLeftList">
              <v-list-item 
                v-for="(filteredSearchedProductOption, filteredSearchedProductOptionIndex) in display.filteredSearchedProductOptions" 
                @click="selectProductByProductIDOrProductNameForAppendIntoCurrentBilledProducts(filteredSearchedProductOption.productID)"
                @mouseover="handleFilteredSearchedProductHover(filteredSearchedProductOption, true)" 
                @mouseout="handleFilteredSearchedProductHover(filteredSearchedProductOption, false)" 
                :key="filteredSearchedProductOptionIndex" 
                :style="getFilteredSearchedProductOptionStyle(filteredSearchedProductOption.productIsHovered)"
              >
                  {{filteredSearchedProductOption.productAutocompleteTitle}}
              </v-list-item>
            </v-list>
            <v-list v-if="display.filteredSearchedProductOptions.length > 0" class="filteredSearchedProductOptionsRightList">
              <v-list-item 
                v-for="(filteredSearchedProductOption, filteredSearchedProductOptionIndex) in display.filteredSearchedProductOptions" 
                :key="filteredSearchedProductOptionIndex" 
                @mouseover="handleFilteredSearchedProductHover(filteredSearchedProductOption, true)"
                @mouseout="handleFilteredSearchedProductHover(filteredSearchedProductOption, false)" 
                :style="getFilteredSearchedProductOptionActionStyle(filteredSearchedProductOption.productIsHovered)"
              >
                <div class="filteredSearchedProductOptionActionsContainer">
                  <v-icon style="margin-right: 2%;" color="info">mdi-magnify</v-icon>
                  <v-icon style="margin-right: 2%;" color="warning">mdi-archive</v-icon>
                  <v-icon style="margin-right: 2%;" color="error">mdi-trash-can</v-icon>
                  <v-icon style="margin-right: 2%;" color="success">mdi-pencil</v-icon>
                </div>
              </v-list-item>
            </v-list>
          </div>
        </v-card>
        <v-card class="currentBilledProductsTableContainer" elevation="3">
          <v-data-table-virtual :headers="display.billedProductHeaders" :items="display.currentBilledProducts" class="currentBilledProductsTable">
            <template v-slot:item.billedProductPrice="{item}">
              <div v-if="input.selectedCurrencySymbol == '₡'">{{item.billedProductPrice.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}</div>
              <div v-else>{{(item.billedProductPrice/display.dolarExchangeRate).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}</div>
            </template>
            <template v-slot:item.billedProductTaxMargin="{item}">
              {{item.billedProductTaxMargin.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}
            </template>
            <template v-slot:item.billedProductTaxAmount="{item}">
              <div v-if="input.selectedCurrencySymbol == '₡'">{{item.billedProductTaxAmount.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}</div>
              <div v-else>{{(item.billedProductTaxAmount/display.dolarExchangeRate).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}</div>
            </template>
            <template v-slot:item.billedProductDiscountMargin="{item}">
              {{item.billedProductDiscountMargin.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}
            </template>
            <template v-slot:item.billedProductDiscountAmount="{item}">
              <div v-if="input.selectedCurrencySymbol == '₡'">{{item.billedProductDiscountAmount.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}</div>
              <div v-else>{{(item.billedProductDiscountAmount/display.dolarExchangeRate).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}</div>
            </template>
            <template v-slot:item.billedProductSubtotal="{item}">
              <div v-if="input.selectedCurrencySymbol == '₡'">{{item.billedProductSubtotal.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}</div>
              <div v-else>{{(item.billedProductSubtotal/display.dolarExchangeRate).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}</div>
            </template>
            <template v-slot:item.billedProductTotal="{item}">
              <div v-if="input.selectedCurrencySymbol == '₡'">{{item.billedProductTotal.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}</div>
              <div v-else>{{(item.billedProductTotal/display.dolarExchangeRate).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}</div>
            </template>
            <template v-slot:item.billedProductInformationAction="{item}">
              <div style="text-align: center">
                <v-icon @click="deleteBilledProduct(item.billedProductIndex)" style="margin-right: 2%;" color="info">mdi-information-outline</v-icon>
              </div>
            </template>
            <template v-slot:item.billedProductDeleteAction="{item}">
              <div style="text-align: center">
                <v-icon @click="deleteBilledProduct(item.billedProductIndex)" style="margin-right: 2%;" color="error">mdi-trash-can</v-icon>
              </div>
            </template>
          </v-data-table-virtual>
        </v-card>
      </div>

      <v-card class="billViewRightContainer" elevation="3">
        
        <div>
          <div style="display: flex;">
            <v-select v-model="input.selectedBillTypeID" :items="display.billTypeOptions" append-inner-icon="mdi-text-box-outline" density="compact" item-title="billTypeName" item-value="billTypeID" label="Tipo de factura" variant="solo-filled"></v-select>
            <v-switch v-model="input.selectedCurrencySymbol" true-value="$" false-value="₡" :label="input.selectedCurrencySymbol" hide-details color="success" style="margin-left: 5%; position: relative; top: -7px;"></v-switch>
          </div>
          <div v-if="input.selectedBillTypeID == '2'">
            <v-text-field v-model="input.billedClientID" append-inner-icon="mdi-card-account-details-outline" label="Cédula del cliente" variant="solo-filled" density="compact"></v-text-field>
            <v-text-field v-model="input.billedClientName" append-inner-icon="mdi-account-edit" label="Nombre del cliente" variant="solo-filled" density="compact"></v-text-field>
            <v-text-field v-model="input.billedClientEmail" append-inner-icon="mdi-email-outline" label="Correo del cliente" variant="solo-filled" density="compact"></v-text-field>
            <v-text-field v-model="input.billedClientPhoneNumber" append-inner-icon="mdi-phone" label="Teléfono del cliente" variant="solo-filled" density="compact"></v-text-field>
          </div>
          <v-select v-model="input.selectedUserID" :items="display.userOptions" append-inner-icon="mdi-briefcase-account" density="compact" item-title="userName" item-value="userID" label="Facturador" variant="solo-filled"></v-select>
        </div>
        
        <v-card v-if="display.currentBilledProducts.length > 0" class="billResultContainer">
          <div>
            <h1><strong>Subtotal:</strong></h1>
            <h1><strong>Impuesto:</strong></h1>
            <h1><strong>Descuento:</strong></h1>
            <h1><strong>Total:</strong></h1>
          </div>
          <div style="text-align: right; width: 100%;">
            <div v-if="input.selectedCurrencySymbol == '₡'">
              <h1>₡ {{display.billSubtotal.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}</h1>
              <h1>₡ {{display.billTaxAmount.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}</h1>
              <h1>₡ {{display.billDiscountAmount.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}</h1>
              <h1>₡ {{display.billTotal.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}</h1>
            </div>
            <div v-else>
              <h1>{{(display.billSubtotal/display.dolarExchangeRate).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}} $</h1>
              <h1>{{(display.billTaxAmount/display.dolarExchangeRate).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}} $</h1>
              <h1>{{(display.billDiscountAmount/display.dolarExchangeRate).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}} $</h1>
              <h1>{{(display.billTotal/display.dolarExchangeRate).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}} $</h1>
            </div>
          </div>
        </v-card>
      </v-card>


    </div>
  </div>
</template>

<style scoped>

  .billViewContainer {
    margin: 2% 3% 0% 3%;
  }

  .billViewMainContainer {
    display: flex;
    height: 85vh;
  }
  
  .billViewLeftContainer {
    width: 70%;
    margin-right: 1%;
  }

  .billViewRightContainer {
    width: 30%;
    margin-left: 1%;
    height: 100%;
    padding: 1%;
    background-color: #e9e8e8;
    display: flex;
    flex-direction: column;
  }

  .billResultContainer {
    margin-top: auto; 
    width: 100%; 
    background-color: white;
    padding: 3%;
    display: flex;
  }

  .searchedProductIDOrNameInput {
    margin-bottom: 0px;
  }

  .filteredSearchedProductOptionsContainer {
    max-height: 200px;
    z-index: 1000;
    position: absolute;
    overflow-y: auto;
    width: 64.5%;
    top: 165px;
  }

  .filteredSearchedProductOptionActionsContainer {
    width: 100%; 
    text-align: right; 
  }

  .filteredSearchedProductOption:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }

  .filteredSearchedProductOptionsListContainer {
    display: flex;
  }

  .filteredSearchedProductOptionsLeftList {
    width: 70%;
  }

  .filteredSearchedProductOptionsRightList {
    width: 30%;
  }

  .currentBilledProductsTableContainer {
    z-index: 1;
    position: relative;
    height: 90%;
  }

  .currentBilledProductsTable {
    max-height: 100%;
    overflow-y: auto;
  }

</style>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BillView',
  
  data: () => ({
    input: 
    {
      searchedProductIDOrName: '',
      selectedBillTypeID: '1',
      selectedCurrencySymbol: '₡',
      selectedUserID: null,

      billedClientID: '',
      billedClientName: '',
      billedClientEmail: '',
      billedClientPhoneNumber: ''
    },


    display:
    {
      searchedProductOptions: 
      [
        {productID: 'PROD001', productName: 'Widget A', productAutocompleteTitle: 'PROD001 - Widget A', productAmount: 100, productPrice: 10.99, productDiscountMargin: 5, productDiscount: 0.55, productTaxMargin: 10, productInformationAction: 'PROD001', productDeleteAction: 'PROD001', productIsHovered: false},
        {productID: 'PROD002', productName: 'Gadget B', productAutocompleteTitle: 'PROD002 - Gadget B', productAmount: 50, productPrice: 25.49, productDiscountMargin: 8, productDiscount: 2.04, productTaxMargin: 12, productInformationAction: 'PROD002', productDeleteAction: 'PROD002', productIsHovered: false},
        {productID: 'PROD003', productName: 'Tool C', productAutocompleteTitle: 'PROD003 - Tool C', productAmount: 20, productPrice: 45.99, productDiscountMargin: 12, productDiscount: 5.52, productTaxMargin: 15, productInformationAction: 'PROD003', productDeleteAction: 'PROD003', productIsHovered: false},
        {productID: 'PROD004', productName: 'Equipment D', productAutocompleteTitle: 'PROD004 - Equipment D', productAmount: 5, productPrice: 199.99, productDiscountMargin: 15, productDiscount: 29.99, productTaxMargin: 20, productInformationAction: 'PROD004', productDeleteAction: 'PROD004', productIsHovered: false},
        {productID: 'PROD005', productName: 'Accessory E', productAutocompleteTitle: 'PROD005 - Accessory E', productAmount: 30, productPrice: 8.75, productDiscountMargin: 3, productDiscount: 0.26, productTaxMargin: 8, productInformationAction: 'PROD005', productDeleteAction: 'PROD005', productIsHovered: false},
        {productID: 'PROD006', productName: 'Part F', productAutocompleteTitle: 'PROD006 - Part F', productAmount: 15, productPrice: 34.99, productDiscountMargin: 10, productDiscount: 3.50, productTaxMargin: 10, productInformationAction: 'PROD006', productDeleteAction: 'PROD006', productIsHovered: false},
        {productID: 'PROD007', productName: 'Material G', productAutocompleteTitle: 'PROD007 - Material G', productAmount: 40, productPrice: 12.25, productDiscountMargin: 6, productDiscount: 0.74, productTaxMargin: 9, productInformationAction: 'PROD007', productDeleteAction: 'PROD007', productIsHovered: false},
        {productID: 'PROD008', productName: 'Software H', productAutocompleteTitle: 'PROD008 - Software H', productAmount: 10, productPrice: 299.99, productDiscountMargin: 20, productDiscount: 59.99, productTaxMargin: 15, productInformationAction: 'PROD008', productDeleteAction: 'PROD008', productIsHovered: false},
        {productID: 'PROD009', productName: 'Service I', productAutocompleteTitle: 'PROD009 - Service I', productAmount: 1, productPrice: 599.99, productDiscountMargin: 0, productDiscount: 0, productTaxMargin: 10, productInformationAction: 'PROD009', productDeleteAction: 'PROD009', productIsHovered: false},
        {productID: 'PROD010', productName: 'Subscription J', productAutocompleteTitle: 'PROD010 - Subscription J', productAmount: 3, productPrice: 99.99, productDiscountMargin: 5, productDiscount: 15, productTaxMargin: 10, productInformationAction: 'PROD010', productDeleteAction: 'PROD010', productIsHovered: false},
        {productID: 'PROD011', productName: 'Widget K', productAutocompleteTitle: 'PROD011 - Widget K', productAmount: 75, productPrice: 14.99, productDiscountMargin: 5, productDiscount: 0.75, productTaxMargin: 10, productInformationAction: 'PROD011', productDeleteAction: 'PROD011', productIsHovered: false},
        {productID: 'PROD012', productName: 'Gadget L', productAutocompleteTitle: 'PROD012 - Gadget L', productAmount: 40, productPrice: 29.99, productDiscountMargin: 8, productDiscount: 2.40, productTaxMargin: 12, productInformationAction: 'PROD012', productDeleteAction: 'PROD012', productIsHovered: false},
        {productID: 'PROD013', productName: 'Tool M', productAutocompleteTitle: 'PROD013 - Tool M', productAmount: 15, productPrice: 49.99, productDiscountMargin: 12, productDiscount: 6.00, productTaxMargin: 15, productInformationAction: 'PROD013', productDeleteAction: 'PROD013', productIsHovered: false},
        {productID: 'PROD014', productName: 'Equipment N', productAutocompleteTitle: 'PROD014 - Equipment N', productAmount: 2, productPrice: 249.99, productDiscountMargin: 15, productDiscount: 37.49, productTaxMargin: 20, productInformationAction: 'PROD014', productDeleteAction: 'PROD014', productIsHovered: false},
        {productID: 'PROD015', productName: 'Accessory O', productAutocompleteTitle: 'PROD015 - Accessory O', productAmount: 25, productPrice: 12.99, productDiscountMargin: 3, productDiscount: 0.39, productTaxMargin: 8, productInformationAction: 'PROD015', productDeleteAction: 'PROD015', productIsHovered: false},
        {productID: 'PROD016', productName: 'Part P', productAutocompleteTitle: 'PROD016 - Part P', productAmount: 20, productPrice: 39.99, productDiscountMargin: 10, productDiscount: 4.00, productTaxMargin: 10, productInformationAction: 'PROD016', productDeleteAction: 'PROD016', productIsHovered: false},
        {productID: 'PROD017', productName: 'Material Q', productAutocompleteTitle: 'PROD017 - Material Q', productAmount: 35, productPrice: 15.99, productDiscountMargin: 6, productDiscount: 0.96, productTaxMargin: 9, productInformationAction: 'PROD017', productDeleteAction: 'PROD017', productIsHovered: false},
        {productID: 'PROD018', productName: 'Software R', productAutocompleteTitle: 'PROD018 - Software R', productAmount: 8, productPrice: 349.99, productDiscountMargin: 20, productDiscount: 69.99, productTaxMargin: 15, productInformationAction: 'PROD018', productDeleteAction: 'PROD018', productIsHovered: false},
        {productID: 'PROD019', productName: 'Service S', productAutocompleteTitle: 'PROD019 - Service S', productAmount: 1, productPrice: 799.99, productDiscountMargin: 0, productDiscount: 0, productTaxMargin: 10, productInformationAction: 'PROD019', productDeleteAction: 'PROD019', productIsHovered: false},
        {productID: 'PROD020', productName: 'Subscription T', productAutocompleteTitle: 'PROD020 - Subscription T', productAmount: 5, productPrice: 149.99, productDiscountMargin: 5, productDiscount: 22.50, productTaxMargin: 10, productInformationAction: 'PROD020', productDeleteAction: 'PROD020', productIsHovered: false},
        {productID: 'PROD021', productName: 'Widget U', productAutocompleteTitle: 'PROD021 - Widget U', productAmount: 90, productPrice: 19.99, productDiscountMargin: 5, productDiscount: 1.00, productTaxMargin: 10, productInformationAction: 'PROD021', productDeleteAction: 'PROD021', productIsHovered: false},
        {productID: 'PROD022', productName: 'Gadget V', productAutocompleteTitle: 'PROD022 - Gadget V', productAmount: 60, productPrice: 34.99, productDiscountMargin: 8, productDiscount: 2.80, productTaxMargin: 12, productInformationAction: 'PROD022', productDeleteAction: 'PROD022', productIsHovered: false},
        {productID: 'PROD023', productName: 'Tool W', productAutocompleteTitle: 'PROD023 - Tool W', productAmount: 25, productPrice: 59.99, productDiscountMargin: 12, productDiscount: 7.20, productTaxMargin: 15, productInformationAction: 'PROD023', productDeleteAction: 'PROD023', productIsHovered: false},
        {productID: 'PROD024', productName: 'Equipment X', productAutocompleteTitle: 'PROD024 - Equipment X', productAmount: 3, productPrice: 349.99, productDiscountMargin: 15, productDiscount: 52.49, productTaxMargin: 20, productInformationAction: 'PROD024', productDeleteAction: 'PROD024', productIsHovered: false},
        {productID: 'PROD025', productName: 'Accessory Y', productAutocompleteTitle: 'PROD025 - Accessory Y', productAmount: 40, productPrice: 16.99, productDiscountMargin: 3, productDiscount: 0.51, productTaxMargin: 8, productInformationAction: 'PROD025', productDeleteAction: 'PROD025', productIsHovered: false},
        {productID: 'PROD026', productName: 'Part Z', productAutocompleteTitle: 'PROD026 - Part Z', productAmount: 30, productPrice: 49.99, productDiscountMargin: 10, productDiscount: 5.00, productTaxMargin: 10, productInformationAction: 'PROD026', productDeleteAction: 'PROD026', productIsHovered: false},
        {productID: 'PROD027', productName: 'Material AA', productAutocompleteTitle: 'PROD027 - Material AA', productAmount: 45, productPrice: 19.99, productDiscountMargin: 6, productDiscount: 1.20, productTaxMargin: 9, productInformationAction: 'PROD027', productDeleteAction: 'PROD027', productIsHovered: false},
        {productID: 'PROD028', productName: 'Software BB', productAutocompleteTitle: 'PROD028 - Software BB', productAmount: 12, productPrice: 399.99, productDiscountMargin: 20, productDiscount: 79.99, productTaxMargin: 15, productInformationAction: 'PROD028', productDeleteAction: 'PROD028', productIsHovered: false},
        {productID: 'PROD029', productName: 'Service CC', productAutocompleteTitle: 'PROD029 - Service CC', productAmount: 2, productPrice: 999.99, productDiscountMargin: 0, productDiscount: 0, productTaxMargin: 10, productInformationAction: 'PROD029', productDeleteAction: 'PROD029', productIsHovered: false},
        {productID: 'PROD030', productName: 'Subscription DD', productAutocompleteTitle: 'PROD030 - Subscription DD', productAmount: 8, productPrice: 199.99, productDiscountMargin: 5, productDiscount: 30.00, productTaxMargin: 10, productInformationAction: 'PROD030', productDeleteAction: 'PROD030', productIsHovered: false},
        {productID: 'PROD031', productName: 'Widget EE', productAutocompleteTitle: 'PROD031 - Widget EE', productAmount: 85, productPrice: 17.99, productDiscountMargin: 5, productDiscount: 0.90, productTaxMargin: 10, productInformationAction: 'PROD031', productDeleteAction: 'PROD031', productIsHovered: false},
        {productID: 'PROD032', productName: 'Gadget FF', productAutocompleteTitle: 'PROD032 - Gadget FF', productAmount: 55, productPrice: 39.99, productDiscountMargin: 8, productDiscount: 3.20, productTaxMargin: 12, productInformationAction: 'PROD032', productDeleteAction: 'PROD032', productIsHovered: false},
        {productID: 'PROD033', productName: 'Tool GG', productAutocompleteTitle: 'PROD033 - Tool GG', productAmount: 30, productPrice: 69.99, productDiscountMargin: 12, productDiscount: 8.40, productTaxMargin: 15, productInformationAction: 'PROD033', productDeleteAction: 'PROD033', productIsHovered: false},
        {productID: 'PROD034', productName: 'Equipment HH', productAutocompleteTitle: 'PROD034 - Equipment HH', productAmount: 4, productPrice: 399.99, productDiscountMargin: 15, productDiscount: 59.99, productTaxMargin: 20, productInformationAction: 'PROD034', productDeleteAction: 'PROD034', productIsHovered: false},
        {productID: 'PROD035', productName: 'Accessory II', productAutocompleteTitle: 'PROD035 - Accessory II', productAmount: 50, productPrice: 19.99, productDiscountMargin: 3, productDiscount: 0.60, productTaxMargin: 8, productInformationAction: 'PROD035', productDeleteAction: 'PROD035', productIsHovered: false},
        {productID: 'PROD036', productName: 'Part JJ', productAutocompleteTitle: 'PROD036 - Part JJ', productAmount: 35, productPrice: 59.99, productDiscountMargin: 10, productDiscount: 6.00, productTaxMargin: 10, productInformationAction: 'PROD036', productDeleteAction: 'PROD036', productIsHovered: false},
        {productID: 'PROD037', productName: 'Material KK', productAutocompleteTitle: 'PROD037 - Material KK', productAmount: 55, productPrice: 24.99, productDiscountMargin: 6, productDiscount: 1.50, productTaxMargin: 9, productInformationAction: 'PROD037', productDeleteAction: 'PROD037', productIsHovered: false},
        {productID: 'PROD038', productName: 'Software LL', productAutocompleteTitle: 'PROD038 - Software LL', productAmount: 15, productPrice: 449.99, productDiscountMargin: 20, productDiscount: 89.99, productTaxMargin: 15, productInformationAction: 'PROD038', productDeleteAction: 'PROD038', productIsHovered: false},
        {productID: 'PROD039', productName: 'Service MM', productAutocompleteTitle: 'PROD039 - Service MM', productAmount: 3, productPrice: 1199.99, productDiscountMargin: 0, productDiscount: 0, productTaxMargin: 10, productInformationAction: 'PROD039', productDeleteAction: 'PROD039', productIsHovered: false},
        {productID: 'PROD040', productName: 'Subscription NN', productAutocompleteTitle: 'PROD040 - Subscription NN', productAmount: 10, productPrice: 249.99, productDiscountMargin: 5, productDiscount: 37.50, productTaxMargin: 10, productInformationAction: 'PROD040', productDeleteAction: 'PROD040', productIsHovered: false},
        {productID: 'PROD041', productName: 'Widget OO', productAutocompleteTitle: 'PROD041 - Widget OO', productAmount: 95, productPrice: 24.99, productDiscountMargin: 5, productDiscount: 1.25, productTaxMargin: 10, productInformationAction: 'PROD041', productDeleteAction: 'PROD041', productIsHovered: false},
        {productID: 'PROD042', productName: 'Gadget PP', productAutocompleteTitle: 'PROD042 - Gadget PP', productAmount: 70, productPrice: 49.99, productDiscountMargin: 8, productDiscount: 4.00, productTaxMargin: 12, productInformationAction: 'PROD042', productDeleteAction: 'PROD042', productIsHovered: false},
        {productID: 'PROD043', productName: 'Tool QQ', productAutocompleteTitle: 'PROD043 - Tool QQ', productAmount: 35, productPrice: 79.99, productDiscountMargin: 12, productDiscount: 9.60, productTaxMargin: 15, productInformationAction: 'PROD043', productDeleteAction: 'PROD043', productIsHovered: false},
        {productID: 'PROD044', productName: 'Equipment RR', productAutocompleteTitle: 'PROD044 - Equipment RR', productAmount: 6, productPrice: 449.99, productDiscountMargin: 15, productDiscount: 67.49, productTaxMargin: 20, productInformationAction: 'PROD044', productDeleteAction: 'PROD044', productIsHovered: false},
        {productID: 'PROD045', productName: 'Accessory SS', productAutocompleteTitle: 'PROD045 - Accessory SS', productAmount: 60, productPrice: 24.99, productDiscountMargin: 3, productDiscount: 0.75, productTaxMargin: 8, productInformationAction: 'PROD045', productDeleteAction: 'PROD045', productIsHovered: false},
        {productID: 'PROD046', productName: 'Part TT', productAutocompleteTitle: 'PROD046 - Part TT', productAmount: 40, productPrice: 69.99, productDiscountMargin: 10, productDiscount: 7.00, productTaxMargin: 10, productInformationAction: 'PROD046', productDeleteAction: 'PROD046', productIsHovered: false},
        {productID: 'PROD047', productName: 'Material UU', productAutocompleteTitle: 'PROD047 - Material UU', productAmount: 60, productPrice: 29.99, productDiscountMargin: 6, productDiscount: 1.80, productTaxMargin: 9, productInformationAction: 'PROD047', productDeleteAction: 'PROD047', productIsHovered: false},
        {productID: 'PROD048', productName: 'Software VV', productAutocompleteTitle: 'PROD048 - Software VV', productAmount: 18, productPrice: 499.99, productDiscountMargin: 20, productDiscount: 99.99, productTaxMargin: 15, productInformationAction: 'PROD048', productDeleteAction: 'PROD048', productIsHovered: false},
        {productID: 'PROD049', productName: 'Service WW', productAutocompleteTitle: 'PROD049 - Service WW', productAmount: 4, productPrice: 1399.99, productDiscountMargin: 0, productDiscount: 0, productTaxMargin: 10, productInformationAction: 'PROD049', productDeleteAction: 'PROD049', productIsHovered: false},
        {productID: 'PROD050', productName: 'Subscription XX', productAutocompleteTitle: 'PROD050 - Subscription XX', productAmount: 15, productPrice: 299.99, productDiscountMargin: 5, productDiscount: 45.00, productTaxMargin: 10, productInformationAction: 'PROD050', productDeleteAction: 'PROD050', productIsHovered: false},
      ],
      filteredSearchedProductOptions: [],
      billedProductHeaders: 
      [
        {key: 'billedProductID', title: 'Código'},
        {key: 'billedProductName', title: 'Nombre'},
        {key: 'billedProductPrice', title: 'Precio'},
        {key: 'billedProductTaxMargin', title: 'Impuesto (%)'},
        {key: 'billedProductTaxAmount', title: 'Impuesto'},
        {key: 'billedProductDiscountMargin', title: 'Descuento (%)'},
        {key: 'billedProductDiscountAmount', title: 'Descuento'},
        {key: 'billedProductSubtotal', title: 'Subtotal'},
        {key: 'billedProductAmount', title: 'Cantidad'},
        {key: 'billedProductTotal', title: 'Total'},
        {key: 'billedProductInformationAction', title: 'Información'},
        {key: 'billedProductDeleteAction', title: 'Eliminar'}
      ],
      currentBilledProducts: [],

      billTypeOptions: [{billTypeID: '1', billTypeName: 'Tiquete sencillo'},{billTypeID: '2', billTypeName: 'Factura electrónica'},{billTypeID: '3', billTypeName: 'Recibo'}],
      userOptions: [{userID: '117770329', userName: 'Oscar Araya'},{userID: '109590485', userName: 'Nancy Garbanzo'},{userID: '208475986', userName: 'Elena Bolaños'}],

      billSubtotal: 0,
      billDiscountAmount: 0,
      billTaxAmount: 0,
      billTotal: 0,

      dolarExchangeRate: 492.00
    },
  }),

  watch: {
    'input.searchedProductIDOrName': function() {
      this.filterSearchedProductOptions();
    }
  },

  methods: {
    async selectProductByProductIDOrProductNameForAppendIntoCurrentBilledProducts(productID){
      const regularExpressionChecker = /\S/;
      if (regularExpressionChecker.test(productID)){


        this.display.filteredSearchedProductOptions = [];
        this.input.searchedProductIDOrName = '';
        this.focusOnSearchedProductIDOrNameInput();

        // get this from server
        const billedProductPrice = Math.floor(Math.random() * (10000 - 5000 + 1)) + 10000;

        // get this from server
        const billedProductTaxMargin = 13;

        const billedProductTaxAmount = billedProductPrice * (billedProductTaxMargin/100);

        // get this from server
        const billedProductDiscountMargin = 5;

        const billedProductDiscountAmount = (billedProductPrice + billedProductTaxAmount) * (billedProductDiscountMargin/100);

        const billedProductSubtotal = billedProductPrice + billedProductTaxAmount - billedProductDiscountAmount;
        const billedProductAmount = 1;

        const billedProductTotal = billedProductSubtotal*billedProductAmount;

        this.display.currentBilledProducts.push({
          'billedProductID': productID,
          'billedProductName': productID,
          'billedProductPrice': billedProductPrice,
          'billedProductTaxMargin': billedProductTaxMargin,
          'billedProductTaxAmount': billedProductTaxAmount,
          'billedProductDiscountMargin': billedProductDiscountMargin,
          'billedProductDiscountAmount': billedProductDiscountAmount,
          'billedProductSubtotal': billedProductSubtotal,
          'billedProductAmount': billedProductAmount,
          'billedProductTotal': billedProductTotal
        });

        this.calculateBillResult();
      }
    },

    handleFilteredSearchedProductHover(filteredSearchedProduct, productIsHovered){
      filteredSearchedProduct.productIsHovered = productIsHovered;
    },

    handleCloseFilteredSearchedProductOptionsContainerAtOutsideClick(){
      this.display.filteredSearchedProductOptions = [];
    },

    focusOnSearchedProductIDOrNameInput(){
      this.$refs.searchedProductIDOrNameInputReference.focus();
    },

    filterSearchedProductOptions(){
      const regularExpressionChecker = /\S/;
      if (regularExpressionChecker.test(this.input.searchedProductIDOrName)){
        this.display.filteredSearchedProductOptions = this.display.searchedProductOptions.filter((searchedProduct, searchedProductIndex) => {
          const searchedProductIDMatches = searchedProduct.productID.toLowerCase().includes(this.input.searchedProductIDOrName.toLowerCase());
          const searchedProductNameMatches = searchedProduct.productName.toLowerCase().includes(this.input.searchedProductIDOrName.toLowerCase());
          return (searchedProductIDMatches || searchedProductNameMatches) && (searchedProductIndex <= 20);
        });
      } else {
        this.display.filteredSearchedProductOptions = [];
      }
    },

    getFilteredSearchedProductOptionStyle(productIsHovered){
      return productIsHovered ? 'cursor: pointer; background-color: #ECECEC;' : 'cursor: pointer; background-color: white;';
    },

    getFilteredSearchedProductOptionActionStyle(productIsHovered){
      return productIsHovered ? 'width: 100%; text-align: right; cursor: pointer; background-color: #ECECEC;' : 'width: 100%; text-align: right; cursor: pointer; background-color: white;';
    },

    calculateBillResult(){
      this.display.billSubtotal = this.display.currentBilledProducts.reduce((billSubtotal, currentBilledProduct) => billSubtotal + currentBilledProduct.billedProductSubtotal * currentBilledProduct.billedProductAmount, 0);
      this.display.billTaxAmount = this.display.currentBilledProducts.reduce((billTaxAmount, currentBilledProduct) => billTaxAmount + currentBilledProduct.billedProductTaxAmount * currentBilledProduct.billedProductAmount, 0);
      this.display.billDiscountAmount = this.display.currentBilledProducts.reduce((billDiscountAmount, currentBilledProduct) => billDiscountAmount + currentBilledProduct.billedProductDiscountAmount, 0);
      this.display.billTotal = this.display.currentBilledProducts.reduce((billTotal, currentBilledProduct) => billTotal + currentBilledProduct.billedProductTotal, 0);
    },

    deleteBilledProduct(billedProductIndex){
      this.display.currentBilledProducts.splice(billedProductIndex, 1);
      this.calculateBillResult();
    }

  },

  mounted(){
    this.focusOnSearchedProductIDOrNameInput();
  }

});

</script>
