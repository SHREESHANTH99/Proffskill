"use client";

import { useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";

interface ENSDisplayProps {
  address: `0x${string}`;
  showFull?: boolean;
  className?: string;
}

export default function ENSDisplay({
  address,
  showFull = false,
  className = "",
}: ENSDisplayProps) {
  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
  });

  const formatAddress = (addr: string) => {
    if (showFull) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <span className={className}>
      {ensName || formatAddress(address)}
    </span>
  );
}
