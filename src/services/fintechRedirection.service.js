const config = require("../config");
const axios = require("axios");

const constants = {
  finbingoRedirect: "/fintech/finbingo/redirect",
  stockalRedirect: "/fintech/stockal/redirect",
  voltmoneyRedirect: "/fintech/volt-money/redirect",
  goldenPiRedirect: "/fintech/goldenPi/redirect",
  jarvisRedirect: "/fintech/jarvis/redirect",
};

module.exports = async ({ fintech, product, authToken, planId = "" }) => {
  let requestUrl;
  let headers = {
    "Content-Type": "application/json",
    Authorization: authToken,
    modulename: product,
  };

  if (planId) {
    headers = { ...headers, planId: planId };
  }

  switch (fintech) {
    case "finbingo":
      requestUrl = `${config.fintech.fintechUATBaseUrl}${constants.finbingoRedirect}`;
      break;

    case "stockal":
      requestUrl = `${config.fintech.fintechUATBaseUrl}${constants.stockalRedirect}`;
      break;

    case "goldenPi":
      requestUrl = `${config.fintech.fintechUATBaseUrl}${constants.goldenPiRedirect}`;
      break;

    case "voltmoney":
      requestUrl = `${config.fintech.fintechUATBaseUrl}${constants.voltmoneyRedirect}`;
      break;

    case "jarvis":
      requestUrl = `${config.fintech.fintechUATBaseUrl}${constants.jarvisRedirect}`;
      break;

    default:
      break;
  }

  const res = await axios.get(requestUrl, { headers });
  const data = res.data.result;
  let redirectionURI;

  if (
    fintech == "finbingo" ||
    fintech == "stockal" ||
    fintech == "goldenPi" ||
    fintech == "jarvis"
  ) {
    redirectionURI = data.redirectionURI;
    console.log("Generated redirection uri ===> ", redirectionURI);

    // redirect to fintech
    return { redirectionURI };
  }

  if (fintech == "voltmoney") {
    const customerCode = data.customerCode;
    const customerSsoToken = data.customerSsoToken;
    const platformCode = data.voltPlatformCode;
    const authToken = data.authToken;

    const sdkData = {
      info: {
        platformCode: platformCode,
        customerSsoToken: customerSsoToken,
        authToken: authToken,
        customerCode: customerCode,
        customerSsoToken: customerSsoToken,
      },
      content: null,
      errorContent: null,
    };
    return sdkData;

    // Initialize sdk object
    const sdkObj = new Volt({
      environment: "staging",
      pColor: "#1450A3",
      target: "account",
      voltPlatformCode: platformCode,
      tracking: { utmSource: "", utmCampaign: "", utmTerm: "", utmMedium: "" },
      customerSsoToken: customerSsoToken,
      divId: "voltmoney-frame",
      launchMode: "popup",
    });

    window.volt = sdkObj;
    sdkObj.submit(authToken, customerCode, customerSsoToken);
  }
};
