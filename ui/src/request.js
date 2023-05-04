

import axios from 'axios';


class AxiosError extends Error {

   toString() {
      return this.message;
   }

   constructor(msg, status) {
      super(msg);
      this.status = status;
   }
}


const request = axios;

axios.interceptors.response.use(null, err => {

   if (err && err.response) {
      const msg = typeof err.response.data === 'string' ? err.response.data : err.response.statusText;;
      err = new AxiosError(msg, err.response.status);
   }

   throw err;
});

axios.interceptors.response.use(null, err => {

   if (err.status === 401) {
      window.App.redirect('/login');
   }

   throw err;
   
});


export default request;