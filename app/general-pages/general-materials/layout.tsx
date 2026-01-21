import { ReactNode } from "react";

export default function GeneralMaterialsLayout({
  children,
}: {
  children: ReactNode;
}) {
  // This layout will be used by the shared pages
  // The actual shell will be determined by the parent route
  // For now, we'll just return children and let parent layouts handle the shell
  return <>{children}</>;
}


