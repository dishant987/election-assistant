import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { logger } from "./logger";

const client = new SecretManagerServiceClient();

export const getSecret = async (secretName: string): Promise<string | null> => {
  // If we have it in env, use it (for local dev)
  if (process.env[secretName]) {
    return process.env[secretName] || null;
  }

  // If in production, try to fetch from Secret Manager
  if (process.env.NODE_ENV === "production" || process.env.GOOGLE_CLOUD_PROJECT) {
    try {
      const project = process.env.GOOGLE_CLOUD_PROJECT;
      if (!project) {
        logger.warn("GOOGLE_CLOUD_PROJECT not set, skipping Secret Manager");
        return null;
      }

      const name = `projects/${project}/secrets/${secretName}/versions/latest`;
      const [version] = await client.accessSecretVersion({ name });
      const payload = version.payload?.data?.toString();
      return payload || null;
    } catch (error) {
      logger.error(`Error fetching secret ${secretName} from Secret Manager:`, error);
      return null;
    }
  }

  return null;
};
