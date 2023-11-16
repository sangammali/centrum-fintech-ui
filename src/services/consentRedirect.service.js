const constants = {
  baseUrl: "http://15.206.112.103:3003",
  consentPageUrl: "http://15.206.112.103:8002/consent",
  generateAuthKeyRoute: "/common/generate-auth-key",
};

document.addEventListener("DOMContentLoaded", async function () {
  const fintechBtn = document.getElementById("fintech-btn");

  fintechBtn.addEventListener("click", async function (e) {
    const urlParams = new URLSearchParams(window.location.search);
    const fintechName = urlParams.get("fintechName");
    const product = urlParams.get("product");
    const authToken = urlParams.get("authToken");
    const planId = urlParams.get("planId");

    const payload = {
      fintechName: fintechName,
      planId: planId ? planId : "",
      moduleName: product ? product : "",
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

    // Making request url
    const url = `${constants.baseUrl}${constants.generateAuthKeyRoute}`;

    // Make POST request
    const generateAuthKey = await fetch(url, options);

    if (generateAuthKey.status == 200) {
      const generateAuthKeyJson = await generateAuthKey.json();
      const authkey = generateAuthKeyJson.result.fintechRequestId;

      console.log("Auth token ===> ", authkey);

      // redirect to consent page with auth token
      window.location.replace(
        `${constants.consentPageUrl}?authkey=${authkey}&fintechName=${fintechName}&product=${product}&planId=${planId}&authToken=${authToken}`
      );
    } else {
      console.log("Error while generating auth token");
    }
  });
});
