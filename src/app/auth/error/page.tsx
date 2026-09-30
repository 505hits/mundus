import Link from "next/link";
import AccountShell from "@/components/AccountShell";

export default function AuthErrorPage() {
  return <AccountShell title="Odkaz alebo účet nie je dostupný" description="Odkaz mohol vypršať alebo už bol použitý. Ak už máte overený účet, skúste sa prihlásiť. V prípade pozvánky požiadajte Mundus o pomoc.">
    <Link className="block rounded-xl bg-[#163f3a] p-3 text-center font-semibold text-white" href="/login">Prejsť na prihlásenie</Link>
    <Link className="mt-5 block text-center text-sm underline" href="/contact">Kontaktovať Mundus</Link>
  </AccountShell>;
}
