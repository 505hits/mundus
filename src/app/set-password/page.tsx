import AccountShell from "@/components/AccountShell";
import SetPasswordForm from "./SetPasswordForm";
import { currentLanguage } from "@/lib/i18n";

export default async function SetPasswordPage() {
  const language = await currentLanguage();
  const sk = language === "sk";
  return <AccountShell title={sk ? "Vitajte v tíme Mundus" : "Welcome to the Mundus team"} description={sk ? "Nastavte si heslo pre svoj lektorský účet. Prístup získate cez pozvánku od Mundus Languages." : "Set a password for your teacher account. Access is provided through an invitation from Mundus Languages."}><SetPasswordForm /></AccountShell>;
}
