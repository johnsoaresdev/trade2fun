import { NextResponse } from "next/server";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

export async function GET() {
  const client = new SuiClient({ url: getFullnodeUrl("mainnet") });

  const wallet = "0x4c37a939e0363ae3335140bb8752272e483e01cbc9846ace87d9512c93524c0a";

  const res = await client.getOwnedObjects({
    owner: wallet,
    options: { showContent: true, showType: true, showDisplay: true }
  });

  return NextResponse.json(res, { status: 200 });
}
