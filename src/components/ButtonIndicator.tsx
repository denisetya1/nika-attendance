'use client'

import { useFormStatus } from "react-dom"
import { Button, ButtonProps } from "./ui/button"

interface ButtonPropsIndicator extends ButtonProps {
  text: React.ReactNode
  pendingText: React.ReactNode
}

const ButtonIndicator = ({ text, pendingText, disabled, ...restProps }: ButtonPropsIndicator) => {
  const { pending } = useFormStatus()

  return (
    <Button
      {...restProps}
      disabled={disabled || pending}
    >
      {pending && pendingText}
      {!pending && text}
    </Button>
  )
}

export default ButtonIndicator