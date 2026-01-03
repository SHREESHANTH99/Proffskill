'use client';

import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { SKILL_MARKETPLACE_ADDRESS, REPUTATION_ADDRESS } from '@/config/contracts';
import { skillMarketplaceABI, reputationABI } from '@/config/abis';
import JobTimeline from '@/components/JobTimeline';
import ENSDisplay from '@/components/ENSDisplay';

type TabType = 'provider' | 'client';

export default function JobsPage() {
    const { address, isConnected } = useAccount();
    const { writeContract } = useWriteContract();
    const [activeTab, setActiveTab] = useState<TabType>('provider');
    const [ratingScore, setRatingScore] = useState(5);
    const [review, setReview] = useState('');

    // Mock data - fetch from contract in production
    const providerJobs = [
        {
            jobId: 1,
            client: '0x892d35Cc6634C0532925a3b844Bc9e7595f0cDe',
            description: 'Build NFT Marketplace',
            price: '0.5',
            status: 'pending',
            createdAt: '2024-01-20',
        },
        {
            jobId: 2,
            client: '0x123d35Cc6634C0532925a3b844Bc9e7595f0aaa',
            description: 'Audit DeFi Protocol',
            price: '0.8',
            status: 'accepted',
            createdAt: '2024-01-18',
        },
    ];

    const clientJobs = [
        {
            jobId: 3,
            provider: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
            description: 'Smart Contract Development',
            price: '0.5',
            status: 'completed',
            completedAt: '2024-01-22',
        },
    ];

    const handleAcceptJob = async (jobId: number) => {
        try {
            await writeContract({
                address: SKILL_MARKETPLACE_ADDRESS as `0x${string}`,
                abi: skillMarketplaceABI,
                functionName: 'acceptJob',
                args: [BigInt(jobId)],
            });
            alert('Job accepted!');
        } catch (error) {
            console.error('Error accepting job:', error);
            alert('Failed to accept job');
        }
    };

    const handleMarkComplete = async (jobId: number) => {
        try {
            await writeContract({
                address: SKILL_MARKETPLACE_ADDRESS as `0x${string}`,
                abi: skillMarketplaceABI,
                functionName: 'markJobComplete',
                args: [BigInt(jobId)],
            });
            alert('Job marked as complete!');
        } catch (error) {
            console.error('Error marking job complete:', error);
            alert('Failed to mark job complete');
        }
    };

    const handleReleasePayment = async (jobId: number) => {
        try {
            await writeContract({
                address: SKILL_MARKETPLACE_ADDRESS as `0x${string}`,
                abi: skillMarketplaceABI,
                functionName: 'releasePayment',
                args: [BigInt(jobId)],
            });
            alert('Payment released!');
        } catch (error) {
            console.error('Error releasing payment:', error);
            alert('Failed to release payment');
        }
    };

    const handleRateProvider = async (jobId: number, provider: string) => {
        try {
            await writeContract({
                address: REPUTATION_ADDRESS as `0x${string}`,
                abi: reputationABI,
                functionName: 'rateProvider',
                args: [BigInt(jobId), ratingScore, review],
            });
            alert('Provider rated successfully!');
            setReview('');
            setRatingScore(5);
        } catch (error) {
            console.error('Error rating provider:', error);
            alert('Failed to rate provider');
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
                    <p className="text-xl text-gray-600">Please connect your wallet to view your jobs.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Job Management
                </h1>
                <p className="text-xl text-gray-600 mb-10">
                    Track and manage all your jobs in one place
                </p>

                {/* Tabs */}
                <div className="flex gap-2 mb-10 bg-white rounded-2xl p-2 shadow-lg border border-gray-100 w-fit">
                    <button
                        onClick={() => setActiveTab('provider')}
                        className={`px-8 py-4 font-bold text-lg rounded-xl transition-all ${activeTab === 'provider'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        As Provider
                    </button>
                    <button
                        onClick={() => setActiveTab('client')}
                        className={`px-8 py-4 font-bold text-lg rounded-xl transition-all ${activeTab === 'client'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        As Client
                    </button>
                </div>

            {/* Provider Jobs */}
            {activeTab === 'provider' && (
                <div className="space-y-6">
                    {providerJobs.map((job) => (
                        <div key={job.jobId} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all p-8 border-2 border-transparent hover:border-indigo-200">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-4 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-600">
                                            Job #{job.jobId}
                                        </span>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-500">{job.createdAt}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{job.description}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-500">Client:</span>
                                        <ENSDisplay 
                                            address={job.client as `0x${string}`}
                                            className="text-sm font-semibold text-gray-700"
                                        />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-black mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        {job.price} ETH
                                    </p>
                                    <span
                                        className={`inline-block px-4 py-2 rounded-xl text-sm font-bold shadow-md ${job.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : job.status === 'accepted'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}
                                    >
                                        {job.status}
                                    </span>
                                </div>
                            </div>

                            {/* Job Timeline */}
                            <div className="mb-6">
                                <JobTimeline 
                                    status={job.status === 'pending' ? 0 : job.status === 'accepted' ? 1 : 2}
                                    createdAt={BigInt(Math.floor(new Date(job.createdAt).getTime() / 1000))}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                {job.status === 'pending' && (
                                    <button
                                        onClick={() => handleAcceptJob(job.jobId)}
                                        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all"
                                    >
                                        Accept Job
                                    </button>
                                )}
                                {job.status === 'accepted' && (
                                    <button
                                        onClick={() => handleMarkComplete(job.jobId)}
                                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all"
                                    >
                                        Mark Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Client Jobs */}
            {activeTab === 'client' && (
                <div className="space-y-6">
                    {clientJobs.map((job) => (
                        <div key={job.jobId} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all p-8 border-2 border-transparent hover:border-indigo-200">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-4 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-600">
                                            Job #{job.jobId}
                                        </span>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-500">{job.completedAt}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{job.description}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-500">Provider:</span>
                                        <p className="text-sm font-semibold text-gray-700 truncate">{job.provider}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-black mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        {job.price} ETH
                                    </p>
                                    <span className="inline-block px-4 py-2 rounded-xl text-sm font-bold bg-green-100 text-green-700 shadow-md">
                                        {job.status}
                                    </span>
                                </div>
                            </div>

                            {/* Release Payment */}
                            {job.status === 'completed' && (
                                <div className="space-y-6">
                                    <button
                                        onClick={() => handleReleasePayment(job.jobId)}
                                        className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all"
                                    >
                                        Release Payment
                                    </button>

                                    {/* Rating Section */}
                                    <div className="border-t-2 border-gray-100 pt-6">
                                        <h4 className="text-xl font-bold mb-4">Rate Provider</h4>
                                        <div className="flex items-center gap-3 mb-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setRatingScore(star)}
                                                    className={`text-4xl transition-all transform hover:scale-125 ${star <= ratingScore ? 'text-yellow-500' : 'text-gray-300'
                                                        }`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                            <span className="ml-2 text-lg font-bold text-gray-700">{ratingScore}/5</span>
                                        </div>
                                        <textarea
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                            placeholder="Write a review (optional)..."
                                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                                            rows={4}
                                        />
                                        <button
                                            onClick={() => handleRateProvider(job.jobId, job.provider)}
                                            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all"
                                        >
                                            Submit Rating
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
        </div>
    );
}
