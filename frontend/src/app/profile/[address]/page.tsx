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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Profile Header */}
                <div className="bg-white rounded-3xl shadow-xl p-10 mb-10 border border-gray-100">
                    <div className="flex items-start gap-8">
                        {/* Avatar */}
                        <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-black text-5xl">
                                {address.slice(2, 4).toUpperCase()}
                            </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Profile
                            </h1>
                            <ENSDisplay 
                                address={address as `0x${string}`}
                                showFull={true}
                                className="text-gray-600 mb-6 font-mono text-lg"
                            />

                            {/* Stats */}
                            <div className="flex gap-8">
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 px-6 py-4 rounded-2xl">
                                    <p className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        {profile.credentials.length}
                                    </p>
                                    <p className="text-sm font-bold text-gray-600 mt-1">Credentials</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-4 rounded-2xl">
                                    <p className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                        {profile.reputation.totalJobs}
                                    </p>
                                    <p className="text-sm font-bold text-gray-600 mt-1">Jobs Done</p>
                                </div>
                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 px-6 py-4 rounded-2xl">
                                    <p className="text-4xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                        {profile.reputation.averageRating}
                                    </p>
                                    <p className="text-sm font-bold text-gray-600 mt-1">Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Credentials Section */}
                    <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                <FiAward className="text-white text-xl" />
                            </div>
                            Verified Credentials
                        </h2>
                        <div className="space-y-4">
                            {profile.credentials.map((credential) => (
                                <div
                                    key={credential.id}
                                    className="border-2 border-gray-100 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-xl mb-3">{credential.skillName}</h3>
                                            <VerifiedBadge 
                                                hasCredential={credential.verified}
                                                size="sm"
                                                showText={false}
                                            />
                                            <p className="text-sm font-medium text-gray-500 mt-3">
                                                Issued: {credential.issuedAt}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate mt-1">
                                                Issuer: {credential.issuer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reputation & History */}
                    <div className="space-y-8">
                        {/* Reputation Card */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                                    <FiStar className="text-white text-xl" />
                                </div>
                                Reputation Score
                            </h2>
                            <div className="text-center mb-6">
                                <div className="text-7xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-3">
                                    {profile.reputation.averageRating}
                                </div>
                                <div className="text-yellow-500 text-5xl mb-3">★★★★★</div>
                                <p className="text-gray-600 text-lg font-medium">
                                    Based on {profile.reputation.totalJobs} completed jobs
                                </p>
                            </div>
                            <div className="border-t-2 border-gray-100 pt-6">
                                <div className="flex justify-between text-lg mb-3">
                                    <span className="text-gray-600 font-medium">Total Score</span>
                                    <span className="font-black">{profile.reputation.totalScore}</span>
                                </div>
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-600 font-medium">Jobs Completed</span>
                                    <span className="font-black">{profile.reputation.totalJobs}</span>
                                </div>
                            </div>
                        </div>

                        {/* Completed Jobs */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                    <FiBriefcase className="text-white text-xl" />
                                </div>
                                Recent Jobs
                            </h2>
                            <div className="space-y-4">
                                {profile.completedJobs.map((job) => (
                                    <div
                                        key={job.id}
                                        className="border-l-4 border-green-500 pl-6 py-3 bg-gradient-to-r from-green-50 to-transparent rounded-r-xl"
                                    >
                                        <h3 className="font-bold text-lg">{job.title}</h3>
                                        <p className="text-sm text-gray-500 font-medium mt-1">
                                            Completed: {job.completedAt}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-yellow-500 text-2xl">★</span>
                                            <span className="font-black text-lg">{job.rating}/5</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
