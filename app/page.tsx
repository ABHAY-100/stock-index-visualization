import MarketDashboard from "@/components/market-dashboard";

export default function Home() {
  return (
    <main className="relative px-4 py-6 w-screen">
      <nav className="flex justify-center items-center mb-6 bg-background fixed top-0 left-0 right-0 z-10 h-16 shadow-md">
        <h1 className="text-2xl font-bold">Stock Index Visualizer 📈</h1>
      </nav>
      <div className="mt-12 flex justify-center items-center">
        <MarketDashboard csvUrl="/dump.csv" />
      </div>
    </main>
  );
}
