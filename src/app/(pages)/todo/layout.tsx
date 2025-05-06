import React from 'react'

const layout = ({
  children,
  todoModal,
}: {
  children: React.ReactNode
  todoModal: React.ReactNode
}) => {
  return (
    <>
      {children}
      {todoModal}
    </>
  )
}
export default layout
