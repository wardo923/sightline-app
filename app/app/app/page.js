export default function Home() {
  return (
    <main style={{
      background: "#0b0f1a",
      color: "#fff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>SightLine</h1>
      <p style={{ opacity: 0.85 }}>Strategy-Driven Trading Signals</p>

      <button style={{
        marginTop: 20,
        padding: "14px 28px",
        borderRadius: 10,
        background: "#00ffae",
        border: "none",
        fontSize: "16px",
        cursor: "pointer"
      }}>
        Start Strategy Wizard
      </button>
    </main>
  )
}
