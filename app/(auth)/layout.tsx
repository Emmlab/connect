import React, { PropsWithChildren } from "react";
import Navbar from "@/components/layout/Navbar/";

/**
 * The `layout` function renders a main layout with a Navbar and a content
 * area that adjusts its width based on the screen size.
 * @param {PropsWithChildren}  - The `layout` function is a React component that takes in props as an
 * object with a `children` property. The `children` prop is of type `PropsWithChildren`, which is a
 * utility type in TypeScript that adds the `children` property to the props object.
 * @returns The `layout` function is returning a JSX structure that includes a `<main>` element
 * containing a `<Navbar>` component and a `<div>` element with specific classes and width percentages.
 * The `children` prop is also being rendered within the `<div>` element.
 */
const layout = ({ children }: PropsWithChildren) => {
  return (
    <main>
      <Navbar />
      <div className="mx-auto py-4 sm:px-16 lg:px-24 px-4">{children}</div>
    </main>
  );
};

export default layout;
