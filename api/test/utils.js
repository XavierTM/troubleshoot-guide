
const { default: axios } = require("axios");
const chai = require('chai');
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

async function waitForServer(url = `http://localhost:${process.env.PORT}`) {

   let success = false;

   while (!success) {
      try {
         await axios.get(url);
         success = true;
      } catch (err) {
         if (err.code !== 'ECONNREFUSED')
            success = true;
      }
   }
}

function createRequester() {
   return chai.request(`http://localhost:${process.env.PORT}`).keepOpen();
}


module.exports = {
   createRequester,
   waitForServer
}