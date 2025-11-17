import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help and support for SmartEdu Hub. Access FAQs, contact our support team, live chat, and find resources to help you get the most out of your school management platform.",
  keywords: [
    "customer support",
    "help center",
    "technical support",
    "contact support",
    "FAQ",
    "troubleshooting",
    "live chat",
    "email support",
  ],
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
