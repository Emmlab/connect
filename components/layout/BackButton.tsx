import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * The `BackButton` component uses the `useRouter` hook to navigate back in the
 * router history when clicked.
 * @returns A functional component named BackButton is being returned. This component renders a Button
 * element with an outline variant, containing an ArrowLeft icon and a text "Back". When clicked, it
 * uses the router to navigate back to the previous page.
 */
const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => router.back()}
      size="sm"
    >
      <ArrowLeft />
      <span>Back</span>
    </Button>
  );
};

export default BackButton;
