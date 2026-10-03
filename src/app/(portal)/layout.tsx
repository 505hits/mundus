import PortalNav from "@/components/PortalNav";

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Each page authorizes before reading data; route-specific redirects retain purchase intent.

  return (
    <div className="min-h-screen bg-[#f7f8f5] lg:flex">
      <PortalNav paymentsEnabled={process.env.MUNDUS_PAYMENTS_ENABLED === "true"} />

      <div className="min-w-0 flex-1 pb-24 lg:pb-0">
        {children}
      </div>
    </div>
  );
}
