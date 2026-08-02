import { aboutMetadata } from '@/MetaData/pages/about'
import Header from '@/components/Header/Header'
import AboutClient from './AboutClient'

export const metadata = aboutMetadata

export default function Page() {
  return (
    <>
      <Header autoHide={false} />
      <AboutClient />
    </>
  )
}
