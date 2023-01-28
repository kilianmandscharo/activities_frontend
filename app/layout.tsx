import Navbar from "@/components/Navbar"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head />
      <body className="bg-orange-300 grid justify-center p-4 max-w-5xl">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
