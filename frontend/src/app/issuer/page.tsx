'use client';

import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { SKILL_CREDENTIAL_NFT_ADDRESS } from '@/config/contracts';
import { skillCredentialNFTABI } from '@/config/abis';
import { uploadToIPFS } from '@/utils/ipfs';
import { FiAward, FiUser, FiFileText, FiUpload, FiCheckCircle } from 'react-icons/fi';

export default function IssuerPage() {
    const { address, isConnected } = useAccount();
    const { writeContract } = useWriteContract();

    const [formData, setFormData] = useState({
        skillName: '',
        recipientWallet: '',
        description: '',
        isSoulbound: true,
    });
    const [isLoading, setIsLoading] = useState(false);

    // Stats - in production, fetch from contract
    const stats = {
        totalIssued: 45,
        activeRecipients: 32,
        thisMonth: 8,
    };

    const handleMintCredential = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.skillName || !formData.recipientWallet || !formData.description) {
            alert('Please fill in all required fields');
            return;
        }

        if (!/^0x[a-fA-F0-9]{40}$/.test(formData.recipientWallet)) {
            alert('Please enter a valid Ethereum address');
            return;
        }

        setIsLoading(true);

        try {
            // Upload metadata to IPFS
            const metadata = {
                name: formData.skillName,
                description: formData.description,
                issuer: address,
                issuedAt: new Date().toISOString(),
                attributes: [
                    { trait_type: 'Skill', value: formData.skillName },
                    { trait_type: 'Issuer', value: address },
                    { trait_type: 'Soulbound', value: formData.isSoulbound },
                ]
            };

            const { uri } = await uploadToIPFS(metadata);

            // Mint NFT credential
            await writeContract({
                address: SKILL_CREDENTIAL_NFT_ADDRESS as `0x${string}`,
                abi: skillCredentialNFTABI,
                functionName: 'mintCredential',
                args: [
                    formData.recipientWallet as `0x${string}`,
                    formData.skillName,
                    uri,
                    formData.isSoulbound,
                ],
            });

            alert('Credential minted successfully! The recipient now has a verified skill NFT.');
            setFormData({
                skillName: '',
                recipientWallet: '',
                description: '',
                isSoulbound: true,
            });
        } catch (error) {
            console.error('Error minting credential:', error);
            alert('Failed to mint credential. Make sure you are an authorized issuer.');
        } finally {
            setIsLoading(false);
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
                    <p className="text-xl text-gray-600">Issuer access required</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <FiAward className="text-white text-3xl" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Issuer Dashboard
                            </h1>
                            <p className="text-xl text-gray-600 mt-2">Issue verified skill credentials as NFTs</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <FiCheckCircle className="text-3xl text-green-600" />
                        </div>
                        <p className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {stats.totalIssued}
                        </p>
                        <p className="text-sm font-bold text-gray-600 mt-1">Total Issued</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <FiUser className="text-3xl text-indigo-600" />
                        </div>
                        <p className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {stats.activeRecipients}
                        </p>
                        <p className="text-sm font-bold text-gray-600 mt-1">Active Recipients</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <FiAward className="text-3xl text-purple-600" />
                        </div>
                        <p className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {stats.thisMonth}
                        </p>
                        <p className="text-sm font-bold text-gray-600 mt-1">This Month</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Issue Credential Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                            <h2 className="text-3xl font-black mb-6">Issue New Credential</h2>

                            <form onSubmit={handleMintCredential} className="space-y-6">
                                {/* Skill Name */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <FiAward className="text-indigo-600" />
                                        Skill Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g., Solidity Development"
                                        value={formData.skillName}
                                        onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                                    />
                                </div>

                                {/* Recipient Address */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <FiUser className="text-indigo-600" />
                                        Recipient Wallet Address *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="0x..."
                                        value={formData.recipientWallet}
                                        onChange={(e) => setFormData({ ...formData, recipientWallet: e.target.value })}
                                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-mono"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <FiFileText className="text-indigo-600" />
                                        Credential Description *
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="Describe what this credential represents and what was verified..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg resize-none"
                                    />
                                </div>

                                {/* Soulbound Toggle */}
                                <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100">
                                    <input
                                        type="checkbox"
                                        id="soulbound"
                                        checked={formData.isSoulbound}
                                        onChange={(e) => setFormData({ ...formData, isSoulbound: e.target.checked })}
                                        className="w-6 h-6 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor="soulbound" className="flex-1 cursor-pointer">
                                        <p className="font-bold text-gray-900">Make Soulbound (Non-transferable)</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Recommended: Prevents credential from being sold or transferred
                                        </p>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-black rounded-xl hover:shadow-2xl transition-all disabled:opacity-50 transform hover:-translate-y-1"
                                >
                                    {isLoading ? 'Minting Credential...' : 'Issue Credential NFT'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="md:col-span-1 space-y-6">
                        {/* How it Works */}
                        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-xl font-black mb-4">How It Works</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-indigo-600">
                                        1
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-bold">Verify Skills:</span> Assess the candidate's abilities
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-indigo-600">
                                        2
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-bold">Fill Details:</span> Enter skill and recipient info
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-indigo-600">
                                        3
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-bold">Issue NFT:</span> Mint credential on blockchain
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FiCheckCircle className="text-green-600" />
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-bold">Done!</span> Recipient gets verified credential
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-lg p-6 border-2 border-green-100">
                            <h3 className="text-xl font-black mb-4 text-green-900">Why NFT Credentials?</h3>
                            <ul className="space-y-3 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 font-bold">✓</span>
                                    <span><span className="font-bold">Immutable:</span> Can't be forged or altered</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 font-bold">✓</span>
                                    <span><span className="font-bold">Verifiable:</span> Anyone can verify authenticity</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 font-bold">✓</span>
                                    <span><span className="font-bold">Portable:</span> Owned by recipient forever</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 font-bold">✓</span>
                                    <span><span className="font-bold">Transparent:</span> On-chain proof of issuance</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
const { address } = useAccount();
const { writeContract } = useWriteContract();

const [formData, setFormData] = useState({
    skillName: '',
    recipientWallet: '',
    description: '',
    metadataFile: null as File | null,
});
const [isLoading, setIsLoading] = useState(false);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setFormData({ ...formData, metadataFile: e.target.files[0] });
    }
};

const handleMintCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        // Upload metadata to IPFS
        const metadata = {
            name: formData.skillName,
            description: formData.description,
            issuer: address,
            issuedAt: Date.now(),
        };

        const { uri, hash } = await uploadToIPFS(metadata);

        // Mint NFT
        await writeContract({
            address: SKILL_CREDENTIAL_NFT_ADDRESS as `0x${string}`,
            abi: skillCredentialNFTABI,
            functionName: 'mintCredential',
            args: [
                formData.recipientWallet as `0x${string}`,
                formData.skillName,
                uri,
                hash,
            ],
        });

        alert('Credential minted successfully!');
        setFormData({
            skillName: '',
            recipientWallet: '',
            description: '',
            metadataFile: null,
        });
    } catch (error) {
        console.error('Error minting credential:', error);
        alert('Failed to mint credential');
    } finally {
        setIsLoading(false);
    }
};

return (
    <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Issuer Dashboard</h1>

        {/* Mint Credential Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Mint Skill Credential</h2>
            <form onSubmit={handleMintCredential} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skill Name *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.skillName}
                        onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                        placeholder="e.g., Solidity Smart Contract Development"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recipient Wallet Address *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.recipientWallet}
                        onChange={(e) => setFormData({ ...formData, recipientWallet: e.target.value })}
                        placeholder="0x..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Credential description and details..."
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Metadata (Optional)
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".json,.pdf,.png,.jpg"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                >
                    {isLoading ? 'Minting...' : 'Mint Credential NFT'}
                </button>
            </form>
        </div>

        {/* Issued Credentials */}
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Issued Credentials</h2>
            <p className="text-gray-600">
                View all credentials you've issued (fetch from contract events)
            </p>
        </div>
    </div>
);
}
