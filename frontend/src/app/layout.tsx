import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/layout/Header';
import AutoConnectWrapper from '@/components/AutoConnectWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'ProofSkill - Verified Skill Credentials & Marketplace',
    description: 'Self-sovereign identity, trustless verification, and on-chain reputation for skilled professionals',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <AutoConnectWrapper>
                        <Header />
                        <main className="min-h-screen">
                            {children}
                        </main>
                    </AutoConnectWrapper>
                </Providers>
            </body>
        </html>
    );
}
