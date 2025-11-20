"use client";

import { useTradeStore } from "@/store/tradeStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ActiveRoomsPage() {
  const rooms = useTradeStore((s: any) => s.rooms);

  const activeRooms = rooms.filter((room: any) => room.status === "active");

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">My Active Rooms</h1>

      {/* BUTTON: Create New Room */}
      <div className="mb-6">
        <Link href="/trade/create/step1">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg">
            + Create New Trade
          </Button>
        </Link>
      </div>

      {/* Empty State */}
      {activeRooms.length === 0 && (
        <div className="bg-[#13182b] border border-white/10 p-10 rounded-xl text-center">
          <p className="text-gray-400 mb-2">You have no active rooms yet.</p>
          <p className="text-gray-500 text-sm mb-6">
            Create your first private trade room.
          </p>

          <Link href="/trade/create/step1">
            <Button className="bg-blue-600 px-4 py-2 rounded-lg">
              Create Trade
            </Button>
          </Link>
        </div>
      )}

      {/* Active Rooms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeRooms.map((room: any) => (
          <div
            key={room.id}
            className="bg-[#141b33] border border-white/10 p-6 rounded-xl shadow-sm hover:shadow-lg transition"
          >
            <p className="text-sm text-gray-400 mb-1">Room ID</p>
            <p className="font-mono text-sm mb-4">{room.id}</p>

            <div className="mb-4">
              <p className="text-sm text-gray-400">Target Wallet</p>
              <p className="font-mono break-all">
                {room.targetWallet}
              </p>
            </div>

            {/* Status */}
            <div className="mb-4">
              <span
                className={`px-3 py-1 rounded-lg text-xs ${
                  room.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {room.status.toUpperCase()}
              </span>
            </div>

            {/* Action Button */}
            <Link href={`/trade/rooms/${room.id}`}>
              <Button className="bg-blue-600 px-4 py-2 rounded-lg w-full">
                View Room
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
