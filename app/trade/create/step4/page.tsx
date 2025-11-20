"use client";

import { StepHeader } from "@/components/trade/StepHeader";
import { Button } from "@/components/ui/button";
import { useTradeStore } from "@/store/tradeStore";
import { useRouter } from "next/navigation";

export default function Step4() {
  const router = useRouter();

  // Zustand: pegar TODOS os dados preenchidos nos passos anteriores
  const {
    targetWallet,
    offeringNFTs,
    offeringTokens,
    requestingNFTs,
    requestingTokens
  } = useTradeStore((s: any) => s);

  function handleCreateRoom() {
    // Aqui depois colocaremos:
    // - assinatura
    // - envio para o contract
    // - criar room ID
    router.push("/trade/create/step5");
  }

  return (
    <div>
      <StepHeader step={4} title="Review Your Trade" />

      <p className="text-gray-400 mb-6">
        Review all details before creating your private trading room.
      </p>

      {/* TARGET WALLET */}
      <div className="p-4 mb-6 bg-[#141b33] rounded-xl border border-white/10">
        <p className="text-sm text-gray-300 mb-1">Target Wallet</p>
        <p className="font-mono text-lg text-white">
          {targetWallet || "No wallet selected"}
        </p>
      </div>

      {/* OFFERING */}
      <div className="p-4 mb-6 bg-[#141b33] rounded-xl border border-purple-500/20">
        <h3 className="font-bold text-lg mb-4 text-purple-300">You're Offering</h3>

        {offeringNFTs.length === 0 && offeringTokens.length === 0 && (
          <p className="text-gray-500 text-sm">No items added.</p>
        )}

        <div className="space-y-4">

          {/* NFTs */}
          {offeringNFTs.map((nft: any) => (
            <div key={nft.id} className="flex items-center gap-3">
              <img src={nft.image} className="w-12 h-12 rounded-md" />
              <div>
                <p>{nft.name}</p>
                <p className="text-gray-400 text-sm">{nft.collection}</p>
              </div>
            </div>
          ))}

          {/* TOKENS */}
          {offeringTokens.map((t: any, i: number) => (
            <p key={i} className="text-purple-300">
              {t.amount} {t.type}
            </p>
          ))}
        </div>
      </div>

      {/* REQUESTING */}
      <div className="p-4 mb-6 bg-[#141b33] rounded-xl border border-blue-500/20">
        <h3 className="font-bold text-lg mb-4 text-blue-300">You're Requesting</h3>

        {requestingNFTs.length === 0 && requestingTokens.length === 0 && (
          <p className="text-gray-500 text-sm">No items requested.</p>
        )}

        <div className="space-y-4">

          {/* NFTs */}
          {requestingNFTs.map((nft: any) => (
            <div key={nft.id} className="flex items-center gap-3">
              <img src={nft.image} className="w-12 h-12 rounded-md" />
              <div>
                <p>{nft.name}</p>
                <p className="text-gray-400 text-sm">{nft.collection}</p>
              </div>
            </div>
          ))}

          {/* Tokens */}
          {requestingTokens.map((t: any, i: number) => (
            <p key={i} className="text-blue-300">
              {t.amount} {t.type}
            </p>
          ))}
        </div>
      </div>

      {/* INFO WARNING */}
      <div className="p-4 mb-6 bg-[#101528] rounded-xl border border-yellow-500/20">
        <p className="text-gray-300 mb-2">Please note:</p>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>• All assets will be temporarily locked into the contract.</li>
          <li>• A 1 SUI fee will be charged upon room creation.</li>
          <li>• If the trade is canceled, assets return to the owners.</li>
        </ul>
      </div>

      {/* CREATE ROOM */}
      <div className="flex justify-end">
        <Button
          onClick={handleCreateRoom}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl shadow-lg"
        >
          Create Room & Sign →
        </Button>
      </div>
    </div>
  );
}
