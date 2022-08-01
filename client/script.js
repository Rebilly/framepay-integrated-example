Rebilly.initialize({
  // Use your own publishable key:
  publishableKey: "pk_sandbox_1234",
  icon: {
    color: "#0d2b3e",
  },
  style: {
    base: {
      fontSize: "16px",
      boxSahdow: "none",
    },
  },
});

const form = document.querySelector("form");
const message = document.querySelector(".message");
const button = document.querySelector("button");

Rebilly.on("ready", function () {
  Rebilly.card.mount("#mounting-point");
});

form.onsubmit = async function (e) {
  e.preventDefault();
  e.stopPropagation();

  try {
    button.disabled = true;

    const {id: paymentToken, billingAddress} = await Rebilly.createToken(form);

    const transactionResponse = await fetch("/create-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        paymentToken,
        billingAddress,
        currency: 'USD',
        amount: 100,
      }),
    });

    const transactionData = await transactionResponse.json();

    const approvalUrl = transactionData._links.find(({rel}) => rel === "approvalUrl");

    if (approvalUrl) {
      window.location = approvalUrl.href;
    } else {
      window.location = "/thank-you.html";
    }
  } catch (error) {
    message.classList.add("is-error");
    message.innerText = "Something went wrong, please try again.";
    console.log(error);
  } finally {
    button.disabled = false;
  }
};
