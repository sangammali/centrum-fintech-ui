const axios = require("axios");
const fintechRedirectionService = require("./fintechRedirection.service");
const config = require("../config");
const fs = require("fs");
const constants = {
  initUrl: "/common/init",
};

module.exports = async ({ authkey, product }) => {
  const requestUrl = `${config.fintech.fintechUATBaseUrl}${constants.initUrl}?authkey=${authkey}`;
  const headers = { "Content-Type": "application/json" };

  let res;
  let data;

  try {
    res = await axios.get(requestUrl, { headers });
    data = res.data.result;

    if (res.status == 200) {
      const authToken = data.token;
      const consent = data.userConsentStatus;
      const fintech = data.fintech;
      const planId = data.planId;

      if (consent) {
        console.log("Redirect and do SSO login [Approved]");
        const data = await fintechRedirectionService({
          fintech,
          product,
          authToken,
          planId,
        });

        return data;
      } else if (consent !== null && fintech == "finbingo") {
        console.log("Redirect and do SSO login Finbingo [null]");
        const data = await fintechRedirectionService({
          fintech,
          product,
          authToken,
          planId,
        });

        return data;
      } else {
        // read t&c content of that particular fintech from file
        // const response = await fetch(
        //   `http://${config.app.host}:${config.app.port}/assets/${fintech}/termsAndConditions.txt`
        // );
        // const fileContent = await response.text();

        const fileContent = fs.readFileSync(
          `./public/assets/${fintech}/termsAndConditions.txt`,
          { encoding: "utf8", flag: "r" }
        );

        return { content: fileContent, info: null };
      }
    }
  } catch (error) {
    console.log(error);
    return {
      errorContent: "Please try again after sometime!",
      content: null,
      info: null,
    };
  }
};
