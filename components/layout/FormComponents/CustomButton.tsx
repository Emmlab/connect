import React from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import Swal from "sweetalert2";

type CustomButtonProps = {
  icon?: React.ReactNode;
  text: string;
  handleClick?: () => void;
  isPending: boolean;
  isDelete?: boolean;
  className?: string;
  size?: "sm" | "lg" | "icon" | "default" | null | undefined;
  type?: "button" | "submit" | "reset";
};
const CustomButton = ({
  icon,
  text,
  handleClick,
  isPending,
  isDelete,
  className,
  size,
  type,
}: CustomButtonProps) => {
  const handleButtonClickInterceptor = () => {
    // don't proceed to handle click if something is loading/no click function is used
    if (!handleClick || isPending) return true;

    if (isDelete) {
      return Swal.fire({
        title: "Are you sure",
        text: "Are you sure you want to delete item.",
        color: "white",
        background: "#475f7b",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Confirm",
        confirmButtonColor: "#FF5471",
        cancelButtonColor: "#475f7b",
        reverseButtons: true,
      }).then(({ isConfirmed }) => {
        if (isConfirmed) {
          // proceed to delete
          handleClick();
        }
        return true;
      });
    }

    // proceed to handle click
    handleClick();
  };

  return (
    <Button
      size={size || "sm"}
      type={type || "button"}
      className={
        className ||
        `flex gap-x-2 items-center ${isPending ? "cursor-not-allowed" : "cursor-pointer"}`
      }
      disabled={isPending}
      onClick={() => handleButtonClickInterceptor()}
    >
      {icon}
      {isPending ? <LoaderCircle className="animate-spin h-3" /> : text}
    </Button>
  );
};

export default CustomButton;
