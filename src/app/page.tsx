import BrowserMeltdown from "./ui/BrowserMeltdown";

export default function Page() {
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0d12 0%, #0f1419 50%, #0a0d12 100%)", color: "#e6edf3" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <h1 style={{ 
          fontSize: 42, 
          margin: 0, 
          letterSpacing: -1.2,
          fontWeight: 700,
          background: "linear-gradient(135deg, #ffffff 0%, #a0aec0 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          You get a browser, and you get another browser...
        </h1>
        <p style={{ 
          opacity: 0.7, 
          marginTop: 16, 
          lineHeight: 1.7,
          fontSize: 15,
          fontWeight: 400,
        }}>
          Click to spin up "just one more" browser. 
        </p>
        <div style={{ marginTop: 40 }}>
          <BrowserMeltdown />
        </div>
      </div>
    </main>
  );
}
