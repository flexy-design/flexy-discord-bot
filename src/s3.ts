import S3 from "aws-sdk/clients/s3";
import { env } from "./env";

export const s3 = new S3({
  endpoint: `https://${env.accountIdOfS3}.r2.cloudflarestorage.com`,
  accessKeyId: `${env.accessKeyIdOfS3}`,
  secretAccessKey: `${env.secretAccessKeyOfS3}`,
  signatureVersion: "v4",
});
