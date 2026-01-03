'use client';

import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { useRouter } from 'next/navigation';
import { SKILL_MARKETPLACE_ADDRESS } from '@/config/contracts';
import { skillMarketplaceABI } from '@/config/abis';
import { parseEther } from 'viem';

export default function CreateServicePage() {
    const { address, isConnected } = useAccount();
    const router = useRouter();
    const { writeContract } = useWriteContract();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        credentialId: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await writeContract({
                address: SKILL_MARKETPLACE_ADDRESS as `0x${string}`,
                abi: skillMarketplaceABI,
                functionName: 'createServiceListing',
                args: [
                    formData.title,
                    formData.description,
                    parseEther(formData.price),
                ],
            });

            alert('Service listed successfully!');
            router.push('/dashboard');
        } catch (error) {
            console.error('Error creating service:', error);
            alert('Failed to create service listing');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isConnected) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
                <p className="text-gray-600">Please connect your wallet to create a service.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Create Service Listing</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Select Credential */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Skill Credential *
                        </label>
                        <select
                            required
                            value={formData.credentialId}
                            onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">-- Select a credential --</option>
                            {/* Fetch and display user's credentials */}
                            <option value="1">Solidity Development (Token #1)</option>
                            <option value="2">React Development (Token #2)</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            You must own a credential NFT to list services
                        </p>
                    </div>

                    {/* Service Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Smart Contract Development & Audit"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service Description *
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe your service offering, deliverables, and timeline..."
                            rows={6}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price (ETH) *
                        </label>
                        <input
                            type="number"
                            step="0.001"
                            required
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="0.1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                    >
                        {isLoading ? 'Creating...' : 'List Service'}
                    </button>
                </form>
            </div>
        </div>
    );
}
