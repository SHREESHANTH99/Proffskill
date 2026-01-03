'use client';

import Link from 'next/link';
import ConnectButton from '@/components/ConnectButton';
import { useAccount } from 'wagmi';

export default function Header() {
    const { address, isConnected } = useAccount();

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-primary-600">
                    ProofSkill
                </Link>

                {/* Navigation Links */}
                {isConnected && (
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 transition">
                            Dashboard
                        </Link>
                        <Link href="/marketplace" className="text-gray-700 hover:text-primary-600 transition">
                            Marketplace
                        </Link>
                        <Link href="/jobs" className="text-gray-700 hover:text-primary-600 transition">
                            Jobs
                        </Link>
                        <Link href={`/profile/${address}`} className="text-gray-700 hover:text-primary-600 transition">
                            Profile
                        </Link>
                    </div>
                )}

                {/* Wallet Connect Button */}
                <ConnectButton />
            </nav>
        </header>
    );
}
