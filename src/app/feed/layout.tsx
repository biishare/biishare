import Header from "@/components/Header/Header"
import Footer from "@/components/Footer/Footer"

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full h-full overflow-x-hidden">
      <Header />

      {children}

      <Footer />
    </div>
  )
}