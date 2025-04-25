import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  type: 'button' | 'submit' | 'reset'
}

export default function Button({
  children,
  onClick,
  type,
  className,
  ...props
}: ButtonProps) {
  return (
    <button type={type}>
      <div {...props} className={`${className}`} onClick={onClick}>
        {children}
      </div>
    </button>
  )
}
