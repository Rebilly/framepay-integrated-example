const RebillyAPI = require("rebilly-js-sdk").default;
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("client"));
app.use(express.json());

require("dotenv").config();
const { API_SECRET_KEY, ORGANIZATION_ID, WEBISTE_ID } = process.env;

const api = RebillyAPI({
  apiKey: API_SECRET_KEY,
  organizationId: ORGANIZATION_ID,
  sandbox: true,
});

app.post("/create-transaction", async (req, res) => {
  try {
    const {
      paymentToken,
      billingAddress: primaryAddress,
      currency,
      amount,
    } = req.body;

    const { fields: customer } = await api.customers.create({
      data: {
        paymentToken,
        primaryAddress 
      },
    });

    const { fields: transaction } = await api.transactions.create({
      data: {
        type: "sale",
        websiteId: WEBISTE_ID,
        customerId: customer.id,
        currency,
        amount,
      },
    });

    res.status(201).send(transaction);
  } catch (error) {
    const message = err.details ?? "Internal Server Error";
    const code = err.status ?? 500;
    res.status(500).send({ code, message });
  }
});

app.listen(port, () => {
  console.log(`App listening at port: ${port}`);
});
