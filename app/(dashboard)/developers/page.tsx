import React from "react";
import Developers from '@/components/developers/Developers';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';


/**
 * The `DevelopersPage` function initializes a `queryClient` and renders a
 * `Developers` component within a `HydrationBoundary` component.
 * @returns The DevelopersPage component is being returned. It includes a QueryClient instance and a
 * HydrationBoundary component wrapping the Developers component.
 */
const DevelopersPage = async () => {
  const queryClient = new QueryClient();
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Developers />
    </HydrationBoundary>
  );
}

export default DevelopersPage;
