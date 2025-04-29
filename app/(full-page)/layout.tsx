import { Metadata } from "next";
import AppConfig from "../../layout/AppConfig";
import React from "react";

interface FullPageLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Lion Gym",
  description: "Lion Gym Refinery.",
};

export default function FullPageLayout({ children }: FullPageLayoutProps) {
  return (
    <React.Fragment>
      {children}
      <AppConfig minimal />
    </React.Fragment>
  );
}
