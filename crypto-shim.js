import "react-native-get-random-values";
import { sha256 } from "js-sha256";
import { Buffer } from "buffer";

// Simple crypto implementation
const crypto = {
  getRandomValues: (array) => {
    // Use the polyfilled crypto.getRandomValues
    return global.crypto.getRandomValues(array);
  },

  randomBytes: (size) => {
    const array = new Uint8Array(size);
    global.crypto.getRandomValues(array);
    return Buffer.from(array);
  },

  createHash: (algorithm) => {
    if (algorithm === "sha256") {
      return {
        update: (data) => {
          return {
            digest: (encoding) => {
              const hash = sha256(data);
              return encoding === "hex" ? hash : Buffer.from(hash, "hex");
            },
          };
        },
      };
    }
    throw new Error(`Hash algorithm ${algorithm} not supported`);
  },
};

// Set up global crypto
global.crypto = { ...global.crypto, ...crypto };

// Create a simple module export for require() calls
global.__crypto_shim = crypto;
