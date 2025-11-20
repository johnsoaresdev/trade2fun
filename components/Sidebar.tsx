"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWalletKit } from "@mysten/wallet-kit";

export default function Sidebar() {
  const pathname = usePathname();
  const { currentAccount, disconnect } = useWalletKit();

  function isActive(path: string) {
    return pathname.startsWith(path);
  }

  return (
    <aside className="w-64 bg-[#0f152b] p-6 flex flex-col justify-between border-r border-white/5 min-h-screen">
      <div>
        <h1 className="text-xl font-bold mb-10 flex items-center gap-2">
          <span className="bg-blue-600 p-2 rounded-lg">💠</span>
          SUI Trade
        </h1>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 text-gray-300">
          <Link
            href="/dashboard"
            className={`p-3 rounded-xl ${
              isActive("/dashboard")
                ? "bg-[#1a2038] text-white"
                : "hover:bg-[#1a2038]"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/trade/create/step1"
            className={`p-3 rounded-xl ${
              isActive("/trade/create")
                ? "bg-[#1a2038] text-white"
                : "hover:bg-[#1a2038]"
            }`}
          >
            New Trade
          </Link>

          <Link
            href="/trade/rooms/active"
            className={`p-3 rounded-xl ${
              isActive("/trade/rooms")
                ? "bg-[#1a2038] text-white"
                : "hover:bg-[#1a2038]"
            }`}
          >
            My Rooms
          </Link>

          <Link
            href="/history"
            className={`p-3 rounded-xl ${
              isActive("/history")
                ? "bg-[#1a2038] text-white"
                : "hover:bg-[#1a2038]"
            }`}
          >
            History
          </Link>
        </nav>

        {/* Connected Wallet Box */}
        <div className="mt-10 p-4 bg-[#1a2038] rounded-xl border border-white/10">
          <p className="text-green-400 text-sm">● Connected</p>
          <p className="text-xs mt-1 font-mono break-all">
            {currentAccount?.address ?? "Not Connected"}
          </p>

          {currentAccount && (
            <button
              onClick={disconnect}
              className="mt-3 w-full bg-red-400/20 text-red-400 p-2 rounded-lg"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-gray-400 text-sm">
        John Soares <br /> SUI Trader
      </div>
    </aside>
  );
}
