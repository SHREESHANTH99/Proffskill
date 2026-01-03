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
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
                <p className="text-gray-600">Please connect your wallet to view your jobs.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Job Management</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b">
                <button
                    onClick={() => setActiveTab('provider')}
                    className={`px-6 py-3 font-semibold transition ${activeTab === 'provider'
                            ? 'border-b-2 border-primary-600 text-primary-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    As Provider
                </button>
                <button
                    onClick={() => setActiveTab('client')}
                    className={`px-6 py-3 font-semibold transition ${activeTab === 'client'
                            ? 'border-b-2 border-primary-600 text-primary-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    As Client
                </button>
            </div>

            {/* Provider Jobs */}
            {activeTab === 'provider' && (
                <div className="space-y-4">
                    {providerJobs.map((job) => (
                        <div key={job.jobId} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold">{job.description}</h3>
                                    <p className="text-sm text-gray-500 mb-2">Job #{job.jobId} • {job.createdAt}</p>
                                    <ENSDisplay 
                                        address={job.client as `0x${string}`}
                                        className="text-xs text-gray-400"
                                    />
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary-600">{job.price} ETH</p>
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${job.status === 'pending'
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
                            <JobTimeline 
                                status={job.status === 'pending' ? 0 : job.status === 'accepted' ? 1 : 2}
                                createdAt={BigInt(Math.floor(new Date(job.createdAt).getTime() / 1000))}
                            />

                            {/* Actions */}
                            <div className="flex gap-3 mt-4">
                                {job.status === 'pending' && (
                                    <button
                                        onClick={() => handleAcceptJob(job.jobId)}
                                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                                    >
                                        Accept Job
                                    </button>
                                )}
                                {job.status === 'accepted' && (
                                    <button
                                        onClick={() => handleMarkComplete(job.jobId)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
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
                <div className="space-y-4">
                    {clientJobs.map((job) => (
                        <div key={job.jobId} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold">{job.description}</h3>
                                    <p className="text-sm text-gray-500">Job #{job.jobId} • {job.completedAt}</p>
                                    <p className="text-xs text-gray-400 truncate">Provider: {job.provider}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary-600">{job.price} ETH</p>
                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                        {job.status}
                                    </span>
                                </div>
                            </div>

                            {/* Release Payment */}
                            {job.status === 'completed' && (
                                <div className="space-y-4">
                                    <button
                                        onClick={() => handleReleasePayment(job.jobId)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                    >
                                        Release Payment
                                    </button>

                                    {/* Rating Section */}
                                    <div className="border-t pt-4">
                                        <h4 className="font-semibold mb-2">Rate Provider</h4>
                                        <div className="flex items-center gap-2 mb-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setRatingScore(star)}
                                                    className={`text-2xl ${star <= ratingScore ? 'text-yellow-500' : 'text-gray-300'
                                                        }`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                            placeholder="Write a review (optional)..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                                            rows={3}
                                        />
                                        <button
                                            onClick={() => handleRateProvider(job.jobId, job.provider)}
                                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
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
    );
}
