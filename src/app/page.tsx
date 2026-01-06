import BrowserMeltdown from "./ui/BrowserMeltdown";

export default function Page() {
  return (
    <main style={{ 
      width: "100vw", 
      height: "100vh", 
      margin: 0, 
      padding: 0,
      background: "linear-gradient(135deg, #0a0d12 0%, #0f1419 50%, #0a0d12 100%)", 
      color: "#e6edf3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      boxSizing: "border-box",
    }}>
      <div style={{ 
        width: "min(100vw, calc(100vh * 16 / 9))",
        height: "min(100vh, calc(100vw * 9 / 16))",
        aspectRatio: "16/9",
        padding: "0 16px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}>
        <BrowserMeltdown />
      </div>
    </main>
  );
}
