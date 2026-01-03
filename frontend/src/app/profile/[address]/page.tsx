'use client';

import { useParams } from 'next/navigation';
import { FiAward, FiBriefcase, FiStar } from 'react-icons/fi';
import VerifiedBadge from '@/components/VerifiedBadge';
import ENSDisplay from '@/components/ENSDisplay';

export default function ProfilePage() {
    const params = useParams();
    const address = params.address as string;

    // Mock data - fetch from contracts in production
    const profile = {
        address,
        credentials: [
            {
                id: 1,
                skillName: 'Solidity Development',
                issuer: '0xIssuer1...',
                issuedAt: '2024-01-15',
                verified: true,
            },
            {
                id: 2,
                skillName: 'Smart Contract Security',
                issuer: '0xIssuer2...',
                issuedAt: '2024-03-20',
                verified: true,
            },
        ],
        reputation: {
            totalScore: 72,
            totalJobs: 15,
            averageRating: 4.8,
        },
        completedJobs: [
            {
                id: 1,
                title: 'NFT Marketplace Development',
                client: '0xClient1...',
                completedAt: '2024-01-22',
                rating: 5,
            },
            {
                id: 2,
                title: 'DeFi Protocol Audit',
                client: '0xClient2...',
                completedAt: '2024-01-18',
                rating: 4,
            },
        ],
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-bold text-3xl">
                            {address.slice(2, 4).toUpperCase()}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">Profile</h1>
                        <ENSDisplay 
                            address={address as `0x${string}`}
                            showFull={true}
                            className="text-gray-600 mb-4 font-mono text-sm"
                        />

                        {/* Stats */}
                        <div className="flex gap-6">
                            <div>
                                <p className="text-2xl font-bold text-primary-600">
                                    {profile.credentials.length}
                                </p>
                                <p className="text-sm text-gray-600">Credentials</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-primary-600">
                                    {profile.reputation.totalJobs}
                                </p>
                                <p className="text-sm text-gray-600">Jobs Completed</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-primary-600">
                                    {profile.reputation.averageRating}
                                </p>
                                <p className="text-sm text-gray-600">Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Credentials Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                        <FiAward className="text-primary-600" />
                        Verified Credentials
                    </h2>
                    <div className="space-y-4">
                        {profile.credentials.map((credential) => (
                            <div
                                key={credential.id}
                                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2">{credential.skillName}</h3>
                                        <VerifiedBadge 
                                            hasCredential={credential.verified}
                                            size="sm"
                                            showText={false}
                                        />
                                        <p className="text-sm text-gray-500 mt-2">
                                            Issued: {credential.issuedAt}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">
                                            Issuer: {credential.issuer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reputation & History */}
                <div className="space-y-6">
                    {/* Reputation Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                            <FiStar className="text-primary-600" />
                            Reputation Score
                        </h2>
                        <div className="text-center mb-4">
                            <div className="text-5xl font-bold text-primary-600 mb-2">
                                {profile.reputation.averageRating}
                            </div>
                            <div className="text-yellow-500 text-3xl mb-2">★★★★★</div>
                            <p className="text-gray-600">
                                Based on {profile.reputation.totalJobs} completed jobs
                            </p>
                        </div>
                        <div className="border-t pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Score</span>
                                <span className="font-semibold">{profile.reputation.totalScore}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-2">
                                <span className="text-gray-600">Jobs Completed</span>
                                <span className="font-semibold">{profile.reputation.totalJobs}</span>
                            </div>
                        </div>
                    </div>

                    {/* Completed Jobs */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                            <FiBriefcase className="text-primary-600" />
                            Recent Jobs
                        </h2>
                        <div className="space-y-3">
                            {profile.completedJobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="border-l-4 border-green-500 pl-4 py-2"
                                >
                                    <h3 className="font-semibold">{job.title}</h3>
                                    <p className="text-xs text-gray-500">
                                        Completed: {job.completedAt}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-yellow-500">★</span>
                                        <span className="font-semibold text-sm">{job.rating}/5</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
