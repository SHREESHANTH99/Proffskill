'use client';

import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { SKILL_CREDENTIAL_NFT_ADDRESS } from '@/config/contracts';
import { skillCredentialNFTABI } from '@/config/abis';
import { uploadToIPFS } from '@/utils/ipfs';

export default function IssuerPage() {
    const { address } = useAccount();
    const { writeContract } = useWriteContract();

    const [formData, setFormData] = useState({
        skillName: '',
        recipientWallet: '',
        description: '',
        metadataFile: null as File | null,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, metadataFile: e.target.files[0] });
        }
    };

    const handleMintCredential = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Upload metadata to IPFS
            const metadata = {
                name: formData.skillName,
                description: formData.description,
                issuer: address,
                issuedAt: Date.now(),
            };

            const { uri, hash } = await uploadToIPFS(metadata);

            // Mint NFT
            await writeContract({
                address: SKILL_CREDENTIAL_NFT_ADDRESS as `0x${string}`,
                abi: skillCredentialNFTABI,
                functionName: 'mintCredential',
                args: [
                    formData.recipientWallet as `0x${string}`,
                    formData.skillName,
                    uri,
                    hash,
                ],
            });

            alert('Credential minted successfully!');
            setFormData({
                skillName: '',
                recipientWallet: '',
                description: '',
                metadataFile: null,
            });
        } catch (error) {
            console.error('Error minting credential:', error);
            alert('Failed to mint credential');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Issuer Dashboard</h1>

            {/* Mint Credential Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-6">Mint Skill Credential</h2>
                <form onSubmit={handleMintCredential} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Skill Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.skillName}
                            onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                            placeholder="e.g., Solidity Smart Contract Development"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Recipient Wallet Address *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.recipientWallet}
                            onChange={(e) => setFormData({ ...formData, recipientWallet: e.target.value })}
                            placeholder="0x..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Credential description and details..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Metadata (Optional)
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".json,.pdf,.png,.jpg"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                    >
                        {isLoading ? 'Minting...' : 'Mint Credential NFT'}
                    </button>
                </form>
            </div>

            {/* Issued Credentials */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Issued Credentials</h2>
                <p className="text-gray-600">
                    View all credentials you've issued (fetch from contract events)
                </p>
            </div>
        </div>
    );
}
