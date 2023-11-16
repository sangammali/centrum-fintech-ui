const axios = require("axios");
const config = require("../config");

module.exports = async ({ fintechName, product, authToken }) => {
  const requestUrl = `${config.fintech.baseUrl}/common/fintech-customer-linking?fintechName=${fintechName}&moduleName=${product}`;
  const headers = { authorization: authToken };
  const res = await axios.get(requestUrl, { headers });

  let fintechCustomerLinking = "";
  if (res.status == 200 && res.data.result) {
    fintechCustomerLinking = res.data.result;
  }

  return fintechCustomerLinking;
};
