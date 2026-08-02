import Header from '@/components/Header/Header'
import PrivacyClient from './PrivacyClient'

export { privacyMetadata as metadata } from '@/MetaData/pages/privacy' 

export default function Page() {
  return (
    <>
      <Header autoHide={false} />
      <PrivacyClient />
    </>
  )
}
