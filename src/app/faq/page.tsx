import Header from '@/components/Header/Header'
import FaqClient from './FaqClient'

export { faqMetadata as metadata } from '@/MetaData/pages/faq'

export default function Page() {
  return (
    <>
      <Header autoHide={false} />
      <FaqClient />
    </>
  )
}
