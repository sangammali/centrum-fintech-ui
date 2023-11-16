const axios = require("axios");
const config = require("../config");

module.exports = async ({
  fintechName,
  product,
  authToken
}) => {

  const requestUrl = `${config.fintech.baseUrl}/common/fintech-meta-data?fintechName=${fintechName}&product=${product}`;
  const headers = { "authorization": authToken };
  const res = await axios.get(requestUrl, { headers });

  const fintechMetaData = res.data.result;

  return fintechMetaData;
}