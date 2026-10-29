import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://metehan-gezer.vercel.app"),
  alternates: {
    canonical: "https://metehan-gezer.vercel.app",
  },
  title: {
    default: "Metehan Gezer | Kişisel Portfolyo & Büyük Veri Analistliği",
    template: "%s | Metehan Gezer",
  },
  description:
    "Manisa Celal Bayar Üniversitesi Büyük Veri Analistliği programı öğrencisi Metehan Gezer'in kişisel portfolyosu, veri analitiği projeleri, SQL ve Neon PostgreSQL veritabanı çalışmaları.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Metehan Gezer Portfolyo",
    title: "Metehan Gezer | Büyük Veri Analistliği & Veri Mühendisliği Portfolyosu",
    description:
      "Manisa Celal Bayar Üniversitesi Büyük Veri Analistliği öğrencisi Metehan Gezer'in veri analizi projeleri, SQL sorguları, ekonometrik modelleri ve analitik çalışmaları.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Metehan Gezer Kişisel Portfolyosu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Metehan Gezer | Kişisel Portfolyo",
    description:
      "Manisa Celal Bayar Üniversitesi Büyük Veri Analistliği öğrencisi Metehan Gezer'in veri odaklı projeleri ve analitik çalışmaları.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${outfit.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          as="style"
          crossOrigin="anonymous"
        />
        <link
          id="fa-css"
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          media="print"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: "var l=document.getElementById('fa-css');if(l){l.addEventListener('load',function(){this.media='all'});setTimeout(function(){l.media='all'},1000);}",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#09080e] text-[#f8fafc] font-sans selection:bg-[#9d4edd] selection:text-white">
        {children}
      </body>
    </html>
  );
}
