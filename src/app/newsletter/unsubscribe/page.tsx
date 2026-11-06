import AccountShell from "@/components/AccountShell";
import UnsubscribeForm from "./UnsubscribeForm";
import { currentLanguage } from "@/lib/i18n";

type Props={searchParams:Promise<{token?:string}>};
export default async function NewsletterUnsubscribePage({searchParams}:Props){
 const language=await currentLanguage();const sk=language==="sk";const {token=""}=await searchParams;
 return <AccountShell title={sk?"Zrušenie odberu":"Unsubscribe"} description={sk?"Svoje marketingové súhlasy máte pod kontrolou.":"You are in control of your marketing preferences."}><UnsubscribeForm token={token}/></AccountShell>;
}
