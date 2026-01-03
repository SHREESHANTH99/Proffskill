'use client';

import { useAutoConnect } from '@/hooks/useWallet';

export default function AutoConnectWrapper({ children }: { children: React.ReactNode }) {
    useAutoConnect();
    return <>{children}</>;
}
