"use server";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
const client = new SuiClient({ url: getFullnodeUrl("mainnet") });
export async function fetchNftsServer(address:string){
  try{
    const res = await client.getOwnedObjects({ owner: address, options:{ showContent:true, showType:true } });
    const entries = res?.data||[];
    const nfts = entries.map((e:any)=>e?.data).filter((d:any)=>d && d.content && d.content.dataType==="moveObject").map((d:any)=>{
      const fields = d.content.fields||{};
      return { id:d.objectId, name:fields.name||"NFT", image:fields.url||fields.image||fields.image_url||"/placeholder.png", collection:d.type?.split("::")?.[1]||"Unknown" };
    });
    return nfts;
  }catch(e){ console.error(e); return []; }
}
