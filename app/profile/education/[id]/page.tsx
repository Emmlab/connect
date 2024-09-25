import React from "react";
import EditEducationForm from '@/components/profile/Education/EditEducationForm';
import { getEducationItemAction } from '@/utils/actions/';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';


async function EditEducationPage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['education', params.id],
    queryFn: () => getEducationItemAction(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditEducationForm educationId={params.id} />
    </HydrationBoundary>
  );
}
export default EditEducationPage;
