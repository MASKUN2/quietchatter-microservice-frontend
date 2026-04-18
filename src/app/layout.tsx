import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import AppWrapper from "./AppWrapper";

export const metadata: Metadata = {
  title: "Quiet Chatter",
  description: "익명성과 휘발성을 결합한, 수줍은 이들을 위한 저자극 독서 나눔 SNS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body>
        <ThemeRegistry>
          <AppWrapper>
            {children}
          </AppWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
