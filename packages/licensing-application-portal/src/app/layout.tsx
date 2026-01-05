import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apply for a property licence - GOV.UK",
  description: "Apply for mandatory and selective property licences in the UK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="govuk-template">
      <body>
        {children}
      </body>
    </html>
  );
}

