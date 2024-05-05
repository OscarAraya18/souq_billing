import router from '@/router'; 
import axios from 'axios';

export default {
  methods: {
    async executeHttpGetRequest(httpRequestRoute){
      return new Promise((executeHttpGetRequestPromiseResolve) => {
        axios.get(process.env.VUE_APP_BACKEND_HTTP_REQUEST_SERVER_CONNECTION_URL + httpRequestRoute)
        .then((response) => {
          const httpGetRequestSuccess = response.data.success;
          const httpGetRequestResult = response.data.result;
          executeHttpGetRequestPromiseResolve({success: httpGetRequestSuccess, result: httpGetRequestResult});
        })
        .catch((error) => {
          executeHttpGetRequestPromiseResolve({success: false, result: error});
        });
      });
    },

    async executeHttpPostRequest(httpRequestRoute, httpRequestQuery = {}){
      return new Promise((executeHttpPostRequestPromiseResolve) => {
        axios.post(process.env.VUE_APP_BACKEND_HTTP_REQUEST_SERVER_CONNECTION_URL + httpRequestRoute, httpRequestQuery)
        .then((response) => {
          const httpPostRequestSuccess = response.data.success;
          const httpPostRequestResult = response.data.result;
          executeHttpPostRequestPromiseResolve({success: httpPostRequestSuccess, result: httpPostRequestResult});
        })
        .catch((error) => {
          executeHttpPostRequestPromiseResolve({success: false, result: error});
        });
      });
    },

    navigateTo(routeToNavigate) {
      router.push(routeToNavigate);
    }
  }
}