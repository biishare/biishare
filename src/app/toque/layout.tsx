interface Props {
  children: React.ReactNode
  modal: React.ReactNode
}

export default function ToquesLayout({
  children,
  modal,
}: Props) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}