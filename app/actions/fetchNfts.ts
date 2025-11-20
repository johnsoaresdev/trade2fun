"use server";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
const client = new SuiClient({ url: getFullnodeUrl("mainnet") });
export async function fetchNftsServer(address:string){
  try{
    const res = await client.getOwnedObjects({ owner: address, options:{ showContent:true, showType:true, showDisplay:true } });
    const entries = res?.data||[];
const nfts = entries.map((e:any)=>e?.data).filter((d:any)=>d && d.content && d.content.dataType==="moveObject").map((d:any)=>{
  const display = d.display?.data || {};
  const fields = d.content.fields||{};
  const type = d.type || "";
  const objId = d.objectId;
  const name = display?.name || fields.name || "NFT";
  const collection = display?.collection || type.split("::").slice(0,2).join("::") || "Unknown";
  const image = display?.image_url || display?.image || display?.url || fields.url || fields.image || fields.image_url || "/placeholder.png";
  return { id:objId, name, image, collection };
});
    return nfts;
  }catch(e){ console.error(e); return []; }
}
