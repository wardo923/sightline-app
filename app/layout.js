export const metadata = {
  title: "SightLine",
  description: "SightLine Trading Intelligence",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui" }}>
        {children}
      </body>
    </html>
  );
}
