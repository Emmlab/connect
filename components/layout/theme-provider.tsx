"use client";
import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

/**
 * The function ThemeProvider is a wrapper component that passes down theme-related props to its
 * children.
 * @param {ThemeProviderProps}  - The `ThemeProvider` component takes in `children` and `props` as
 * parameters. The `children` parameter represents the child components that will be wrapped by the
 * `ThemeProvider`, while the `props` parameter is an object containing any additional props that may
 * be passed to the `ThemeProvider`. These additional props
 * @returns The `ThemeProvider` component is being returned, which wraps the `NextThemesProvider`
 * component and passes down the `children` and `props`.
 */
export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
