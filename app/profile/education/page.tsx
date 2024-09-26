import React, { Suspense } from "react";
import Education from "@/components/profile/Education";

// Profile education page
const EducationPage = async () => {
  return (
    <Suspense>
      <Education />
    </Suspense>
  );
};

export default EducationPage;
