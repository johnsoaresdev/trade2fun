"use client";

import { useParams, useRouter } from "next/navigation";
import { useTradeStore } from "@/store/tradeStore";
import { Button } from "@/components/ui/button";

export default function RoomDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  // pegar rooms e ação de update
  const rooms = useTradeStore((s: any) => s.rooms);
  const updateRoomStatus = useTradeStore((s: any) => s.updateRoomStatus);

  // encontrar a sala atual
  const room = rooms.find((r: any) => r.id === id);

  // caso a sala não exista
  if (!room) {
    return (
      <div className="py-20 text-center text-white max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Room not found</h1>
        <Button onClick={() => router.push("/trade/rooms/active")}>
          Back to Active Rooms
        </Button>
      </div>
    );
  }

  // ação quando aceita
  async function handleAccept() {
    // simulação de assinatura
    const signed = confirm("Deseja aceitar esta trade? Será necessário assinar com a carteira.");
    if (!signed) return;

    // atualizar status
    updateRoomStatus(room.id, "accepted");

    // redirecionar para tela de confirmação
    router.push(`/trade/rooms/${room.id}/accept`);
  }

  // ação quando cancela
  async function handleCancel() {
    const cancel = confirm("Tem certeza que deseja cancelar?");
    if (!cancel) return;

    updateRoomStatus(room.id, "cancelled");

    router.push(`/trade/rooms/${room.id}/cancel`);
  }

  return (
    <div className="max-w-5xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold mb-8">Trade Room Details</h1>

      {/* HEADER */}
      <div className="bg-[#141b33] border border-white/10 p-6 rounded-xl mb-10 shadow-sm">
        <p className="text-sm text-gray-400">Room ID</p>
        <p className="font-mono mb-4">{room.id}</p>

        <p className="text-sm text-gray-400">Target Wallet</p>
        <p className="font-mono break-all mb-4">{room.targetWallet}</p>

        <span
          className={`
            px-3 py-1 rounded-lg text-xs
            ${
              room.status === "active"
                ? "bg-green-500/20 text-green-400"
                : room.status === "requested"
                ? "bg-yellow-500/20 text-yellow-400"
                : room.status === "accepted"
                ? "bg-blue-500/20 text-blue-400"
                : room.status === "cancelled"
                ? "bg-red-500/20 text-red-400"
                : "bg-gray-500/20 text-gray-400"
            }
          `}
        >
          {room.status.toUpperCase()}
        </span>
      </div>

      {/* OFFERING */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">You're Offering</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {room.offeringNFTs.length === 0 &&
            room.offeringTokens.length === 0 && (
              <p className="text-gray-400 col-span-full">Nothing offered.</p>
            )}

          {room.offeringNFTs.map((nft: any) => (
            <div
              key={nft.id}
              className="bg-[#11172a] border border-white/10 p-4 rounded-xl"
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="w-20 h-20 rounded-lg mb-2 object-cover"
              />
              <p className="font-bold">{nft.name}</p>
              <p className="text-sm text-gray-400">{nft.collection}</p>
            </div>
          ))}

          {room.offeringTokens.map((token: any, i: number) => (
            <div
              key={i}
              className="bg-[#11172a] border border-white/10 p-4 rounded-xl"
            >
              <p className="font-bold">{token.amount}</p>
              <p className="text-gray-400 text-sm">{token.type}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REQUESTING */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">You're Requesting</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {room.requestingNFTs.length === 0 &&
            room.requestingTokens.length === 0 && (
              <p className="text-gray-400 col-span-full">Nothing requested.</p>
            )}

          {room.requestingNFTs.map((nft: any) => (
            <div
              key={nft.id}
              className="bg-[#11172a] border border-white/10 p-4 rounded-xl"
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="w-20 h-20 rounded-lg mb-2 object-cover"
              />
              <p className="font-bold">{nft.name}</p>
              <p className="text-sm text-gray-400">{nft.collection}</p>
            </div>
          ))}

          {room.requestingTokens.map((token: any, i: number) => (
            <div
              key={i}
              className="bg-[#11172a] border border-white/10 p-4 rounded-xl"
            >
              <p className="font-bold">{token.amount}</p>
              <p className="text-gray-400 text-sm">{token.type}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <Button className="bg-red-600" onClick={handleCancel}>
          Cancel Room
        </Button>

        <Button className="bg-green-600" onClick={handleAccept}>
          Accept Trade
        </Button>
      </div>
    </div>
  );
}
