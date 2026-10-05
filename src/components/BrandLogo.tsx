import Image from "next/image";
import Link from "next/link";

export default function BrandLogo({ href = "/", compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className={`relative block shrink-0 ${compact ? "h-11 w-32" : "h-14 w-40"}`} aria-label="Mundus Languages">
      <Image src="/logo-removebg-preview.png" alt="Mundus Languages" fill className="object-contain object-left" priority />
    </Link>
  );
}
