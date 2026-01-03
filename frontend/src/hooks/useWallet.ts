"use client";

import { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

/**
 * Hook to automatically connect to previously connected wallet
 */
export function useAutoConnect() {
  const { isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    // Only attempt auto-connect if not already connected or connecting
    if (isConnected || isConnecting) return;

    // Check if user has previously connected
    const hasConnectedBefore =
      typeof window !== "undefined" &&
      localStorage.getItem("wagmi.connected") === "true";

    if (!hasConnectedBefore) return;

    // Check if MetaMask or injected provider is available
    const injectedConnector = connectors.find(
      (connector) =>
        connector.id === "injected" ||
        connector.name.toLowerCase().includes("metamask")
    );

    if (injectedConnector) {
      // Attempt to reconnect
      connect({ connector: injectedConnector });
    }
  }, [isConnected, isConnecting, connect, connectors]);
}

/**
 * Hook to detect if MetaMask is installed
 */
export function useMetaMaskDetection() {
  const isMetaMaskInstalled =
    typeof window !== "undefined" &&
    typeof window.ethereum !== "undefined" &&
    (window.ethereum.isMetaMask === true ||
      window.ethereum.providers?.some((p: any) => p.isMetaMask));

  return { isMetaMaskInstalled };
}
