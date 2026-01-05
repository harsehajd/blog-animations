import BrowserMeltdown from "./ui/BrowserMeltdown";

export default function Page() {
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0d12 0%, #0f1419 50%, #0a0d12 100%)", color: "#e6edf3" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ marginTop: 50 }}>
          <BrowserMeltdown />
        </div>
      </div>
    </main>
  );
}
