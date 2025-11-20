"use client";

import { useEffect, useState } from "react";
import { fetchNftsServer } from "@/app/actions/fetchNfts";
import { useWalletStore } from "@/store/walletStore";
import { useTradeStore } from "@/store/tradeStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Step2Page() {
  const wallet = useWalletStore((s: any) => s.address);
  const addOfferingNFT = useTradeStore((s: any) => s.addOfferingNFT);
  const offeringNFTs = useTradeStore((s: any) => s.offeringNFTs);

  const [loading, setLoading] = useState(false);
  const [nfts, setNfts] = useState<any[]>([]);

  useEffect(() => {
    if (!wallet) return;

    async function load() {
      setLoading(true);
      const result = await fetchNftsServer(wallet);
      setNfts(result);
      setLoading(false);
    }

    load();
  }, [wallet]);

  return (
    <div className="max-w-5xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold mb-4">What do you want to offer?</h1>
      
      {loading && <p className="text-gray-400">Loading NFTs...</p>}

      {nfts.length === 0 && !loading && (
        <p className="text-gray-400">No NFTs found in your wallet.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {nfts.map((nft) => (
          <div
            key={nft.id}
            onClick={() => addOfferingNFT(nft)}
            className="cursor-pointer bg-[#11172a] border border-white/10 p-4 rounded-xl hover:border-purple-400"
          >
            <img src={nft.image} className="w-full h-32 object-cover rounded mb-2" />
            <p className="font-bold">{nft.name}</p>
            <p className="text-sm text-gray-400">{nft.collection}</p>
          </div>
        ))}
      </div>

      <Link href="/trade/create/step3">
        <Button className="bg-gradient-to-r from-cyan-500 to-purple-500">
          Next Step →
        </Button>
      </Link>
    </div>
  );
}
