import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { Alert, Linking, AppState, AppStateStatus } from "react-native";
import { Transaction } from "ethers";
import { SignClient } from "@walletconnect/sign-client";
import { SessionTypes } from "@walletconnect/types";
import {
  NetInfoState,
  NetInfoSubscription,
} from "@react-native-community/netinfo";
import { updateUserWalletAddress } from "@/server/services/user";
import NetInfo from "@react-native-community/netinfo";
import { getTokenBalance } from "@/server/services/tokens";
import { supabase } from "@/lib/supabase";

// @ts-ignore
global.NetInfo = {
  fetch: () => NetInfo.fetch(),
  addEventListener: (callback: (state: NetInfoState) => void) =>
    NetInfo.addEventListener(callback),
  removeEventListener: (_subscription: NetInfoSubscription) => {
    return;
  },
};

interface WalletContextType {
  walletAddress: string | null;
  tokenBalance: string;
  isConnecting: boolean;
  isConnected: boolean;
  transactions: Transaction[];

  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshBalance: () => Promise<void>;
  addTransaction: (transaction: Transaction) => void;
  setWalletAddress: (address: string) => void;

  getShortAddress: () => string;
  isValidAddress: (address: string) => boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const projectId = process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

if (!projectId) {
  console.error(
    "WalletConnect Project ID is not set. Please add EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID to your .env file"
  );
}

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [isConnecting, setIsConnecting] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [signClient, setSignClient] = useState<InstanceType<
    typeof SignClient
  > | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const connectWalletRef = useRef<(() => Promise<void>) | null>(null);
  const pendingProposalRef = useRef<
    (() => Promise<SessionTypes.Struct>) | null
  >(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isConnected = !!walletAddress;

  const isValidAddress = useCallback((address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }, []);

  const getShortAddressFromString = useCallback((address: string): string => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!walletAddress) return;

    try {
      console.log("🔄 Refreshing balance for:", walletAddress);

      const newBalance = await getTokenBalance(walletAddress);
      setTokenBalance(newBalance);
      console.log("✅ Balance refreshed:", newBalance);
    } catch (error) {
      console.error("❌ Error refreshing balance:", error);
      Alert.alert("Error", "Failed to refresh balance");
    }
  }, [walletAddress]);

  useEffect(() => {
    const initClient = async () => {
      if (!projectId) {
        console.error("Cannot initialize WalletConnect: Project ID is missing");
        return;
      }

      try {
        const client = await SignClient.init({
          projectId,
          metadata: {
            name: "Gym World",
            description: "Gym World - Your Fitness Journey on Blockchain",
            url: "https://gymworld.app",
            icons: ["https://gymworld.app/icon.png"],
          },
          relayUrl: "wss://relay.walletconnect.com",
          logger: "silent",
        });

        const originalConsoleError = console.error;
        console.error = (...args) => {
          if (
            typeof args[0] === "string" &&
            (args[0].includes("No matching key") ||
              args[0].includes("Pending session not found"))
          ) {
            return;
          }
          originalConsoleError.apply(console, args);
        };

        setSignClient(client);
        if (walletAddress) {
          await refreshBalance();
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing WalletConnect:", error);
        Alert.alert(
          "Connection Error",
          "Failed to initialize wallet connection. Please try again."
        );
      }
    };

    initClient();
  }, [walletAddress, refreshBalance]);

  const connectWallet = useCallback(async () => {
    if (!isInitialized || !signClient) {
      Alert.alert(
        "Connection Error",
        "Wallet connection is not ready. Please try again."
      );
      return;
    }

    try {
      setIsConnecting(true);

      // Clean up any existing sessions silently
      const sessions = signClient.session.getAll();
      for (const session of sessions) {
        try {
          await signClient.disconnect({
            topic: session.topic,
            reason: { code: 6000, message: "Starting new connection" },
          });
        } catch {
          // Silently ignore cleanup errors
        }
      }

      const { uri, approval } = await signClient.connect({
        requiredNamespaces: {
          eip155: {
            methods: ["eth_requestAccounts", "eth_sendTransaction"],
            chains: ["eip155:1"],
            events: ["chainChanged", "accountsChanged"],
          },
        },
        pairingTopic: undefined,
      });

      pendingProposalRef.current = approval;

      connectionTimeoutRef.current = setTimeout(() => {
        if (pendingProposalRef.current) {
          pendingProposalRef.current = null;
          setIsConnecting(false);
        }
      }, 30000);

      if (uri) {
        await Linking.openURL(uri);
      }

      try {
        const session = await approval();

        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }
        pendingProposalRef.current = null;

        const accounts = Object.values(session.namespaces)
          .flat()
          .map((namespace: unknown) => {
            const n = namespace as { accounts: string[] };
            return n.accounts;
          })
          .flat();

        if (accounts && accounts.length > 0) {
          const address = accounts[0].split(":")[2];
          setWalletAddress(address);
          setTokenBalance("0");
          setIsConnecting(false);

          Alert.alert(
            "Success! 🎉",
            `Wallet connected successfully!\n\n${getShortAddressFromString(
              address
            )}`,
            [{ text: "OK", onPress: () => refreshBalance() }]
          );

          // Update user metadata to indicate wallet is connected
          try {
            const { error } = await supabase.auth.updateUser({
              data: { wallet_connected: true },
            });
            if (error) {
              console.error("Error updating user metadata:", error);
            }
          } catch (error) {
            console.error("Error updating user metadata:", error);
          }

          await updateUserWalletAddress(address);
          await refreshBalance();
        }
      } catch {
        // Silently ignore approval errors
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }
        pendingProposalRef.current = null;
        setIsConnecting(false);
      }
    } catch {
      // Silently ignore all other errors
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      pendingProposalRef.current = null;
      setIsConnecting(false);
    }
  }, [signClient, getShortAddressFromString, refreshBalance, isInitialized]);

  const disconnectWallet = async () => {
    if (signClient) {
      const sessions = signClient.session.getAll();
      for (const session of sessions) {
        await signClient.disconnect({
          topic: session.topic,
          reason: { code: 6000, message: "User disconnected" },
        });
      }
    }
    setWalletAddress(null);
    setTokenBalance("0");
    setTransactions([]);

    try {
      // Clear the wallet address from user's profile
      await updateUserWalletAddress(null);
    } catch (error) {
      console.error("Error clearing wallet address:", error);
    }
  };

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState: AppStateStatus) => {
        if (nextAppState === "background" || nextAppState === "inactive") {
          // Clean up any pending proposals and timeouts silently
          if (pendingProposalRef.current) {
            pendingProposalRef.current = null;
          }

          if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
            connectionTimeoutRef.current = null;
          }

          // Disconnect any active sessions silently
          if (signClient) {
            try {
              const sessions = signClient.session.getAll();
              for (const session of sessions) {
                try {
                  await signClient.disconnect({
                    topic: session.topic,
                    reason: { code: 6000, message: "App went to background" },
                  });
                } catch {
                  // Silently ignore disconnect errors
                }
              }
            } catch {
              // Silently ignore cleanup errors
            }
          }
        } else if (nextAppState === "active") {
          // Reinitialize the client when app becomes active
          if (signClient) {
            try {
              await signClient.core.relayer.restartTransport();
            } catch {
              // Silently ignore transport errors
            }
          }
        }
      }
    );

    return () => {
      subscription.remove();
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, [signClient]);

  useEffect(() => {
    connectWalletRef.current = connectWallet;
  }, [connectWallet]);

  const addTransaction = (transaction: Transaction) => {
    const newTransactions = [transaction, ...transactions];
    setTransactions(newTransactions);
    console.log("📝 Transaction added:", transaction.hash);
  };

  const getShortAddress = (): string => {
    if (!walletAddress) return "";
    return getShortAddressFromString(walletAddress);
  };

  const contextValue: WalletContextType = {
    walletAddress,
    tokenBalance,
    isConnecting,
    isConnected,
    transactions,

    connectWallet,
    disconnectWallet,
    refreshBalance,
    addTransaction,
    setWalletAddress,

    getShortAddress,
    isValidAddress,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export type { Transaction, WalletContextType };
