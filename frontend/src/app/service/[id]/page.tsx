'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAccount, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { SKILL_MARKETPLACE_ADDRESS } from '@/config/contracts';
import { skillMarketplaceABI } from '@/config/abis';
import Link from 'next/link';

export default function ServiceDetailPage() {
    const params = useParams();
    const { address, isConnected } = useAccount();
    const { writeContract } = useWriteContract();
    const [isHiring, setIsHiring] = useState(false);

    // Mock data - fetch from contract in production
    const service = {
        id: params.id,
        provider: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        title: 'Smart Contract Development & Audit',
        description: 'Expert Solidity development with security best practices. I provide:\n\n• Custom smart contract development\n• Security audits\n• Gas optimization\n• Test coverage\n• Documentation',
        price: '0.5',
        skill: 'Solidity Development',
        reputation: 4.8,
        jobsCompleted: 15,
        credentials: [
            { id: 1, name: 'Solidity Development', issuer: '0xIssuer1', date: '2024-01-15' },
            { id: 2, name: 'Smart Contract Security', issuer: '0xIssuer2', date: '2024-03-20' },
        ],
    };

    const handleHire = async () => {
        if (!isConnected) {
            alert('Please connect your wallet');
            return;
        }

        setIsHiring(true);
        try {
            await writeContract({
                address: SKILL_MARKETPLACE_ADDRESS as `0x${string}`,
                abi: skillMarketplaceABI,
                functionName: 'hireService',
                args: [service.provider as `0x${string}`, service.title],
                value: parseEther(service.price),
            });

            alert('Service hired successfully! ETH locked in escrow.');
        } catch (error) {
            console.error('Error hiring service:', error);
            alert('Failed to hire service');
        } finally {
            setIsHiring(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <Link href="/marketplace" className="text-primary-600 hover:underline mb-4 inline-block">
                ← Back to Marketplace
            </Link>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2">
                    <h1 className="text-3xl font-bold mb-4">{service.title}</h1>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-3">Description</h2>
                        <p className="text-gray-700 whitespace-pre-line">{service.description}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-3">Verified Skills</h2>
                        <div className="space-y-3">
                            {service.credentials.map((cred) => (
                                <div key={cred.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                                    <div className="text-green-500 text-2xl">✓</div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{cred.name}</h3>
                                        <p className="text-sm text-gray-500">Issued: {cred.date}</p>
                                        <p className="text-xs text-gray-400 truncate">Issuer: {cred.issuer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="md:col-span-1">
                    {/* Provider Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Provider</h2>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-600 font-semibold text-lg">
                                    {service.provider.slice(2, 4).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs text-gray-500 truncate">{service.provider}</p>
                            </div>
                        </div>

                        <Link
                            href={`/profile/${service.provider}`}
                            className="text-primary-600 hover:underline text-sm"
                        >
                            View Full Profile →
                        </Link>
                    </div>

                    {/* Reputation Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Reputation</h2>
                        <div className="text-center mb-4">
                            <div className="text-4xl font-bold text-primary-600">{service.reputation}</div>
                            <div className="text-yellow-500 text-2xl">★★★★★</div>
                        </div>
                        <p className="text-center text-gray-600">{service.jobsCompleted} jobs completed</p>
                    </div>

                    {/* Price & Hire Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                        <div className="text-center mb-4">
                            <p className="text-gray-600 mb-2">Service Price</p>
                            <p className="text-4xl font-bold text-primary-600">{service.price} ETH</p>
                        </div>

                        <button
                            onClick={handleHire}
                            disabled={isHiring || address?.toLowerCase() === service.provider.toLowerCase()}
                            className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isHiring ? 'Processing...' : 'Hire Service (Pay ETH)'}
                        </button>

                        <p className="text-xs text-gray-500 mt-3 text-center">
                            Payment will be held in escrow until work is completed
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
