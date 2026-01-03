'use client';

import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { ADMIN_ADDRESS, ISSUER_REGISTRY_ADDRESS } from '@/config/contracts';
import { issuerRegistryABI } from '@/config/abis';
import { FiShield, FiUserPlus, FiUsers, FiAlertCircle } from 'react-icons/fi';

export default function AdminPage() {
    const { address, isConnected } = useAccount();
    const [issuerAddress, setIssuerAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { writeContract } = useWriteContract();

    // Check if current user is admin
    const isAdmin = address?.toLowerCase() === ADMIN_ADDRESS?.toLowerCase();

    // Mock issuer list - in production, fetch from contract events
    const approvedIssuers = [
        { address: '0x1234...5678', name: 'Tech Academy', credentialsIssued: 45, addedDate: '2024-01-10' },
        { address: '0xabcd...ef12', name: 'Blockchain Institute', credentialsIssued: 32, addedDate: '2024-01-15' },
    ];

    const handleAddIssuer = async () => {
        if (!issuerAddress || !/^0x[a-fA-F0-9]{40}$/.test(issuerAddress)) {
            alert('Please enter a valid Ethereum address');
            return;
        }

        setIsLoading(true);
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
            alert('Failed to add issuer. Make sure you are the admin.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveIssuer = async (issuerAddr: string) => {
        if (!confirm('Are you sure you want to remove this issuer?')) return;

        setIsLoading(true);
        try {
            await writeContract({
                address: ISSUER_REGISTRY_ADDRESS as `0x${string}`,
                abi: issuerRegistryABI,
                functionName: 'removeIssuer',
                args: [issuerAddr as `0x${string}`],
            });
            alert('Issuer removed successfully!');
        } catch (error) {
            console.error('Error removing issuer:', error);
            alert('Failed to remove issuer');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-7xl mb-6">🔒</div>
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Connect Your Wallet
                    </h1>
                    <p className="text-xl text-gray-600">Admin access required</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiAlertCircle className="text-5xl text-red-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
                    <p className="text-xl text-gray-600 mb-6">
                        This page is only accessible to the admin wallet.
                    </p>
                    <p className="text-sm text-gray-500 font-mono break-all bg-red-50 p-4 rounded-xl">
                        Admin: {ADMIN_ADDRESS}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <FiShield className="text-white text-3xl" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                            <p className="text-xl text-gray-600 mt-2">Manage credential issuers and platform settings</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <FiUsers className="text-3xl text-indigo-600" />
                        </div>
                        <p className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {approvedIssuers.length}
                        </p>
                        <p className="text-sm font-bold text-gray-600 mt-1">Active Issuers</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <FiShield className="text-3xl text-green-600" />
                        </div>
                        <p className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            77
                        </p>
                        <p className="text-sm font-bold text-gray-600 mt-1">Total Credentials</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <FiUserPlus className="text-3xl text-purple-600" />
                        </div>
                        <p className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            5
                        </p>
                        <p className="text-sm font-bold text-gray-600 mt-1">This Month</p>
                    </div>
                </div>

                {/* Add Issuer Section */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                    <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                            <FiUserPlus className="text-white" />
                        </div>
                        Add New Issuer
                    </h2>
                    <p className="text-gray-600 mb-6 text-lg">
                        Authorize trusted organizations to issue skill credentials on the platform
                    </p>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="0x... Ethereum Address"
                            value={issuerAddress}
                            onChange={(e) => setIssuerAddress(e.target.value)}
                            className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                        />
                        <button
                            onClick={handleAddIssuer}
                            disabled={isLoading}
                            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:shadow-xl transition-all disabled:opacity-50 transform hover:-translate-y-1"
                        >
                            {isLoading ? 'Adding...' : 'Add Issuer'}
                        </button>
                    </div>
                </div>

                {/* Issuer List Section */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <FiUsers className="text-white" />
                        </div>
                        Approved Issuers
                    </h2>
                    <p className="text-gray-600 mb-6 text-lg">
                        Organizations authorized to verify skills and issue NFT credentials
                    </p>

                    <div className="space-y-4">
                        {approvedIssuers.map((issuer, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-2xl hover:border-indigo-200 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <span className="text-white font-black text-xl">
                                            {issuer.address.slice(2, 4).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl">{issuer.name}</h3>
                                        <p className="text-sm text-gray-500 font-mono">{issuer.address}</p>
                                        <div className="flex gap-4 mt-2">
                                            <span className="text-sm font-bold text-green-600">
                                                {issuer.credentialsIssued} credentials issued
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                Added: {issuer.addedDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveIssuer(issuer.address)}
                                    disabled={isLoading}
                                    className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition disabled:opacity-50 border-2 border-red-200"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    {approvedIssuers.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <FiUsers className="text-6xl mx-auto mb-4 opacity-30" />
                            <p className="text-xl font-bold">No issuers added yet</p>
                            <p className="mt-2">Add your first trusted credential issuer above</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
