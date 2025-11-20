export default function CreateTradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto py-10">
      {children}
    </div>
  );
}
