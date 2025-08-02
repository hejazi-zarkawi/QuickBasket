import paypal from "@paypal/checkout-server-sdk"
import dotenv from 'dotenv';

dotenv.config()

export const environment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  console.log(clientId, clientSecret, "ClientId and secret")
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
};

const client = () => {
  return new paypal.core.PayPalHttpClient(environment());
};

export {client}