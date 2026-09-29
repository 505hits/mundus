"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentStatusRefresh() {
  const router = useRouter();
  useEffect(() => {
    let checks = 0;
    const timer = setInterval(() => {
      router.refresh();
      if (++checks >= 12) clearInterval(timer);
    }, 5000);
    return () => clearInterval(timer);
  }, [router]);
  return <p role="status" className="mt-3 text-sm text-gray-500">Stav sa priebežne obnovuje. Pri pomalšej platbe ho môžete skontrolovať aj neskôr v prehľade balíčkov.</p>;
}
