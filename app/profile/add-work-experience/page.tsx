import React from "react";
import CreateWorkExperienceForm from '@/components/profile/WorkExperience/CreateWorkExperienceForm';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getWorkExperienceAction } from '@/utils/actions/';

/**
 * The AddWorkExperiencePage function prefetches work experience data and renders a form for creating
 * new work experiences.
 * @returns The `AddWorkExperiencePage` function is returning a JSX element that includes a
 * `HydrationBoundary` component with the state dehydrated from the `queryClient`, and within the
 * `HydrationBoundary` component, a `CreateWorkExperienceForm` component is being rendered.
 */
const AddWorkExperiencePage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['workExperience', 1],
    queryFn: () => getWorkExperienceAction({ page: 1 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CreateWorkExperienceForm />
    </HydrationBoundary>
  );
}

export default AddWorkExperiencePage;