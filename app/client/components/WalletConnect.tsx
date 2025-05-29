import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useWallet } from "../contexts/WalletContext";

export const WalletConnect: React.FC = () => {
  const {
    walletAddress,
    isConnected,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    tokenBalance,
  } = useWallet();

  React.useEffect(() => {
    if (isConnected && walletAddress) {
      refreshBalance();
    }
  }, [isConnected, refreshBalance, walletAddress]);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return (
    <View style={styles.container}>
      {!isConnected ? (
        <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
          <Text style={styles.buttonText}>Connect Wallet</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.walletInfo}>
          <Text style={styles.address}>
            {`${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)}`}
          </Text>
          <Text style={styles.balance}>Balance: {tokenBalance} GWC</Text>
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={handleDisconnect}
          >
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  connectButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  disconnectButton: {
    backgroundColor: "#f44336",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  walletInfo: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
  },
  address: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  balance: {
    fontSize: 14,
    color: "#666",
  },
});
