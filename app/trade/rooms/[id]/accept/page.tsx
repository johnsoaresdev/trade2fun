"use client";

import { useParams, useRouter } from "next/navigation";
import { useTradeStore } from "@/store/tradeStore";
import { Button } from "@/components/ui/button";

export default function AcceptTradePage() {
  const { id } = useParams();
  const router = useRouter();

  const rooms = useTradeStore((s: any) => s.rooms);
  const updateRoomStatus = useTradeStore((s: any) => s.updateRoomStatus);

  const room = rooms.find((r: any) => r.id === id);

  if (!room) {
    return (
      <div className="text-white">Room not found.</div>
    );
  }

  const handleAccept = () => {
    updateRoomStatus(room.id, "completed");
    router.push("/trade/rooms/active");
  };

  return (
    <div className="max-w-4xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Confirm Accept Trade</h1>

      <div className="bg-[#141b33] p-6 rounded-xl border border-white/10 mb-10">
        <p className="text-sm text-gray-400">Room ID</p>
        <p className="font-mono mb-4">{room.id}</p>

        <p className="text-sm text-gray-400">Target Wallet</p>
        <p className="font-mono break-all mb-4">{room.targetWallet}</p>
      </div>

      <h2 className="text-xl font-bold mb-4">What You Will Send</h2>
      <p className="text-gray-400 mb-6">
        {room.offeringNFTs.length === 0 && room.offeringTokens.length === 0
          ? "Nothing offered."
          : ""}
      </p>

      <h2 className="text-xl font-bold mb-4">What You Will Receive</h2>
      <p className="text-gray-400 mb-6">
        {room.requestingNFTs.length === 0 && room.requestingTokens.length === 0
          ? "Nothing requested."
          : ""}
      </p>

      <div className="flex gap-4 mt-10">
        <Button className="bg-gray-600" onClick={() => router.back()}>
          Go Back
        </Button>

        <Button className="bg-green-600" onClick={handleAccept}>
          Confirm & Accept Trade
        </Button>
      </div>
    </div>
  );
}
