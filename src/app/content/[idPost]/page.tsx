import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ContentPage from '@/components/DetailCourse/ContentPage'


export { generateMetadata } from '@/MetaData/pages/post'


interface idPostPageProps {
  params: { idPost: string }
}


export default function CourseDescription({ params }: idPostPageProps) {
  const { idPost } = params
  return (
    <>
      <Header />
      <ContentPage id={idPost}/>
      <Footer />
    </>
  )
}
