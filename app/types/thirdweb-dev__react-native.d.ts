declare module "@thirdweb-dev/react-native" {
  interface Contract {
    address: string;
    filters: {
      Transfer: (
        from: string | null,
        to: string
      ) => { args: { tokenId: string } };
    };
    tokenURI: (tokenId: string) => Promise<string>;
    listings: (
      tokenId: string
    ) => Promise<{ isActive: boolean; price: string; seller: string }>;
    queryFilter: (filter: {
      args: { tokenId: string };
    }) => Promise<Array<{ args: { tokenId: string } }>>;
  }

  export function useContract(address: string): { contract: Contract };
  export function useContractWrite(
    contract: Contract,
    functionName: string
  ): { mutateAsync: (args: { args: unknown[] }) => Promise<unknown> };
}
