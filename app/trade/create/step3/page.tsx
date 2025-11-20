"use client";

import { useEffect, useState } from "react";
import { StepHeader } from "@/components/trade/StepHeader";
import { Button } from "@/components/ui/button";
import { useTradeStore } from "@/store/tradeStore";
import { useRouter } from "next/navigation";

const DEFAULT_RPC = process.env.NEXT_PUBLIC_SUI_RPC || "https://fullnode.mainnet.sui.io:443";

async function fetchOwnedObjectsRPC(owner: string) {
  try {
    const res = await fetch(DEFAULT_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "sui_getOwnedObjects",
        params: [owner, { options: { showType: true, showDisplay: true, showContent: true } }],
      }),
    });
    const data = await res.json();
    return data.result?.data || data.result || [];
  } catch (e) {
    console.error("RPC error", e);
    return [];
  }
}

export default function Step3() {
  const router = useRouter();

  // Zustand actions
  const addRequestNFT = useTradeStore((s: any) => s.addRequestNFT);
  const addRequestToken = useTradeStore((s: any) => s.addRequestToken);
  const targetWallet = useTradeStore((s: any) => s.targetWallet);

  const [tab, setTab] = useState<"nft" | "token">("nft");
  const [targetNFTs, setTargetNFTs] = useState<any[]>([]);
  const [selectedNFTIds, setSelectedNFTIds] = useState<string[]>([]);
  const [tokenType, setTokenType] = useState("SUI");
  const [tokenAmount, setTokenAmount] = useState("");

  useEffect(() => {
    async function fetchTargetNFTs() {
      if (!targetWallet) return;
      try {
        const objs = await fetchOwnedObjectsRPC(targetWallet);
        const items = (objs || []).map((o: any) => {
          const data = o.data || o;
          const objId = data?.objectId || data?.reference?.objectId || data?.id?.objectId || data?.objectId;
          const content = data?.content?.data || data?.content || (data?.data && data.data.content);
          const display = (content && content.display) || data?.display || {};
          const type = content?.type || data?.type || "";
          const name = (display && display.name) || (type ? type.split("::").pop() : objId);
          const collection = (display && display.collection) || (type ? type.split("::").slice(0,2).join("::") : "");
          const image = (display && (display.url || display.image)) || "https://via.placeholder.com/80";
          return { id: objId, name, collection, image, raw: o };
        }).filter(Boolean);
        setTargetNFTs(items);
      } catch (e) {
        console.error("Error fetching target NFTs:", e);
      }
    }
    fetchTargetNFTs();
  }, [targetWallet]);

  function toggleNFT(nft: any) {
    const alreadySelected = selectedNFTIds.includes(nft.id);

    if (alreadySelected) {
      setSelectedNFTIds(selectedNFTIds.filter((id) => id !== nft.id));
    } else {
      setSelectedNFTIds([...selectedNFTIds, nft.id]);
      addRequestNFT(nft); // salva no global store
    }
  }

  function addToken() {
    if (!tokenAmount) return;

    addRequestToken({ type: tokenType, amount: Number(tokenAmount) });
    setTokenAmount("");
  }

  return (
    <div>
      <StepHeader step={3} title="What do you want to receive?" />

      <p className="text-gray-400 mb-6">
        Select NFTs or tokens you want to request in return. NFTs below are fetched from the target wallet address.
      </p>

  {/* TABS */}
  <div className="flex gap-4 mb-8">
    <button onClick={() => setTab("nft")} className={`px-4 py-2 rounded-lg text-sm ${tab === "nft" ? "bg-purple-600 text-white" : "bg-[#12172a] text-gray-300"}`}>
      NFTs
    </button>

    <button onClick={() => setTab("token")} className={`px-4 py-2 rounded-lg text-sm ${tab === "token" ? "bg-purple-600 text-white" : "bg-[#12172a] text-gray-300"}`}>
      Tokens
    </button>
  </div>

  {/* NFT TAB */}
  {tab === "nft" && (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      {!targetWallet && (
        <p className="text-yellow-300">Please set target wallet in Step 1 to load NFTs.</p>
      )}
      {targetNFTs.length === 0 && targetWallet && (
        <p className="text-gray-400">No NFTs found in the target wallet.</p>
      )}

      {targetNFTs.map((nft) => {
        const selected = selectedNFTIds.includes(nft.id);

        return (
          <div key={nft.id} onClick={() => toggleNFT(nft)} className={`flex flex-col items-start gap-2 p-4 rounded-xl cursor-pointer border ${selected ? "border-blue-400 bg-blue-400/10" : "border-white/10 bg-[#11172a]"}`}>
            <img src={nft.image} className="w-24 h-24 rounded-lg mb-2" />
            <div>
              <p className="font-bold">{nft.name}</p>
              <p className="text-sm text-gray-400">{nft.collection}</p>
            </div>
          </div>
        );
      })}
    </div>
  )}

  {/* TOKEN TAB */}
  {tab === "token" && (
    <div className="mb-10">
      <div className="flex gap-4 mb-4">
        <select value={tokenType} onChange={(e) => setTokenType(e.target.value)} className="p-3 rounded-lg bg-[#101528] border border-gray-700 text-white">
          <option value="SUI">SUI</option>
          <option value="USDC">USDC</option>
        </select>

        <input type="number" placeholder="Amount" value={tokenAmount} onChange={(e) => setTokenAmount(e.target.value)} className="p-3 rounded-lg bg-[#101528] border border-gray-700 text-white w-full" />

        <Button onClick={addToken} className="bg-purple-600 text-white px-4 py-2">Add</Button>
      </div>
    </div>
  )}

  {/* NEXT BUTTON */}
  <div className="flex justify-end mt-10">
    <Button onClick={() => router.push("/trade/create/step4")} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg">Next Step →</Button>
  </div>
</div>
  );
}
