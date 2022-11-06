import { ServerError } from "./errorHandler";

export default function ensureRequiredEnvVars() {
  const requiredEnvVars = [
    process.env.SENDGRID_KEY,
    process.env.SENDGRID_SENDER,
  ];

  requiredEnvVars.forEach((envVar, i) => {
    if (!envVar) {
      throw ServerError(
        `Unable to initialize service, env var is missing (index ${i})`
      );
    }
  });
}
