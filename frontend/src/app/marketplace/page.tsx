'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiFilter } from 'react-icons/fi';
import VerifiedBadge from '@/components/VerifiedBadge';
import ENSDisplay from '@/components/ENSDisplay';

export default function MarketplacePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSkill, setFilterSkill] = useState('all');

    // Mock data - in production, fetch from contract
    const services = [
        {
            id: 1,
            provider: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
            title: 'Smart Contract Development & Audit',
            description: 'Expert Solidity development with security best practices',
            price: '0.5',
            skill: 'Solidity Development',
            reputation: 4.8,
            jobsCompleted: 15,
        },
        {
            id: 2,
            provider: '0x892d35Cc6634C0532925a3b844Bc9e7595f0cDe',
            title: 'Full Stack DApp Development',
            description: 'React + Hardhat + Web3 integration',
            price: '0.8',
            skill: 'Full Stack Web3',
            reputation: 4.9,
            jobsCompleted: 23,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Talent Marketplace
                    </h1>
                    <p className="text-xl text-gray-600">
                        Hire verified talent with guaranteed escrow payments
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-10 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                type="text"
                                placeholder="Search services, skills, providers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                            />
                        </div>

                        {/* Filter */}
                        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border-2 border-gray-200">
                            <FiFilter className="text-indigo-600 text-xl" />
                            <select
                                value={filterSkill}
                                onChange={(e) => setFilterSkill(e.target.value)}
                                className="bg-transparent px-4 py-2 focus:outline-none text-lg font-medium cursor-pointer"
                            >
                                <option value="all">All Skills</option>
                                <option value="solidity">Solidity</option>
                                <option value="react">React</option>
                                <option value="fullstack">Full Stack</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <Link
                            key={service.id}
                            href={`/service/${service.id}`}
                            className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 p-8 border-2 border-transparent hover:border-indigo-200"
                        >
                            {/* Provider Info */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-xl">
                                        {service.provider.slice(2, 4).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <ENSDisplay
                                        address={service.provider as `0x${string}`}
                                        className="text-sm text-gray-600 font-medium truncate"
                                    />
                                </div>
                            </div>

                            {/* Service Details */}
                            <h3 className="text-2xl font-bold mb-3 group-hover:text-indigo-600 transition">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                                {service.description}
                            </p>

                            {/* Verified Credentials Badge */}
                            <div className="mb-6">
                                <VerifiedBadge
                                    hasCredential={true}
                                    skillName={service.skill}
                                    size="sm"
                                />
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between mb-6 py-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-400 text-2xl">★</span>
                                    <span className="font-bold text-lg">{service.reputation}</span>
                                    <span className="text-gray-500">({service.jobsCompleted} jobs)</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <span className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    {service.price} ETH
                                </span>
                                <span className="text-indigo-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                                    View Details <span className="text-xl">→</span>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {services.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold mb-2">No services found</h3>
                        <p className="text-gray-600">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}
