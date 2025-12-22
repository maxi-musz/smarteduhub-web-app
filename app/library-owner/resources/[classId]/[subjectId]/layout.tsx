import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subject Details - Library Owner",
  description: "Manage chapters and topics for this subject",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

