import AccountShell from "@/components/AccountShell";
import CompanySetPasswordForm from "./CompanySetPasswordForm";
import { currentLanguage } from "@/lib/i18n";

export default async function CompanySetPasswordPage(){
 const language=await currentLanguage(); const sk=language==="sk";
 return <AccountShell title={sk?"Vitajte vo firemnom portáli Mundus":"Welcome to the Mundus company portal"} description={sk?"Nastavte si heslo k firemnému účtu. Prístup je dostupný iba cez pozvánku od Mundus Languages.":"Set a password for your company account. Access is available only through an invitation from Mundus Languages."}><CompanySetPasswordForm/></AccountShell>;
}
