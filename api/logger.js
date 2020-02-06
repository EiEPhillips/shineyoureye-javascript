import Raven from 'raven';

require('dotenv').config({ path: '../.env' });

Raven
  .config(`https://${process.env.API_SENTRY_KEY}@sentry.io/${process.env.API_SENTRY_PROJECT}`)
  .install();

export default (error) => {
  // Error 😨
  if (error.response) {
    /*
    * The request was made and the server responded with a
    * status code that falls out of the range of 2xx
    */
    if (process.env.NODE_ENV === 'production') {
      Raven.captureException(error.response.data);
    } else {
      console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
    }
  } else if (error.request) {
    /*
    * The request was made but no response was received, `error.request`
    * is an instance of XMLHttpRequest in the browser and an instance
    * of http.ClientRequest in Node.js
    */
    if (process.env.NODE_ENV === 'production') {
      Raven.captureException(error.request);
    } else {
      console.log(error.request);
    }
  } else {
    // Something happened in setting up the request and triggered an Error
    // eslint-disable-next-line no-lonely-if
    if (process.env.NODE_ENV === 'production') {
      Raven.captureException('Error', error.message);
    } else {
      console.log('Error', error.message);
    }
  }
  if (process.env.NODE_ENV === 'production') {
    Raven.captureException(error);
  } else {
    console.log(error);
  }
};
