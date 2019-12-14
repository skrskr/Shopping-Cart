$(document).ready(function() {
  const stripePublicKey = $("#stripe-input").val();
  // console.log("Public key: ", stripePublicKey);

  const checkoutHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: "auto"
  });
  $("#checkout-btn").click(function() {
    checkoutHandler.open({
      token: handleToken
    });
  });
});

// After Getting token send request to server
function handleToken(token) {
  fetch("/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(token)
  })
    .then(function(res) {
      return res.json();
    })
    .then(function(output) {
      if (output.code === 200) {
        console.log("Charage Succesfully");
        window.location.replace("/");
      } else {
        console.log("Charage Failed");
        window.location.replace("/shopping-cart");
      }
    })
    .catch(err => {
      console.log("CATCH ERR,", err.message);
    });
}
