'use client';

import { useAccount } from 'wagmi';
import Link from 'next/link';
import { FiAward, FiBriefcase, FiPlus } from 'react-icons/fi';

export default function DashboardPage() {
    const { address, isConnected } = useAccount();

    if (!isConnected) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
                <p className="text-gray-600">Please connect your wallet to access your dashboard.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Link
                    href="/create-service"
                    className="bg-primary-600 text-white p-6 rounded-lg shadow-md hover:bg-primary-700 transition text-center"
                >
                    <FiPlus className="text-4xl mx-auto mb-3" />
                    <h3 className="text-xl font-semibold">Create Service</h3>
                </Link>
                <Link
                    href="/marketplace"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
                >
                    <FiBriefcase className="text-4xl mx-auto mb-3 text-primary-600" />
                    <h3 className="text-xl font-semibold">Browse Jobs</h3>
                </Link>
                <Link
                    href={`/profile/${address}`}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
                >
                    <FiAward className="text-4xl mx-auto mb-3 text-primary-600" />
                    <h3 className="text-xl font-semibold">My Profile</h3>
                </Link>
            </div>

            {/* My Credentials Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <FiAward className="text-primary-600" />
                    My Credentials
                </h2>
                <p className="text-gray-600 mb-4">Your verified skill credentials (NFTs)</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Fetch and display credentials from contract */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-2">Loading credentials...</div>
                    </div>
                </div>
            </div>

            {/* My Services Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <FiBriefcase className="text-primary-600" />
                    My Services
                </h2>
                <p className="text-gray-600 mb-4">Manage your service listings</p>
                <Link
                    href="/create-service"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                    <FiPlus />
                    Create New Service
                </Link>
            </div>

            {/* Active Jobs Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Active Jobs</h2>
                <p className="text-gray-600 mb-4">Jobs in progress</p>
                <Link
                    href="/jobs"
                    className="text-primary-600 font-semibold hover:underline"
                >
                    View All Jobs →
                </Link>
            </div>
        </div>
    );
}
