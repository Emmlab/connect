"use client";
import Navbar from "@/components/layout/Navbar/";
import GithubAuthButton from "@/components/auth/GithubAuthButton";
import Developers from "@/components/developers/Developers";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

/**
 * The Home component renders a page layout with a title, quote, and buttons for GitHub authentication
 * and displaying developers.
 * @returns The `Home` component is being returned. It contains JSX elements for a main section with a
 * Navbar, a heading, a quote, a Github authentication button, and a list of developers. The component
 * also includes a `HydrationBoundary` component that wraps the content and receives the dehydrated
 * state from a `queryClient`.
 */
const Home = () => {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <Navbar />
        <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-5 flex flex-col md:flex-row gap-2">
          <div className="md:h-[60vh] w-full md:w-[55%] flex flex-col justify-center">
            <h1 className="capitalize text-4xl font-bold">
              Let&apos;s <span className="text-primary">GIT</span> connected!
            </h1>
            <p className="leading-loose max-w-md mt-4 italic">
              The best thing about a computer is that it does what you tell it
              to do and that&apos;s often the problem.
              <br />
              <span className="italic">~ Donald Knuth</span>
            </p>
            <div className="flex gap-4">
              <Suspense>
                <GithubAuthButton />
              </Suspense>
            </div>
          </div>
          <div className="h-[60vh] w-full md:w-[40%] flex">
            <Developers />
          </div>
        </section>
      </main>
    </HydrationBoundary>
  );
};

export default Home;
