const Sib = require("@getbrevo/brevo");
const { BREVO_API_KEY } = require("./constant");

const apiInstance = new Sib.TransactionalEmailsApi();
const apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = BREVO_API_KEY;

const sendEmail = async (toEmail, subject, text, html) => {
  const sender = {
    email: "nhat.skipli94@gmail.com",
    name: "nhatle",
  };

  const receivers = [{ email: toEmail }];

  try {
    const response = await apiInstance.sendTransacEmail({
      sender,
      to: receivers,
      subject: subject,
      textContent: text,
      htmlContent: html,
    });
    console.log("Email đã được gửi thành công.");
  } catch (error) {
    console.error("Lỗi khi gửi email:");
  }
};

module.exports = { sendEmail };
