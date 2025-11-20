"use client";

import { useEffect, useState } from "react";
import { StepHeader } from "@/components/trade/StepHeader";
import { Button } from "@/components/ui/button";
import { useTradeStore } from "@/store/tradeStore";
import { useRouter } from "next/navigation";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

const client = new SuiClient({ url: getFullnodeUrl("mainnet") });

async function fetchOwnedObjectsRPC(owner: string) {
  try {
    const res = await client.getOwnedObjects({
      owner,
      options: { showContent: true, showType: true, showDisplay: true },
    });
    return res?.data || [];
  } catch (e) {
    console.error("RPC error", e);
    return [];
  }
}

export default function Step3() {
  const router = useRouter();

  const addRequestNFT = useTradeStore((s: any) => s.addRequestNFT);
  const addRequestToken = useTradeStore((s: any) => s.addRequestToken);
  const targetWallet = useTradeStore((s: any) => s.targetWallet);

  const [tab, setTab] = useState<"nft" | "token">("nft");
  const [groupedNFTs, setGroupedNFTs] = useState<any>({});
  const [selectedNFTIds, setSelectedNFTIds] = useState<string[]>([]);
  const [tokenType, setTokenType] = useState("SUI");
  const [tokenAmount, setTokenAmount] = useState("");

  useEffect(() => {
async function load() {
  if (!targetWallet) return;

  const objs = await fetchOwnedObjectsRPC(targetWallet);

  // 1. Encontre o KioskOwnerCap
  const kioskCaps = objs
    .map((o) => o.data)
    .filter((d) => d?.type?.includes("KioskOwnerCap"));

  if (kioskCaps.length === 0) {
    setGroupedNFTs({});
    return;
  }

  // kioskId = onde as NFTs realmente ficam
  const kioskId = kioskCaps[0].fields.for;

  // 2. Listar todos os itens dentro do kiosk
  const dynamicFields = await client.getDynamicFields({ parentId: kioskId });

  const nftList: any[] = [];

  for (const field of dynamicFields.data) {
    const obj = await client.getObject({
      id: field.objectId,
      options: { showContent: true, showDisplay: true }
    });

    const disp = obj.data?.display?.data || {};
    const type = obj.data?.content?.type || "";

    // ignorar coins
    if (type.startsWith("0x2::coin")) continue;

    nftList.push({
      id: field.objectId,
      name: disp.name || type.split("::").pop(),
      image:
        disp.image_url ||
        disp.image ||
        "https://placehold.co/200x200?text=NFT",
      collection: disp.collection || type.split("::")[1]
    });
  }

  // 3. Agrupar por coleção
  const grouped: any = {};
  for (const nft of nftList) {
    if (!grouped[nft.collection]) grouped[nft.collection] = [];
    grouped[nft.collection].push(nft);
  }

  setGroupedNFTs(grouped);
}


    load();
  }, [targetWallet]);

  function toggleNFT(nft: any) {
    if (selectedNFTIds.includes(nft.id)) {
      setSelectedNFTIds(selectedNFTIds.filter((id) => id !== nft.id));
    } else {
      setSelectedNFTIds([...selectedNFTIds, nft.id]);
      addRequestNFT(nft);
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
        Select NFTs or tokens you want to request in return.
      </p>

      {/* TABS */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setTab("nft")}
          className={`px-4 py-2 rounded-lg text-sm ${
            tab === "nft"
              ? "bg-purple-600 text-white"
              : "bg-[#12172a] text-gray-300"
          }`}
        >
          NFTs
        </button>

        <button
          onClick={() => setTab("token")}
          className={`px-4 py-2 rounded-lg text-sm ${
            tab === "token"
              ? "bg-purple-600 text-white"
              : "bg-[#12172a] text-gray-300"
          }`}
        >
          Tokens
        </button>
      </div>

      {/* NFT TAB */}
      {tab === "nft" && (
        <div className="space-y-10 mb-10">
          {/* Sem NFTs */}
          {Object.keys(groupedNFTs).length === 0 && (
            <p className="text-gray-400">
              No NFTs found in this wallet. Only coins detected.
            </p>
          )}

          {Object.keys(groupedNFTs).map((collection) => (
            <div key={collection}>
              <h2 className="text-xl font-semibold text-purple-300 mb-3">
                {collection}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {groupedNFTs[collection].map((nft: any) => {
                  const selected = selectedNFTIds.includes(nft.id);

                  return (
                    <div
                      key={nft.id}
                      onClick={() => toggleNFT(nft)}
                      className={`p-4 rounded-xl border cursor-pointer ${
                        selected
                          ? "border-blue-400 bg-blue-400/20"
                          : "border-white/10 bg-[#11172a]"
                      }`}
                    >
                      <img
                        src={nft.image}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/200x200?text=NFT";
                        }}
                      />
                      <p className="font-bold">{nft.name}</p>
                      <p className="text-sm text-gray-400">{collection}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TOKEN TAB */}
      {tab === "token" && (
        <div className="mb-10">
          <div className="flex gap-4 mb-4">
            <select
              value={tokenType}
              onChange={(e) => setTokenType(e.target.value)}
              className="p-3 rounded-lg bg-[#101528] border border-gray-700 text-white"
            >
              <option value="SUI">SUI</option>
              <option value="USDC">USDC</option>
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              className="p-3 rounded-lg bg-[#101528] border border-gray-700 text-white w-full"
            />

            <Button
              onClick={addToken}
              className="bg-purple-600 text-white px-4 py-2"
            >
              Add
            </Button>
          </div>
        </div>
      )}

      {/* NEXT BUTTON */}
      <div className="flex justify-end mt-10">
        <Button
          onClick={() => router.push("/trade/create/step4")}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg"
        >
          Next Step →
        </Button>
      </div>
    </div>
  );
}
