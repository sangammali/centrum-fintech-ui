const constants = {
  baseUrl: "http://15.206.112.103:3003",
  consentRoute: "/common/consent-status",
  finbingoRedirect: "/fintech/finbingo/redirect",
  stockalRedirect: "/fintech/stockal/redirect",
  voltmoneyRedirect: "/fintech/volt-money/redirect",
  goldenPiRedirect: "/fintech/goldenPi/redirect",
  jarvisRedirect: "/fintech/jarvis/redirect",
};

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const fintechName = urlParams.get("fintechName");
  const authToken = urlParams.get("authToken");
  const planId = urlParams.get("planId");
  const moduleName = urlParams.get("product");

  const consentCheckbox = document.getElementById("consent-checkbox");
  const cancelBtn = document.getElementById("cancel-btn");
  const continueBtn = document.getElementById("continue-btn");

  // Enable / disable Continue button
  consentCheckbox.addEventListener("click", () => {
    if (consentCheckbox.checked === true) {
      continueBtn.disabled = false;
    } else {
      continueBtn.disabled = true;
    }
  });

  // Handle cancel and continue clicks
  cancelBtn.addEventListener("click", cancelConsent);
  continueBtn.addEventListener("click", acceptConsent);

  async function cancelConsent() {
    console.log("Consent rejected!!!");

    // Consent api - request url
    const url = constants.baseUrl + constants.consentRoute;

    // Data to be sent in the POST request
    const payload = {
      userConsentStatus: "REJECTED",
      fintechName: fintechName,
    };

    // Configuration for the fetch() function
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify(payload),
    };

    try {
      const res = await fetch(url, options);

      if (res.status == 200) {
        const cancelConsentJson = await res.json();
        console.log("Cancel consent repsonse: ", cancelConsentJson);

        if (fintechName == "finbingo") {
          await fintechRedirect(fintechName, moduleName, authToken);
        }

        if (fintechName !== "finbingo") {
          alert(`Consent rejected for ${fintechName}`);
        }
      }

      if (cancelConsent.status !== 200) {
        console.log("Cancel consent Error: ", res);
      }
    } catch (error) {
      console.log("Cancel consent Error: ", error);
    }
  }

  async function acceptConsent() {
    console.log("Consent accepted!!?");

    // Consent api - request url
    const url = constants.baseUrl + constants.consentRoute;

    // Data to be sent in the POST request
    const payload = {
      userConsentStatus: "APPROVED",
      fintechName: fintechName,
    };

    // Configuration for the fetch() function
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify(payload),
    };

    try {
      const res = await fetch(url, options);

      if (res.status == 200) {
        const acceptConsentJson = await res.json();
        console.log("Accept consent response: ", acceptConsentJson);

        if (planId) {
          await fintechRedirect(fintechName, moduleName, authToken, planId);
        } else {
          await fintechRedirect(fintechName, moduleName, authToken);
        }
      }

      if (res.status !== 200) {
        console.log("Accept consent Error: ", res);
      }
    } catch (error) {
      console.log("Accept consent Error: ", error);
    }
  }

  async function fintechRedirect(fintech, moduleName, authToken, planId = "") {
    console.log("inside fintech redirect");
    let requestUrl;

    // Configuration for the fetch() function
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
        modulename: moduleName,
      },
    };

    if (planId) {
      options.headers = { ...options.headers, planId: planId };
    }

    switch (fintech) {
      case "finbingo":
        requestUrl = `${constants.baseUrl}${constants.finbingoRedirect}`;
        break;

      case "stockal":
        requestUrl = `${constants.baseUrl}${constants.stockalRedirect}`;
        break;

      case "goldenPi":
        requestUrl = `${constants.baseUrl}${constants.goldenPiRedirect}`;
        break;

      case "voltmoney":
        requestUrl = `${constants.baseUrl}${constants.voltmoneyRedirect}`;
        break;

      case "jarvis":
        requestUrl = `${constants.baseUrl}${constants.jarvisRedirect}`;
        break;

      default:
        break;
    }

    console.log("requestUrl ===> ", requestUrl);
    console.log("options ===> ", options);

    const res = await fetch(requestUrl, options);
    const data = await res.json();
    let redirectionURI;

    console.log(data);

    if (
      fintech == "finbingo" ||
      fintech == "stockal" ||
      fintech == "goldenPi" ||
      fintech == "jarvis"
    ) {
      redirectionURI = data.result.redirectionURI;
      console.log(
        `Generated redirection URI for ${fintech} ===> `,
        redirectionURI
      );

      // redirect to fintech
      window.location.replace(redirectionURI);
    }

    if (fintech == "voltmoney") {
      const customerCode = data.result.customerCode;
      const customerSsoToken = data.result.customerSsoToken;
      const platformCode = data.result.voltPlatformCode;
      const authToken = data.result.authToken;

      // Initialize sdk object
      const sdkObj = new Volt({
        environment: "staging",
        pColor: "#1450A3",
        target: "account",
        voltPlatformCode: platformCode,
        tracking: {
          utmSource: "",
          utmCampaign: "",
          utmTerm: "",
          utmMedium: "",
        },
        customerSsoToken: customerSsoToken,
        divId: "voltmoney-frame",
        launchMode: "popup",
      });

      window.volt = sdkObj;
      sdkObj.submit(authToken, customerCode, customerSsoToken);
    }
  }
});
