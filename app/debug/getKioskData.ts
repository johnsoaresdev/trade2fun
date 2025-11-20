"use server";

import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

export async function getKioskData(wallet: string) {
  const client = new SuiClient({ url: getFullnodeUrl("mainnet") });

  // 1️⃣ Buscar objetos da carteira
  const owned = await client.getOwnedObjects({
    owner: wallet,
    options: { showContent: true, showType: true, showDisplay: true }
  });

  // 2️⃣ Encontrar o PersonalKioskCap (onde fica o kiosk real)
  const caps = owned.data.filter((o: any) =>
    o.data?.type?.includes("PersonalKioskCap")
  );

  if (caps.length === 0) {
    return { error: "Nenhum PersonalKioskCap encontrado" };
  }

  // 3️⃣ O Kiosk real fica DENTRO de fields.cap.fields.for
  const kioskId =
    caps[0].data?.content?.fields?.cap?.fields?.for ||
    caps[0].data?.content?.fields?.for ||
    null;

  if (!kioskId) {
    return { error: "PersonalKioskCap encontrado, mas sem kioskId" };
  }

  // 4️⃣ Buscar todos os dynamic fields do kiosk
  const dynamicFields = await client.getDynamicFields({ parentId: kioskId });

  const items = [];

  for (const f of dynamicFields.data) {
    const full = await client.getObject({
      id: f.objectId,
      options: { showDisplay: true, showContent: true }
    });
    items.push(full);
  }

  return {
    kioskId,
    dynamicFields,
    items
  };
}
