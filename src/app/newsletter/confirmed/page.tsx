import Link from "next/link";
import AccountShell from "@/components/AccountShell";
import { currentLanguage } from "@/lib/i18n";

type Props={searchParams:Promise<{status?:string}>};
export default async function NewsletterConfirmedPage({searchParams}:Props){
 const language=await currentLanguage();const sk=language==="sk";const {status}=await searchParams;
 const ok=status==="success";
 return <AccountShell title={ok?(sk?"Odber je potvrdený ✨":"Subscription confirmed ✨"):(sk?"Potvrdenie sa nepodarilo":"Confirmation failed")} description={ok?(sk?"Ste na zozname Mundus. Občas vám pošleme sezónne ponuky, nové termíny a novinky.":"You’re on the Mundus list. We’ll occasionally send seasonal offers, new openings and updates."):(sk?"Odkaz je neplatný, expirovaný alebo sa potvrdenie nepodarilo uložiť. Skúste sa prihlásiť na odber znova.":"The link is invalid, expired, or confirmation could not be saved. Please subscribe again.")}><Link href="/" className="inline-flex rounded-xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white">{sk?"Späť na Mundus":"Back to Mundus"}</Link></AccountShell>;
}
