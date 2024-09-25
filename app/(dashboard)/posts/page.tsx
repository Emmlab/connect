import React from "react";
import CreatePostForm from "../../../components/posts/CreatePostForm";
import Posts from "../../../components/posts/Posts";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPostsAction } from "@/utils/actions/";

/**
 * The `PostsPage` function prefetches posts data, dehydrates the query client
 * state, and renders a create post form and posts component.
 * @returns The `PostsPage` component is being returned. Inside the component, a `QueryClient` is
 * created, and a query is prefetched using `queryClient.prefetchQuery`. The component then returns a
 * `HydrationBoundary` component with a `CreatePostForm` and a `Posts` component inside it.
 */
const PostsPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts", 1],
    queryFn: () => getPostsAction({ page: 1 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CreatePostForm />
      <Posts />
    </HydrationBoundary>
  );
};

export default PostsPage;
