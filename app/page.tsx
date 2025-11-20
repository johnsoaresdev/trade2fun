"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { SuiConnectButton } from "@/components/wallet/ConnectButton";
import { useWalletKit } from "@mysten/wallet-kit";

export default function SuiTradeDashboard() {
  const { currentAccount, disconnect } = useWalletKit();

  const shortAddress = currentAccount?.address
    ? `${currentAccount.address.slice(0, 6)}...${currentAccount.address.slice(-4)}`
    : "Not Connected";

  return (
    <div className="min-h-screen bg-[#0d1224] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f152b] p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-10 flex items-center gap-2">
            <span className="bg-blue-600 p-2 rounded-lg">💠</span>
            SUI Trade
          </h1>

          {/* NAVIGATION */}
          <nav className="flex flex-col gap-3 text-gray-300">
            <a href="/" className="p-3 bg-[#1a2038] rounded-xl">Dashboard</a>
            <a href="/trade/create/step1" className="p-3 hover:bg-[#1a2038] rounded-xl">New Trade</a>
            <a href="/history" className="p-3 hover:bg-[#1a2038] rounded-xl">History</a>
          </nav>

          {/* WALLET BOX */}
          <div className="mt-10 p-4 bg-[#1a2038] rounded-xl">
            {currentAccount ? (
              <>
                <p className="text-green-400 text-sm">● Connected</p>
                <p className="text-xs mt-1 font-mono">{shortAddress}</p>

                <button
                  onClick={() => disconnect()}
                  className="mt-3 w-full bg-red-400/20 text-red-400 p-2 rounded-lg"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <SuiConnectButton />
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-gray-400 text-sm">
          John Soares
          <br />
          SUI Trader
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold">Trade Dashboard</h2>
          <a href="/trade/create/step1">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-3 rounded-xl shadow-lg">
              + Create New Trade
            </Button>
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="p-6 bg-[#141b33] rounded-xl shadow-inner">
            <p className="text-gray-400">Total Trades</p>
            <p className="text-3xl mt-2">0</p>
          </div>
          <div className="p-6 bg-[#1b1f3a] rounded-xl shadow-inner border border-yellow-500/20">
            <p className="text-yellow-400">Active Trades</p>
            <p className="text-3xl mt-2">0</p>
          </div>
          <div className="p-6 bg-[#12291e] rounded-xl shadow-inner border border-green-500/20">
            <p className="text-green-400">Completed</p>
            <p className="text-3xl mt-2">0</p>
          </div>
        </div>

        {/* Trades area */}
        <div className="bg-[#13182b] rounded-xl h-[400px] flex flex-col items-center justify-center border border-white/5">
          <div className="flex gap-3 mb-6">
            <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">All Trades</button>
            <button className="px-3 py-1 bg-[#1f2540] text-gray-300 rounded-lg text-sm">Active</button>
            <button className="px-3 py-1 bg-[#1f2540] text-gray-300 rounded-lg text-sm">Completed</button>
          </div>

          <p className="text-gray-400">No trades found</p>
          <p className="text-gray-500 text-sm mb-4">Start by creating your first trade</p>

          <a href="/trade/create/step1">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-xl shadow-lg">
              + Create Trade
            </Button>
          </a>
        </div>
      </main>
    </div>
  );
}
