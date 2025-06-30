import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  type: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export default function Button({
  children,
  onClick,
  type,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}>
      <div {...props} className={`${className}`}>
        {children}
      </div>
    </button>
  )
}
