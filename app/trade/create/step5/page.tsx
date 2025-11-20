"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTradeStore } from "@/store/tradeStore";
import { StepHeader } from "@/components/trade/StepHeader";
import { Button } from "@/components/ui/button";
import { useWalletKit } from "@mysten/wallet-kit";

export default function Step5() {
  const router = useRouter();

  const {
    targetWallet,
    offeringNFTs,
    offeringTokens,
    requestingNFTs,
    requestingTokens,
    addRoom,
    resetTrade
  } = useTradeStore((s: any) => s);

  const { currentAccount, signAndExecuteTransaction } = useWalletKit();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateRoom() {
    setLoading(true);
    setError(null);

    try {
      // If a contract is configured, attempt on-chain create
      const contract = process.env.NEXT_PUBLIC_TRADE_CONTRACT;
      let txResult = null;

      if (contract && signAndExecuteTransaction) {
        // Example move call payload - adapt for your contract's API
        const tx = {
          kind: "moveCall",
          data: {
            packageObjectId: contract,
            module: "trade",
            function: "create_room",
            arguments: [
              targetWallet || "",
              JSON.stringify({ offeringNFTs, offeringTokens, requestingNFTs, requestingTokens }),
            ],
            typeArguments: [],
            gasBudget: 30000,
          },
        };
        txResult = await signAndExecuteTransaction({ transaction: tx });
      }

      // Always create room off-chain as fallback
      const roomId = Math.random().toString(36).substring(2, 10);
      const isCreator = !!currentAccount?.address;

      addRoom({
        id: roomId,
        targetWallet,
        offeringNFTs,
        offeringTokens,
        requestingNFTs,
        requestingTokens,
        status: isCreator ? "active" : "requested",
        createdAt: Date.now(),
      });

      resetTrade();

      setTimeout(() => {
        router.push("/trade/rooms/active");
      }, 800);
    } catch (e: any) {
      console.error("create room error", e);
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-center mt-20 text-white">
      <StepHeader step={5} title="Create Room & Sign" />

      <p className="text-gray-400 mb-6">
        Review and confirm the creation of the private trading room. If a contract is configured, the transaction will be signed.
      </p>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <div className="mb-6">
        <p className="text-sm text-gray-300">Target Wallet</p>
        <p className="font-mono">{targetWallet || "No wallet selected"}</p>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={handleCreateRoom} className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3" disabled={loading}>
          {loading ? "Processing..." : "Create Room & Sign"}
        </Button>

        <Button onClick={() => router.push("/trade/create/step4")} className="bg-gray-700 px-6 py-3">
          Back
        </Button>
      </div>
    </div>
  );
}
