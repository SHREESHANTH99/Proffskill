import { create } from "ipfs-http-client";

const projectId = process.env.NEXT_PUBLIC_IPFS_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_IPFS_PROJECT_SECRET;
const ipfsGateway =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://ipfs.io/ipfs/";

// Create IPFS client (Infura or local node)
let ipfsClient: any = null;

if (projectId && projectSecret) {
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
  ipfsClient = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });
}

/**
 * Upload JSON metadata to IPFS
 * @param metadata - Metadata object to upload
 * @returns Object containing IPFS URI and hash
 */
export async function uploadToIPFS(
  metadata: any
): Promise<{ uri: string; hash: string }> {
  if (!ipfsClient) {
    // Fallback: Return mock data for development
    console.warn("IPFS client not configured. Using mock data.");
    const mockHash = "Qm" + Math.random().toString(36).substring(7);
    return {
      uri: `ipfs://${mockHash}`,
      hash: mockHash,
    };
  }

  try {
    const content = JSON.stringify(metadata);
    const result = await ipfsClient.add(content);
    const hash = result.path;

    return {
      uri: `ipfs://${hash}`,
      hash: hash,
    };
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new Error("Failed to upload to IPFS");
  }
}

/**
 * Upload file to IPFS
 * @param file - File to upload
 * @returns Object containing IPFS URI and hash
 */
export async function uploadFileToIPFS(
  file: File
): Promise<{ uri: string; hash: string }> {
  if (!ipfsClient) {
    console.warn("IPFS client not configured. Using mock data.");
    const mockHash = "Qm" + Math.random().toString(36).substring(7);
    return {
      uri: `ipfs://${mockHash}`,
      hash: mockHash,
    };
  }

  try {
    const buffer = await file.arrayBuffer();
    const result = await ipfsClient.add(Buffer.from(buffer));
    const hash = result.path;

    return {
      uri: `ipfs://${hash}`,
      hash: hash,
    };
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw new Error("Failed to upload file to IPFS");
  }
}

/**
 * Get IPFS gateway URL from hash or URI
 * @param hashOrUri - IPFS hash or URI
 * @returns Full gateway URL
 */
export function getIPFSUrl(hashOrUri: string): string {
  const hash = hashOrUri.replace("ipfs://", "");
  return `${ipfsGateway}${hash}`;
}

/**
 * Fetch JSON metadata from IPFS
 * @param hashOrUri - IPFS hash or URI
 * @returns Parsed JSON object
 */
export async function fetchFromIPFS(hashOrUri: string): Promise<any> {
  try {
    const url = getIPFSUrl(hashOrUri);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch from IPFS");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching from IPFS:", error);
    throw error;
  }
}
