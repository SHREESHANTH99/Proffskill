const projectId = process.env.NEXT_PUBLIC_IPFS_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_IPFS_PROJECT_SECRET;
const ipfsGateway =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://ipfs.io/ipfs/";

/**
 * Upload JSON metadata to IPFS
 * @param metadata - Metadata object to upload
 * @returns Object containing IPFS URI and hash
 */
export async function uploadToIPFS(
  metadata: any
): Promise<{ uri: string; hash: string }> {
  // For now, use mock data until IPFS is configured
  console.warn("IPFS upload - using mock data");
  const mockHash = "Qm" + Math.random().toString(36).substring(7);
  return {
    uri: `ipfs://${mockHash}`,
    hash: mockHash,
  };
}

/**
 * Upload file to IPFS
 * @param file - File to upload
 * @returns Object containing IPFS URI and hash
 */
export async function uploadFileToIPFS(
  file: File
): Promise<{ uri: string; hash: string }> {
  console.warn("IPFS file upload - using mock data");
  const mockHash = "Qm" + Math.random().toString(36).substring(7);
  return {
    uri: `ipfs://${mockHash}`,
    hash: mockHash,
  };
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
