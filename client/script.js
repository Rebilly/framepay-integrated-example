Rebilly.initialize({
  // Use your own publishable key:
  publishableKey: "pk_sandbox_7FB1AJwXpG7qOrQukcKcBV_jBJ5622bGmTlknWH",
  icon: {
    color: "#2c3e50",
  },
  style: {
    base: {
      fontSize: "16px",
      boxShadow: "none",
    },
  },
});

const form = document.getElementById('checkout-form');
const errorMessageBox = document.querySelector(".error-message");
const btnSubmit = document.querySelector(".action button");

Rebilly.on("ready", function () {
  Rebilly.card.mount("#mounting-point");
});

form.onsubmit = async function (e) {
  e.preventDefault();
  e.stopPropagation();

  try {
    btnSubmit.disabled = true;

    const {id: paymentToken, billingAddress} = await Rebilly.createToken(form);

    const purchase = {
      paymentToken,
      billingAddress,
      currency: 'USD',
      amount: 100,      
    }

    const response = await fetch("/create-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(purchase),
    });

    const transaction = await response.json();
    const approvalUrl = transaction?._links.find(({rel}) => rel === "approvalUrl");
    
    if (approvalUrl) {
      window.location = approvalUrl.href;
    } else {
      window.location = "/thank-you.html";
    }
  } catch (error) {
    console.log(error);
    errorMessageBox.innerText = "Something went wrong, please try again.";
    errorMessageBox.classList.remove("hidden");
  } finally {
    btnSubmit.disabled = false;
  }
};
