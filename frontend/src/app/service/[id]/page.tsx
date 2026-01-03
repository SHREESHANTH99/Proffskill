'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { SKILL_MARKETPLACE_ADDRESS } from '@/config/contracts';
import { skillMarketplaceABI } from '@/config/abis';
import Link from 'next/link';
import { FiArrowLeft, FiShield, FiStar, FiAward, FiClock, FiCheckCircle } from 'react-icons/fi';
import ENSDisplay from '@/components/ENSDisplay';
import VerifiedBadge from '@/components/VerifiedBadge';

export default function ServiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const { writeContract } = useWriteContract();
    const [isHiring, setIsHiring] = useState(false);

    // Mock data - in production, fetch from contract using service ID
    const service = {
        id: params.id,
        provider: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        title: 'Smart Contract Development & Audit',
        description: 'Expert Solidity development with security best practices. I provide:\n\n• Custom smart contract development\n• Security audits\n• Gas optimization\n• Test coverage\n• Documentation\n\nWith 15 successful projects delivered, I ensure your contracts are secure, efficient, and production-ready.',
        price: '0.5',
        skill: 'Solidity Development',
        reputation: 4.8,
        jobsCompleted: 15,
        totalEarned: '7.5',
        responseTime: '2 hours',
        deliveryTime: '5-7 days',
        credentials: [
            { id: 1, name: 'Solidity Development', issuer: '0xIssuer1...abc', date: '2024-01-15' },
            { id: 2, name: 'Smart Contract Security', issuer: '0xIssuer2...def', date: '2024-03-20' },
        ],
        features: [
            'Clean, documented code',
            'Comprehensive testing',
            'Gas optimization',
            'Security best practices',
            'Ongoing support'
        ],
        reviews: [
            { client: '0xClient1...xyz', rating: 5, comment: 'Excellent work! Very professional and delivered on time.', date: '2024-01-20' },
            { client: '0xClient2...abc', rating: 5, comment: 'Great smart contract audit. Found critical issues.', date: '2024-01-15' },
        ]
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
            router.push('/jobs');
        } catch (error) {
            console.error('Error hiring service:', error);
            alert('Failed to hire service. Make sure you have enough ETH.');
        } finally {
            setIsHiring(false);
        }
    };

    const isOwnService = address?.toLowerCase() === service.provider.toLowerCase();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <Link
                    href="/marketplace"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold mb-8 text-lg"
                >
                    <FiArrowLeft /> Back to Marketplace
                </Link>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Title Section */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                            <div className="flex items-start justify-between mb-4">
                                <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent pr-4">
                                    {service.title}
                                </h1>
                                <VerifiedBadge hasCredential={true} size="lg" showText={false} />
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl">
                                    <FiClock className="text-indigo-600" />
                                    <span className="font-medium">Responds in {service.responseTime}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl">
                                    <FiCheckCircle className="text-green-600" />
                                    <span className="font-medium">{service.deliveryTime} delivery</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                                About This Service
                            </h2>
                            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                                {service.description}
                            </p>
                        </div>

                        {/* What's Included */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-2xl font-black mb-6">What's Included</h2>
                            <div className="grid gap-4">
                                {service.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-100">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <FiCheckCircle className="text-white" />
                                        </div>
                                        <span className="font-bold text-gray-800">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Verified Credentials */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                    <FiAward className="text-white" />
                                </div>
                                Verified Skills (NFT Credentials)
                            </h2>
                            <div className="space-y-4">
                                {service.credentials.map((cred) => (
                                    <div key={cred.id} className="flex items-start gap-4 p-6 border-2 border-indigo-100 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-lg transition-all">
                                        <div className="text-green-500 text-3xl">
                                            <FiCheckCircle />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-xl mb-2">{cred.name}</h3>
                                            <p className="text-sm font-medium text-gray-600 mb-1">
                                                Issued: {cred.date}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                Issuer: {cred.issuer}
                                            </p>
                                        </div>
                                        <VerifiedBadge hasCredential={true} size="md" showText={false} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-2xl font-black mb-6">Client Reviews</h2>
                            <div className="space-y-6">
                                {service.reviews.map((review, idx) => (
                                    <div key={idx} className="border-l-4 border-yellow-500 pl-6 py-4 bg-gradient-to-r from-yellow-50 to-transparent">
                                        <div className="flex items-center justify-between mb-3">
                                            <ENSDisplay
                                                address={review.client as `0x${string}`}
                                                className="font-bold text-gray-700"
                                            />
                                            <div className="flex items-center gap-2">
                                                <span className="text-yellow-500 text-2xl">{'★'.repeat(review.rating)}</span>
                                                <span className="font-black text-lg">{review.rating}/5</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 text-lg italic">"{review.comment}"</p>
                                        <p className="text-sm text-gray-500 mt-2">{review.date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Price & Hire Card */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100 sticky top-24">
                            <div className="text-center mb-6">
                                <p className="text-gray-600 mb-2 font-medium text-lg">Service Price</p>
                                <p className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    {service.price} ETH
                                </p>
                                <p className="text-sm text-gray-500">≈ ${(parseFloat(service.price) * 3500).toFixed(2)} USD</p>
                            </div>

                            <button
                                onClick={handleHire}
                                disabled={isHiring || isOwnService}
                                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-black rounded-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 mb-4"
                            >
                                {isHiring ? 'Processing...' : isOwnService ? 'Your Service' : 'Hire Now'}
                            </button>

                            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                                <FiShield className="text-green-600 text-xl flex-shrink-0 mt-1" />
                                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                    Payment held securely in escrow until work is completed. 7-day dispute protection included.
                                </p>
                            </div>
                        </div>

                        {/* Provider Card */}
                        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-xl font-black mb-4">About Provider</h2>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-black text-2xl">
                                        {service.provider.slice(2, 4).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <ENSDisplay
                                        address={service.provider as `0x${string}`}
                                        className="text-sm font-bold text-gray-700 truncate"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                    <span className="text-gray-600 font-medium">Total Earned</span>
                                    <span className="font-black text-green-600">{service.totalEarned} ETH</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                    <span className="text-gray-600 font-medium">Jobs Done</span>
                                    <span className="font-black">{service.jobsCompleted}</span>
                                </div>
                            </div>

                            <Link
                                href={`/profile/${service.provider}`}
                                className="w-full inline-block text-center px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition"
                            >
                                View Full Profile →
                            </Link>
                        </div>

                        {/* Reputation Card */}
                        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-xl font-black mb-4 flex items-center gap-3">
                                <FiStar className="text-yellow-500" />
                                Reputation
                            </h2>
                            <div className="text-center">
                                <div className="text-6xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                                    {service.reputation}
                                </div>
                                <div className="text-yellow-500 text-4xl mb-3">★★★★★</div>
                                <p className="text-gray-600 font-medium">
                                    Based on {service.jobsCompleted} completed jobs
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
