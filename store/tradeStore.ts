import { create } from "zustand";

// =======================
// TYPES
// =======================

export interface NFT {
  id: string;
  name: string;
  collection: string;
  image: string;
}

export interface TokenOffer {
  type: string;
  amount: number;
}

export interface TradeRoom {
  id: string;
  targetWallet: string;

  offeringNFTs: NFT[];
  offeringTokens: TokenOffer[];

  requestingNFTs: NFT[];
  requestingTokens: TokenOffer[];

  status: "active" | "requested";
  createdAt: number;
}

// =======================
// STORE INTERFACE
// =======================

interface TradeState {
  targetWallet: string;
  setTargetWallet: (addr: string) => void;

  offeringNFTs: NFT[];
  offeringTokens: TokenOffer[];
  addOfferNFT: (nft: NFT) => void;
  addOfferToken: (token: TokenOffer) => void;

  requestingNFTs: NFT[];
  requestingTokens: TokenOffer[];
  addRequestNFT: (nft: NFT) => void;
  addRequestToken: (token: TokenOffer) => void;

  rooms: TradeRoom[];
  addRoom: (room: TradeRoom) => void;

  resetTrade: () => void;
}

// =======================
// STORE IMPLEMENTATION
// =======================

export const useTradeStore = create<TradeState>((set) => ({
  targetWallet: "",
  setTargetWallet: (addr: string) => set({ targetWallet: addr }),

  offeringNFTs: [],
  offeringTokens: [],

  addOfferNFT: (nft: NFT) =>
    set((state: TradeState) => ({
      offeringNFTs: [...state.offeringNFTs, nft],
    })),

  addOfferToken: (token: TokenOffer) =>
    set((state: TradeState) => ({
      offeringTokens: [...state.offeringTokens, token],
    })),

  requestingNFTs: [],
  requestingTokens: [],

  addRequestNFT: (nft: NFT) =>
    set((state: TradeState) => ({
      requestingNFTs: [...state.requestingNFTs, nft],
    })),

  addRequestToken: (token: TokenOffer) =>
    set((state: TradeState) => ({
      requestingTokens: [...state.requestingTokens, token],
    })),

  rooms: [],

  addRoom: (room: TradeRoom) =>
    set((state: TradeState) => ({
      rooms: [...state.rooms, room],
    })),

  resetTrade: () =>
    set({
      targetWallet: "",
      offeringNFTs: [],
      offeringTokens: [],
      requestingNFTs: [],
      requestingTokens: [],
    }),
}));
