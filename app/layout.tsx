import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "GitConnect",
  description:
    "GitConnect allows developers to  create a developer profile/portfolio, share posts and get help from others developers",
};

/**
 * The `RootLayout` function is a React component that wraps its children with providers in an HTML
 * body element.
 * @param  - The `RootLayout` function is a React component that serves as the root layout for your
 * application. It takes a single parameter, an object with a `children` property. The `children`
 * property is of type `React.ReactNode`, which means it can accept any valid React node as its value.
 * @returns The `RootLayout` function is returning a JSX structure that represents the basic structure
 * of an HTML document. It includes an `<html>` tag with a `lang` attribute set to "en" and a
 * `suppressHydrationWarning` attribute. Inside the `<html>` tag, there is a `<body>` tag that contains
 * a custom component `<Providers>` with the `children` passed as its content
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
