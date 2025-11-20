"use client";

import { useState } from "react";
import { StepHeader } from "@/components/trade/StepHeader";
import { Button } from "@/components/ui/button";
import { useTradeStore } from "@/store/tradeStore";
import { useWalletKit } from "@mysten/wallet-kit";
import { useRouter } from "next/navigation";

export default function Step1() {
  const router = useRouter();

  // Zustand
  const setTargetWallet = useTradeStore((s: any) => s.setTargetWallet);

  // WalletKit
  const { currentAccount } = useWalletKit();

  const [targetWallet, setTargetWalletLocal] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  function validateAddress(addr: string) {
    // Validação simples SUI address (0x + 64 hex chars)
    const regex = /^0x[a-fA-F0-9]{64}$/;
    if (addr.length === 0) return null;
    return regex.test(addr);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTargetWalletLocal(value);
    setIsValid(validateAddress(value));
    setTargetWalletLocal(value);
  }

  function handleNext() {
    if (!isValid) return;

    // Salvar no Zustand
    setTargetWallet(targetWallet);

    // Ir para Step 3 (pulando Step 2)
    router.push("/trade/create/step3");
  }

  return (
    <div>
      <StepHeader step={1} title="Enter a Target Wallet" />

      <p className="text-gray-400 mb-6">
        Specify the wallet address that can accept this private trade.
        <br />
        <span className="text-gray-500 text-sm">
          Only this wallet will be able to accept the trade. Double-check the address.
        </span>
      </p>

      {/* TARGET WALLET INPUT */}
      <div className="mb-6">
        <label className="text-sm text-gray-300">
          Target Wallet Address
        </label>

        <input
          type="text"
          value={targetWallet}
          onChange={handleChange}
          placeholder="0x..."
          className="mt-2 w-full p-3 rounded-lg bg-[#101528] border border-gray-700 outline-none text-white"
        />

        {isValid === false && (
          <p className="text-red-400 text-sm mt-2">
            Invalid Sui wallet address.
          </p>
        )}

        {isValid === true && (
          <p className="text-green-400 text-sm mt-2">
            ✓ Valid Sui address
          </p>
        )}
      </div>

      {/* YOUR WALLET (REAL ADDRESS) */}
      <div className="p-4 bg-[#141b33] rounded-xl border border-white/10 mb-10">
        <p className="text-gray-400 text-sm mb-1">Your Wallet</p>

        <p className="text-white font-mono">
          {currentAccount?.address ?? "Not Connected"}
        </p>
      </div>

      {/* NEXT BUTTON */}
      <div className="flex justify-end">
        <Button
          disabled={!isValid}
          onClick={handleNext}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg"
        >
          Next Step →
        </Button>
      </div>
    </div>
  );
}
