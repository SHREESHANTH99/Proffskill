'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { ADMIN_ADDRESS, ISSUER_REGISTRY_ADDRESS } from '@/config/contracts';
import { issuerRegistryABI } from '@/config/abis';

export default function AdminPage() {
    const { address } = useAccount();
    const [issuerAddress, setIssuerAddress] = useState('');
    const { writeContract } = useWriteContract();

    // Check if current user is admin
    const isAdmin = address?.toLowerCase() === ADMIN_ADDRESS?.toLowerCase();

    const handleAddIssuer = async () => {
        if (!issuerAddress) return;

        try {
            await writeContract({
                address: ISSUER_REGISTRY_ADDRESS as `0x${string}`,
                abi: issuerRegistryABI,
                functionName: 'addIssuer',
                args: [issuerAddress as `0x${string}`],
            });
            setIssuerAddress('');
            alert('Issuer added successfully!');
        } catch (error) {
            console.error('Error adding issuer:', error);
            alert('Failed to add issuer');
        }
    };

    const handleRemoveIssuer = async (address: string) => {
        try {
            await writeContract({
                address: ISSUER_REGISTRY_ADDRESS as `0x${string}`,
                abi: issuerRegistryABI,
                functionName: 'removeIssuer',
                args: [address as `0x${string}`],
            });
            alert('Issuer removed successfully!');
        } catch (error) {
            console.error('Error removing issuer:', error);
            alert('Failed to remove issuer');
        }
    };

    if (!isAdmin) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600">This page is only accessible to the admin wallet.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Add Issuer Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Add Issuer</h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="0x... Issuer Address"
                        value={issuerAddress}
                        onChange={(e) => setIssuerAddress(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                        onClick={handleAddIssuer}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                    >
                        Add Issuer
                    </button>
                </div>
            </div>

            {/* Issuer List Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Approved Issuers</h2>
                <p className="text-gray-600 mb-4">
                    Manage trusted organizations authorized to issue credentials.
                </p>
                {/* In production, fetch and display the list of issuers from contract events */}
                <div className="text-sm text-gray-500">
                    Connect to contract to view issuer list
                </div>
            </div>
        </div>
    );
}
