"use client";

import { useParams, useRouter } from "next/navigation";
import { useTradeStore } from "@/store/tradeStore";
import { Button } from "@/components/ui/button";

export default function CancelTradePage() {
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

  const handleCancel = () => {
    updateRoomStatus(room.id, "cancelled");
    router.push("/trade/rooms/active");
  };

  return (
    <div className="max-w-4xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Confirm Cancel Room</h1>

      <div className="bg-[#141b33] p-6 rounded-xl border border-white/10 mb-10">
        <p className="text-sm text-gray-400">Room ID</p>
        <p className="font-mono mb-4">{room.id}</p>

        <p className="text-sm text-gray-400">Target Wallet</p>
        <p className="font-mono break-all mb-4">{room.targetWallet}</p>
      </div>

      <h2 className="text-xl font-bold mb-4">This action cannot be undone.</h2>

      <div className="flex gap-4 mt-10">
        <Button className="bg-gray-600" onClick={() => router.back()}>
          Go Back
        </Button>

        <Button className="bg-red-600" onClick={handleCancel}>
          Yes, Cancel Room
        </Button>
      </div>
    </div>
  );
}
