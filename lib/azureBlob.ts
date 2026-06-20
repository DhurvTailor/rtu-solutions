// // import { BlobServiceClient, BlobSASPermissions } from "@azure/storage-blob";

// // const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!;
// // const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME!;

// // // PDF upload karo Azure Blob mein
// // export const uploadPDFToAzure = async (
// //   fileBuffer: Buffer,
// //   fileName: string
// // ): Promise<string> => {
// //   const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
// //   const containerClient = blobServiceClient.getContainerClient(containerName);

// //   // Unique naam — duplicate na ho
// //   const uniqueName = `${Date.now()}-${fileName.replace(/\s+/g, "_")}`;
// //   const blockBlobClient = containerClient.getBlockBlobClient(uniqueName);

// //   await blockBlobClient.uploadData(fileBuffer, {
// //     blobHTTPHeaders: { blobContentType: "application/pdf" },
// //   });

// //   return uniqueName; // Yeh naam MySQL mein save hoga
// // };

// // // Secure download URL banao — 15 min valid
// // export const getSecureDownloadURL = async (blobName: string): Promise<string> => {
// //   const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
// //   const containerClient = blobServiceClient.getContainerClient(containerName);
// //   const blockBlobClient = containerClient.getBlockBlobClient(blobName);

// //   const sasUrl = await blockBlobClient.generateSasUrl({
// //     permissions: BlobSASPermissions.parse("r"), // read only
// //     expiresOn: new Date(new Date().valueOf() + 15 * 60 * 1000), // 15 min
// //   });

// //   return sasUrl;
// // };



// import { BlobServiceClient, BlobSASPermissions } from "@azure/storage-blob";

// const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
// const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

// function getContainerClient() {
//   if (!connectionString) {
//     throw new Error(
//       "AZURE_STORAGE_CONNECTION_STRING missing hai env variables mein"
//     );
//   }
//   if (!containerName) {
//     throw new Error(
//       "AZURE_STORAGE_CONTAINER_NAME missing hai env variables mein"
//     );
//   }
//   const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
//   return blobServiceClient.getContainerClient(containerName);
// }

// // Unique blob name banao (file upload nahi karta, sirf naam generate karta hai)
// export function generateBlobName(fileName: string): string {
//   return `${Date.now()}-${fileName.replace(/\s+/g, "_")}`;
// }

// // ── NEW: Write-only SAS URL — frontend isi URL par directly PUT karega ──
// // Isse PDF Vercel server se hokar nahi guzarta, seedha Azure jaata hai,
// // isliye Vercel ki 4.5MB body limit yahan apply nahi hoti.
// export const getUploadSasUrl = async (blobName: string): Promise<string> => {
//   const containerClient = getContainerClient();
//   const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//   const sasUrl = await blockBlobClient.generateSasUrl({
//     permissions: BlobSASPermissions.parse("cw"), // create + write — naya blob upload karne ke liye
//     expiresOn: new Date(new Date().valueOf() + 15 * 60 * 1000), // 15 min
//   });

//   return sasUrl;
// };

// // ── Legacy server-side upload (ab use nahi ho raha, chhoti files ke liye fallback) ──
// export const uploadPDFToAzure = async (
//   fileBuffer: Buffer,
//   fileName: string
// ): Promise<string> => {
//   const containerClient = getContainerClient();
//   const uniqueName = generateBlobName(fileName);
//   const blockBlobClient = containerClient.getBlockBlobClient(uniqueName);

//   await blockBlobClient.uploadData(fileBuffer, {
//     blobHTTPHeaders: { blobContentType: "application/pdf" },
//   });

//   return uniqueName;
// };

// // Secure download URL banao — 15 min valid
// export const getSecureDownloadURL = async (blobName: string): Promise<string> => {
//   const containerClient = getContainerClient();
//   const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//   const sasUrl = await blockBlobClient.generateSasUrl({
//     permissions: BlobSASPermissions.parse("r"), // read only
//     expiresOn: new Date(new Date().valueOf() + 15 * 60 * 1000), // 15 min
//   });

//   return sasUrl;
// };




import { BlobServiceClient, BlobSASPermissions } from "@azure/storage-blob";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

function getContainerClient() {
  if (!connectionString) {
    throw new Error(
      "AZURE_STORAGE_CONNECTION_STRING missing hai env variables mein"
    );
  }
  if (!containerName) {
    throw new Error(
      "AZURE_STORAGE_CONTAINER_NAME missing hai env variables mein"
    );
  }
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  return blobServiceClient.getContainerClient(containerName);
}

// Unique blob name banao (file upload nahi karta, sirf naam generate karta hai)
export function generateBlobName(fileName: string): string {
  return `${Date.now()}-${fileName.replace(/\s+/g, "_")}`;
}

// ── Write-only SAS URL — frontend isi URL par directly PUT karega ──
// Isse PDF Vercel server se hokar nahi guzarta, seedha Azure jaata hai,
// isliye Vercel ki 4.5MB body limit yahan apply nahi hoti.
export const getUploadSasUrl = async (blobName: string): Promise<string> => {
  const containerClient = getContainerClient();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const sasUrl = await blockBlobClient.generateSasUrl({
    permissions: BlobSASPermissions.parse("cw"), // create + write — naya blob upload karne ke liye
    expiresOn: new Date(new Date().valueOf() + 15 * 60 * 1000), // 15 min
  });
  return sasUrl;
};

// ── Legacy server-side upload (ab use nahi ho raha, chhoti files ke liye fallback) ──
export const uploadPDFToAzure = async (
  fileBuffer: Buffer,
  fileName: string
): Promise<string> => {
  const containerClient = getContainerClient();
  const uniqueName = generateBlobName(fileName);
  const blockBlobClient = containerClient.getBlockBlobClient(uniqueName);
  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: "application/pdf" },
  });
  return uniqueName;
};

// Secure download URL banao — 15 min valid.
// contentDisposition: "attachment" set kiya hai taaki browser file ko
// naye tab mein khole nahi, seedha disk par save karne ka prompt de
// (asli "download" wala behaviour).
export const getSecureDownloadURL = async (
  blobName: string,
  downloadFileName?: string
): Promise<string> => {
  const containerClient = getContainerClient();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const safeName = (downloadFileName || blobName)
    .replace(/[^a-zA-Z0-9.\-_ ]/g, "_")
    .trim();

  const sasUrl = await blockBlobClient.generateSasUrl({
    permissions: BlobSASPermissions.parse("r"), // read only
    expiresOn: new Date(new Date().valueOf() + 15 * 60 * 1000), // 15 min
    contentDisposition: `attachment; filename="${safeName}"`,
  });
  return sasUrl;
};

// ── NEW: Azure se blob permanently delete karo ──
// deleteIfExists() use kiya hai taaki agar blob pehle se gayab ho
// (ya naam mismatch ho) to ye error throw na kare, bas silently
// false return kare — admin ka delete flow kabhi crash nahi hoga.
export const deleteBlob = async (blobName: string): Promise<boolean> => {
  const containerClient = getContainerClient();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const result = await blockBlobClient.deleteIfExists();
  return result.succeeded;
};