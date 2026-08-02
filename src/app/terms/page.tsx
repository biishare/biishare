import Header from '@/components/Header/Header'
import TermsClient from './TermsClient'

export { termsMetadata as metadata } from '@/MetaData/pages/terms' 

export default function Page() {
  return (
    <>
      <Header autoHide={false} />
      <TermsClient />
    </>
  )
}
