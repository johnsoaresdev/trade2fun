"use client";

import { ConnectButton, useWalletKit } from "@mysten/wallet-kit";
import { useTradeStore } from "@/store/tradeStore";
import { useEffect } from "react";

export function SuiConnectButton() {
  const { currentAccount } = useWalletKit();

  const setTargetWallet = useTradeStore((s: any) => s.setTargetWallet);

  // sempre que conectar a carteira, salva no estado global
  useEffect(() => {
    if (currentAccount?.address) {
      setTargetWallet(currentAccount.address);
    }
  }, [currentAccount]);

  return (
    <div className="flex items-center gap-4">
      <ConnectButton />
    </div>
  );
}
