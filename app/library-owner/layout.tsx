import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Library Owner Dashboard",
  description: "Manage your library resources and content",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LibraryOwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

