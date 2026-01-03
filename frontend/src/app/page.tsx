'use client';

import Link from 'next/link';
import { FiShield, FiAward, FiUsers, FiTrendingUp } from 'react-icons/fi';
import ConnectButton from '@/components/ConnectButton';

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section with Modern Gradient */}
            <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-24 px-4 overflow-hidden">
                {/* Animated Background Circles */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="inline-block animate-bounce mb-6">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                            <FiShield className="text-5xl text-white" />
                        </div>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
                            ProofSkill
                        </span>
                    </h1>
                    <p className="text-2xl md:text-3xl mb-4 font-bold">
                        Decentralized Trust Infrastructure
                    </p>
                    <p className="text-lg mb-10 opacity-90 max-w-3xl mx-auto">
                        EIP-5192 Soulbound Credentials • Value-Weighted Reputation • Trustless Escrow
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <ConnectButton />
                        <Link
                            href="/marketplace"
                            className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-2xl flex items-center gap-2"
                        >
                            Explore Marketplace <span className="text-xl">→</span>
                        </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="mt-20 grid grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/20 transition">
                            <div className="text-4xl md:text-5xl font-black mb-2">EIP-5192</div>
                            <div className="text-sm md:text-base opacity-90 font-medium">Standards Compliant</div>
                        </div>
                        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/20 transition">
                            <div className="text-4xl md:text-5xl font-black mb-2">7 Days</div>
                            <div className="text-sm md:text-base opacity-90 font-medium">Auto-Claim Window</div>
                        </div>
                        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/20 transition">
                            <div className="text-4xl md:text-5xl font-black mb-2">2%</div>
                            <div className="text-sm md:text-base opacity-90 font-medium">Immutable Fee</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Statement with Modern Cards */}
            <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            The Problem
                        </h2>
                        <p className="text-xl text-gray-600">Traditional platforms fail in three critical ways</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { emoji: '🚫', title: 'Fake Credentials', desc: 'Anyone can claim skills without verification, leading to trust issues in hiring.' },
                            { emoji: '🔒', title: 'No Ownership', desc: 'Credentials are controlled by centralized platforms, not by you.' },
                            { emoji: '⚠️', title: 'Payment Risks', desc: 'Freelancers risk non-payment and clients risk incomplete work.' }
                        ].map((item, i) => (
                            <div key={i} className="group bg-white p-8 rounded-3xl shadow-xl border-2 border-red-100 hover:border-red-300 hover:shadow-2xl transition transform hover:-translate-y-3">
                                <div className="text-6xl mb-6 group-hover:scale-110 transition">{item.emoji}</div>
                                <h3 className="text-2xl font-bold mb-4 text-red-600">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works with Modern Design */}
            <section className="py-24 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            How ProofSkill Works
                        </h2>
                        <p className="text-xl text-gray-600">Four simple steps to trustless work</p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { Icon: FiShield, title: 'Get Verified', desc: 'Trusted issuers mint skill credentials as soulbound NFTs on your wallet.', color: 'from-indigo-500 to-purple-500' },
                            { Icon: FiAward, title: 'List Services', desc: 'Create service offerings backed by your verified credentials.', color: 'from-purple-500 to-pink-500' },
                            { Icon: FiUsers, title: 'Get Hired', desc: 'Clients hire through smart contract escrow for trustless payments.', color: 'from-pink-500 to-red-500' },
                            { Icon: FiTrendingUp, title: 'Build Reputation', desc: 'Earn value-weighted on-chain reputation through completed jobs.', color: 'from-red-500 to-orange-500' }
                        ].map((item, i) => (
                            <div key={i} className="text-center group">
                                <div className={`relative w-24 h-24 bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition shadow-2xl`}>
                                    <item.Icon className="text-5xl text-white" />
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-indigo-600 shadow-lg">
                                        {i + 1}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid with Icons */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Key Features
                        </h2>
                        <p className="text-xl text-gray-600">Production-grade decentralized infrastructure</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: '🔒', title: 'Non-Forgeable', desc: 'Credentials are blockchain NFTs - impossible to fake or tamper with.' },
                            { icon: '👤', title: 'User-Owned', desc: 'You own your credentials in your wallet, not on a centralized platform.' },
                            { icon: '✅', title: 'Easily Verifiable', desc: 'Anyone can verify credentials on-chain instantly and trustlessly.' },
                            { icon: '🤝', title: 'Smart Escrow', desc: 'Payments locked in smart contracts with 7-day dispute window.' },
                            { icon: '⭐', title: 'Weighted Reputation', desc: 'Economic-weighted reputation prevents gaming with fake jobs.' },
                            { icon: '🚫', title: 'No Central Authority', desc: 'Decentralized system with immutable 2% fee guarantee.' }
                        ].map((feature, i) => (
                            <div key={i} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition border border-gray-100">
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Role-Based CTAs with Modern Design */}
            <section className="py-24 px-4 bg-gradient-to-br from-gray-50 to-indigo-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Choose Your Role
                        </h2>
                        <p className="text-xl text-gray-600">Get started in seconds</p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { href: '/admin', emoji: '🔐', title: 'Admin', desc: 'Manage trusted credential issuers', cta: 'Manage Platform' },
                            { href: '/issuer', emoji: '✍️', title: 'Issuer', desc: 'Mint verified skill credentials', cta: 'Issue Credentials' },
                            { href: '/dashboard', emoji: '💼', title: 'Talent', desc: 'List services and earn', cta: 'My Dashboard' },
                            { href: '/marketplace', emoji: '🛒', title: 'Client', desc: 'Hire verified talent', cta: 'Browse Marketplace' }
                        ].map((role, i) => (
                            <Link
                                key={i}
                                href={role.href}
                                className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition text-center transform hover:-translate-y-2 border-2 border-transparent hover:border-indigo-200"
                            >
                                <div className="text-6xl mb-4 group-hover:scale-110 transition">{role.emoji}</div>
                                <h3 className="text-2xl font-bold mb-3">{role.title}</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">{role.desc}</p>
                                <span className="inline-flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-4 transition-all">
                                    {role.cta} <span className="text-xl">→</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-bold mb-6">Ready to Get Started?</h2>
                    <p className="text-xl mb-10 opacity-90">
                        Join the decentralized trust infrastructure for the future of work
                    </p>
                    <div className="flex gap-6 justify-center flex-wrap">
                        <ConnectButton />
                        <Link
                            href="/marketplace"
                            className="px-10 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-2xl text-lg"
                        >
                            Explore Now →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
