// Reading environment variables
require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();
const services = require("./src/services");
const config = require("./src/config");
const port = config.app.port;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files through public folder
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/src"));

app.get("/", async (req, res) => {
  res.send("Centrum fintech UI server");
});

// enable middleware for parsing JSON request bodies
app.use(express.json());

// enable middleware for parsing URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Route for fintech landing page
app.get("/fintech", async (req, res) => {
  const { fintechName, product, authToken } = req.query;

  // Call service to getfintech customer linking data
  const fintechCustomerLinkingData = await services.getFintechCustomerLinking({
    fintechName,
    product,
    authToken,
  });

  if (
    fintechCustomerLinkingData &&
    (fintechName == "finbingo" || fintechName == "jarvis")
  ) {
    const constants = {
      baseUrl: "http://15.206.112.103:3003",
      consentPageUrl: "http://15.206.112.103:8002/consent",
      generateAuthKeyRoute: "/common/generate-auth-key",
    };
    // Making request url
    try {
      const requestUrl = `${constants.baseUrl}${constants.generateAuthKeyRoute}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: authToken,
      };
      let payload = {
        fintechName: fintechName,
        moduleName: product,
      };

      payload = JSON.stringify(payload);
      // Make POST request
      const generateAuthKey = await axios.post(requestUrl, payload, {
        headers,
      });

      if (generateAuthKey.status == 200) {
        const authkey = generateAuthKey.data.result.fintechRequestId;

        console.log("Auth token ===> ", authkey);

        // redirect to consent page with auth token
        res
          .writeHead(301, {
            Location: `${constants.consentPageUrl}?authkey=${authkey}&fintechName=${fintechName}&product=${product}&authToken=${authToken}`,
          })
          .end();
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    // Call service to getfintech meta data
    const fintechMetaData = await services.getFintechMeta({
      fintechName,
      product,
      authToken,
    });
    // Render fintech landing page template
    res.render("fintechLanding", fintechMetaData);
  }
});

// Route for consent page
app.get("/consent", async (req, res) => {
  const { authkey, product } = req.query;

  // Service call
  const consentData = await services.initJourney({ authkey, product });
  console.log(consentData);

  if (
    consentData.hasOwnProperty("content") ||
    consentData.hasOwnProperty("errorContent") ||
    consentData.hasOwnProperty("info")
  ) {
    // Render consent page template
    res.render("consent", consentData);
  }

  if (consentData.hasOwnProperty("redirectionURI")) {
    // Redirect to fintech page direclty
    res
      .writeHead(301, {
        Location: consentData.redirectionURI,
      })
      .end();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
