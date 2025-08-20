const { Vonage } = require("@vonage/server-sdk");
const { VONAGE_API_KEY, VONAGE_API_SECRET } = require("./constant");
const vonage = new Vonage({
  apiKey: VONAGE_API_KEY,
  apiSecret: VONAGE_API_SECRET, // if you want to manage your secret, please do so by visiting your API Settings page in your dashboard
});

const from = "Vonage";

const sendSMS = async (toPhoneNumber, text) => {
  await vonage.sms
    .send({ to: toPhoneNumber.replace("0", "84"), from, text })
    .then((resp) => {
      console.log("Message sent successfully");
      console.log(resp);
    })
    .catch((err) => {
      console.log("There was an error sending the messages.");
      console.error(err);
    });
};

module.exports = { sendSMS };
