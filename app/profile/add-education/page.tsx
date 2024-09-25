import React from "react";
import CreateEducationForm from '@/components/profile/Education/CreateEducationForm';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getEducationAction } from '@/utils/actions/';

/**
 * The AddEducationPage function prefetches education data and renders a form for creating new
 * education entries.
 * @returns The AddEducationPage component is being returned. Inside this component, a QueryClient is
 * created, and a query for education data is prefetched using the getEducationAction function. Then, a
 * HydrationBoundary component is rendered with the state dehydrated from the queryClient, and within
 * the HydrationBoundary, the CreateEducationForm component is rendered.
 */
const AddEducationPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['education', 1],
    queryFn: () => getEducationAction({ page: 1 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CreateEducationForm />
    </HydrationBoundary>
  );
}

export default AddEducationPage;