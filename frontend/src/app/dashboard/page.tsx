'use client';

import { useAccount } from 'wagmi';
import Link from 'next/link';
import { FiAward, FiBriefcase, FiPlus, FiUsers, FiTrendingUp, FiDollarSign } from 'react-icons/fi';

export default function DashboardPage() {
    const { address, isConnected } = useAccount();

    // Mock data - replace with real contract calls
    const stats = {
        totalEarned: '2.5',
        activeJobs: 3,
        completedJobs: 12,
        rating: 4.8,
        credentials: 4,
    };

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-7xl mb-6">🔒</div>
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Connect Your Wallet
                    </h1>
                    <p className="text-xl text-gray-600">Please connect your wallet to access your dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        My Dashboard
                    </h1>
                    <p className="text-xl text-gray-600">Welcome back! Here's your activity overview</p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-5 gap-6 mb-10">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-indigo-200 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                <FiDollarSign className="text-white text-xl" />
                            </div>
                        </div>
                        <p className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {stats.totalEarned} ETH
                        </p>
                        <p className="text-sm text-gray-600 font-medium mt-1">Total Earned</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-indigo-200 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                <FiBriefcase className="text-white text-xl" />
                            </div>
                        </div>
                        <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {stats.activeJobs}
                        </p>
                        <p className="text-sm text-gray-600 font-medium mt-1">Active Jobs</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-indigo-200 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <FiTrendingUp className="text-white text-xl" />
                            </div>
                        </div>
                        <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {stats.completedJobs}
                        </p>
                        <p className="text-sm text-gray-600 font-medium mt-1">Completed</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-indigo-200 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                                <span className="text-white text-2xl">★</span>
                            </div>
                        </div>
                        <p className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                            {stats.rating}
                        </p>
                        <p className="text-sm text-gray-600 font-medium mt-1">Rating</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-indigo-200 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                <FiAward className="text-white text-xl" />
                            </div>
                        </div>
                        <p className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {stats.credentials}
                        </p>
                        <p className="text-sm text-gray-600 font-medium mt-1">Credentials</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <Link
                        href="/create-service"
                        className="group bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
                    >
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <FiPlus className="text-4xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-center">Create Service</h3>
                        <p className="text-center text-indigo-100 mt-2">List your skills</p>
                    </Link>

                    <Link
                        href="/marketplace"
                        className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-indigo-200"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <FiBriefcase className="text-4xl text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-center">Browse Jobs</h3>
                        <p className="text-center text-gray-600 mt-2">Find opportunities</p>
                    </Link>

                    <Link
                        href={`/profile/${address}`}
                        className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-indigo-200"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <FiAward className="text-4xl text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-center">My Profile</h3>
                        <p className="text-center text-gray-600 mt-2">View credentials</p>
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* My Credentials Section */}
                    <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-black flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                    <FiAward className="text-white text-xl" />
                                </div>
                                My Credentials
                            </h2>
                            <Link
                                href={`/profile/${address}`}
                                className="text-indigo-600 font-bold hover:underline text-lg"
                            >
                                View All →
                            </Link>
                        </div>
                        <p className="text-gray-600 mb-6 text-lg">Your verified skill credentials (NFTs)</p>

                        <div className="space-y-4">
                            <div className="border-2 border-indigo-100 rounded-2xl p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-xl">🎓</span>
                                    </div>
                                    <h3 className="font-bold text-lg">Solidity Development</h3>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">Verified credential • NFT #1</p>
                            </div>

                            <div className="border-2 border-green-100 rounded-2xl p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-xl">🔒</span>
                                    </div>
                                    <h3 className="font-bold text-lg">Smart Contract Security</h3>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">Verified credential • NFT #2</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* My Services Section */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                    <FiBriefcase className="text-white text-xl" />
                                </div>
                                My Services
                            </h2>
                            <p className="text-gray-600 mb-6 text-lg">Manage your service listings</p>
                            <Link
                                href="/create-service"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all"
                            >
                                <FiPlus />
                                Create New Service
                            </Link>
                        </div>

                        {/* Active Jobs Section */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <FiTrendingUp className="text-white text-xl" />
                                </div>
                                Active Jobs
                            </h2>
                            <p className="text-gray-600 mb-6 text-lg">Track your ongoing work</p>
                            <Link
                                href="/jobs"
                                className="text-indigo-600 font-bold hover:underline text-lg flex items-center gap-2"
                            >
                                View All Jobs <span className="text-xl">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
