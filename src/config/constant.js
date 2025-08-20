const dotenv = require("dotenv");
dotenv.config();

ACCESS_CODE_EXPIRE = 2 * 60 * 1000;

// to validate emlpoyee
SECRET_KEY = process.env.SECRET_KEY;

VONAGE_API_KEY = process.env.VONAGE_API_KEY;
VONAGE_API_SECRET = process.env.VONAGE_API_SECRET;
VONAGE_VIRTUAL_NUMBER = process.env.VONAGE_VIRTUAL_NUMBER;

BREVO_API_KEY = process.env.BREVO_API_KEY;

CLIENT_URL = process.env.CLIENT_URL;

module.exports = {
  ACCESS_CODE_EXPIRE,
  SECRET_KEY,
  VONAGE_API_KEY,
  VONAGE_API_SECRET,
  VONAGE_VIRTUAL_NUMBER,
  BREVO_API_KEY,
  CLIENT_URL,
};
