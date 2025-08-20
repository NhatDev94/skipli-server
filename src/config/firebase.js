const admin = require("firebase-admin");
const { PRIVATE_KEY_ID } = require("./constant");
// const serviceAccount = require("../config/firebase-service-accout.json");

const serviceAccount = {
  type: "service_account",
  project_id: "skipli-8c211",
  private_key_id: PRIVATE_KEY_ID,
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDUmO6KHesA2973\nx0t2yXfvf77u5mOLrTIflrz63CqbqEGcYbqBoZat9dtNwBcE/brXd3k1JFK+dL+I\nPoVtuywln5kKDyCCMA7RxTbY8kZ7vBhEy1Nkh2pCctUP+4CiR5kE2bVlAs5/sutO\nc8xlT6Rwp+9PAoTddY/6dMnAeczHDdQJyd/InKcHZppWq9+4f3KaDw22aLvQ3gme\ntm9j2AWKKuNVj9wVi/xhsN6AOJJl5psGoOv53W3JQywxanm1Ud3t97xk2L+HbdvO\npRjPmsPabGp9/ymFYJ947fnNMGfQ11QGGxwzYHjWmKYYUnj9h62cfzVm19lDNEu9\nU9NUVBXrAgMBAAECggEAKOFHbTOXjtC4rTibYDoZX+pWkqWmmqMxMjXQHQTdBJV0\nGFgKfwbNbKIMC4VWZ9VKakhE/F0BtDHK6q3rBlCpioqH6RFDlQUctGWRyGG9/+kJ\nWaEnZftMCX7/TVV1RL8zw2UBpmzFvHRxHuLReOG5oxgHwk+fsN38U5LFgMdrAxNh\n6uNghCeIrSnaTRDTivNk2uQ57UvZv+koBU5IyOnC1x8hD7dHwMrnrHfzm+roJ21a\nIyuzG47GCvq/gs76oRPcKPf8zldssrkkB823RIvR4ads5g9oBuqmjoM1yrD59ikF\nfOG3YnIZtFQBT7W53BpZaXK/IbG3bRBuw/6cAAG8gQKBgQDr2Qy5HFrvpd64fPch\ngNi2O2v3X+4uyQttJVqGEr/TTY+QYXM9r/sYZdFdFOQc3lQIfkR6DiskgCFKmrNS\nkqkDXyi1QQmGCP7P4g8m9VtOMnJuOaedSQl42wh0saSP7nUNAgHPj2/TeGRsbE2R\nFYH1Gi5+I6VR7K5OgUshaBjFIQKBgQDmw0zTUBHW0DEmvNY/yT6mTXhJ8hccnc37\nIQbK+83kSxyZoUNuAbp8EahUm9Rv9OnutUJGTQEISP6QqnNvxyeCF8OoEATK3AuI\nOmT3Nc1oIzd8Vp5ciAR7jBsksr/01E51Nmm9A/Sf39r4y0gyBCIMc5rFETUGXgrj\nbT9r8rJtiwKBgQDmscvBMdw9eAkQeqQdcHQKZLtqILrRprP3kkcmyCY84SwhtUDN\nQVsidU3Cd9Hd7xdRq3j9zugibvahjAsGJREPjEA8c56GLjxZSa06lVs3dR77dIfg\n0PVj8xQlWTI3269BBwqQZaSjvKq2Z4XD+b7B6lc56VInfZTOk6fSyIkaIQKBgQCx\nnYLlZszERax/P3u8zt4MzLYYXGDTotanQ41h8RxRakrSKOCorGXoFwM0VFjX72+b\nTyJ6z8xKnzxpBvkhAO304Ou00NePeHzb1u5dpKi8TdboOhdb60lf+r/tqDO9cygM\nadxLIt9Hqtp1AqpH7Qxz/wsSQaNJilrhH/Zf1Qbm7wKBgQCWrfkUjO0JLqbGxH9q\nMxaTgbKXhL9ggUuZMP5poNBo/2vs8gjx8BLJU2xcj6uRgNHikHCKf6v+uXd+cCEJ\nu4r4DTmnCaSnjwH132c6nKsKLtT/92M5egnIcKV8jrboSxD6e1FVVw7XbaTYBOx/\nO4N4XSWBAWdPdLjl2fS0Zf7iLA==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@skipli-8c211.iam.gserviceaccount.com",
  client_id: "106668034332283116339",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40skipli-8c211.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://skipli-8c211.firebaseio.com",
});

const db = admin.firestore();

module.exports = { db };
