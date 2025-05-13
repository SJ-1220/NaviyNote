import React from 'react'

const layout = ({
  children,
  memoModal,
}: {
  children: React.ReactNode
  memoModal: React.ReactNode
}) => {
  return (
    <>
      {children}
      {memoModal}
    </>
  )
}
export default layout
