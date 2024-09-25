
import React from "react";
import { Button } from '@/components/ui/button';
import { LoaderCircle } from "lucide-react";


type CustomButtonProps = {
  icon?: React.ReactNode;
  text: string,
  handleClick?: () => void,
  isPending: boolean,
  className?: string,
  size?: "sm" | "lg" | "icon" | "default" | null | undefined,
  type?: 'button' | 'submit' | 'reset'
}
const CustomButton = ({
    icon,
    text,
    handleClick,
    isPending,
    className,
    size,
    type
  }: CustomButtonProps) => {
  return (
    <Button
      size={size || 'sm'}
      type={type || 'button'}
      className={className || `flex gap-x-2 items-center ${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      disabled={isPending}
      onClick={() => handleClick && !isPending && handleClick()}
    >
      {icon}
      {isPending ? <LoaderCircle className="animate-spin h-3" /> : text}
    </Button>
  );
}

export default CustomButton