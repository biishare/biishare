import ContentFilters from '@/components/Category/ContentFilters'
import ContentList from '@/components/Course/Course'
import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import Hero from "@/components/Header/HeroSection";
import { Suspense } from 'react'

export default function Page() {
  return (
    <div className="w-full h-full overflow-x-hidden">
      <Header />

      <Hero />
      <Suspense fallback={null}>
        <div className="pb-10 space-y-8">
          <div className="pt-2 lg:px-24">
            <ContentFilters />
            <ContentList />
          </div>
        </div>
      </Suspense>
      <Footer />
    </div>
  )
}