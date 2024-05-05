import { createRouter, createWebHistory } from 'vue-router';
import BillView from '../views/BillView.vue';
import TopNavigationBarView from '../views/TopNavigationBarView.vue';
import ProductGeneralSearchView from '../views/ProductGeneralSearchView.vue';
import ProductReplacementView from '../views/ProductReplacementView.vue';
import ProductManagementView from '../views/ProductManagementView.vue';
import AgentAccessCredentialView from '../views/AgentAccessCredentialView.vue';
import LocalityExpenseView from '../views/LocalityExpenseView.vue';

//import PageNotFoundView from '../views/PageNotFoundView.vue';

const routes = [
  {
    path: '/',
    name: 'topNavigationBarView',
    component: TopNavigationBarView,
    children: 
    [
      {path: '/', component: BillView},
      {path: '/bill', component: BillView},
      {path: '/productGeneralSearch', component: ProductGeneralSearchView},
      {path: '/productReplacement', component: ProductReplacementView},
      {path: '/productManagement', component: ProductManagementView},
      {path: '/agentAccessCredential', component: AgentAccessCredentialView},
      {path: '/localityExpense', component: LocalityExpenseView},

    ]
  },
  /*
  {
    path: '/:catchAll(.*)',
    name: 'pageNotFoundView',
    component: PageNotFoundView
  }
  */
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
