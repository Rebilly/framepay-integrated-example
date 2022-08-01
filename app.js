const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

require("dotenv").config();
const { API_SECRET_KEY, ORGANIZATION_ID, WEBISTE_ID } = process.env;

app.use(express.static("client"));
app.use(express.json());

axios.defaults.headers.common["REB-APIKEY"] = API_SECRET_KEY;
axios.defaults.baseURL = `https://api-sandbox.rebilly.com/organizations/${ORGANIZATION_ID}`;

app.post("/create-transaction", async (req, res) => {
  try {
    const {
      paymentToken,
      billingAddress: primaryAddress,
      currency,
      amount,
    } = req.body;

    const { data: customerFields } = await axios.post("/customers", {
      paymentToken,
      primaryAddress,
    });

    const { data: transactionFields } = await axios.post("/transactions", {
      type: "sale",
      websiteId: WEBISTE_ID,
      customerId: customerFields.id,
      currency,
      amount,
    });

    res.send(transactionFields);
  } catch (error) {
    const message = err.details ?? "Internal Server Error";
    const code = err.status ?? 500;
    res.status(500).send({ code, message });
  }
});

app.listen(port, () => {
  console.log(`App listening at port: ${port}`);
});
