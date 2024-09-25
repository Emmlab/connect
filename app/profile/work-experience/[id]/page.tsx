import React from "react";
import EditWorkExperienceForm from '@/components/profile/WorkExperience/EditWorkExperienceForm';
import { getWorkExperienceItemAction } from '@/utils/actions/';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';


/**
 * The function `EditWorkExperiencePage` prefetches work experience data using a
 * query client and renders an edit form component with the hydrated state.
 * @param  - The `EditWorkExperiencePage` function is an asynchronous function that takes an object as
 * a parameter with a `params` property containing an `id` string. Inside the function, a new
 * `QueryClient` is created, and then a query is prefetched using the `queryClient.prefetchQuery
 * @returns The EditWorkExperiencePage component is being returned. Inside this component, a
 * QueryClient is created, a query is prefetched using the getWorkExperienceItemAction function with
 * the provided params.id, and then an EditWorkExperienceForm component is rendered within a
 * HydrationBoundary component with the dehydrated state of the queryClient.
 */
async function EditWorkExperiencePage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['workExperience', params.id],
    queryFn: () => getWorkExperienceItemAction(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditWorkExperienceForm workExperienceId={params.id} />
    </HydrationBoundary>
  );
}

export default EditWorkExperiencePage;
