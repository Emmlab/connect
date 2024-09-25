"use client"
import React, { PropsWithChildren } from 'react';
import Navbar from "@/components/layout/Navbar/";
import BackButton from "@/components/layout/BackButton";

/**
 * The `layout` function renders a main layout with a Navbar, title, BackButton,
 * and children components.
 * @param {PropsWithChildren}  - The `layout` function is a React component that takes in props with
 * children. It renders a layout structure with a Navbar, a title "Profile" with a BackButton, and the
 * children components passed to it.
 * @returns The `layout` function is returning a JSX structure that includes a main element with a
 * Navbar component, a div element with specific styling classes, a header element with the text
 * "Profile" and a BackButton component, and finally the children components passed to the layout
 * function.
 */
const layout = ({ children }: PropsWithChildren) => {
  return (
    <main>
      <Navbar />
      <div className="mx-auto py-4 sm:px-16 lg:px-24 px-4">
        <div className="w-full py-5 flex items-center justify-between">
          <h1 className="font-bold pl-5">Profile</h1>
          <BackButton />
        </div>
        {children}
      </div>
    </main>
  );
}

export default layout;
