import { BlobServiceClient, BlobSASPermissions } from "@azure/storage-blob";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME!;

// PDF upload karo Azure Blob mein
export const uploadPDFToAzure = async (
  fileBuffer: Buffer,
  fileName: string
): Promise<string> => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Unique naam — duplicate na ho
  const uniqueName = `${Date.now()}-${fileName.replace(/\s+/g, "_")}`;
  const blockBlobClient = containerClient.getBlockBlobClient(uniqueName);

  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: "application/pdf" },
  });

  return uniqueName; // Yeh naam MySQL mein save hoga
};

// Secure download URL banao — 15 min valid
export const getSecureDownloadURL = async (blobName: string): Promise<string> => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const sasUrl = await blockBlobClient.generateSasUrl({
    permissions: BlobSASPermissions.parse("r"), // read only
    expiresOn: new Date(new Date().valueOf() + 15 * 60 * 1000), // 15 min
  });

  return sasUrl;
};