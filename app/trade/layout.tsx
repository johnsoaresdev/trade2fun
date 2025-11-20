import Sidebar from "@/components/Sidebar";

export default function TradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0d1224] text-white flex">
      <Sidebar />

      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
