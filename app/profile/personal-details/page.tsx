import React, { Suspense } from "react";
import PersonalDetails from "@/components/profile/PersonalDetails";

// Profile personal details page
const PersonalDetailsPage = () => (
  <Suspense>
    <PersonalDetails />
  </Suspense>
);

export default PersonalDetailsPage;
