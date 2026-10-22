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
  metadataBase: new URL("https://metehan-gym-churn.vercel.app"),
  title: "Metehan Gezer | Büyük Veri Analistliği Portfolyosu & Gym Churn Veri Hikayesi",
  description:
    "Manisa Celal Bayar Üniversitesi Büyük Veri Analistliği Öğrencisi Kişisel Portfolyo ve Gym Churn Veri Hikayesi (D3.js & Scrollytelling).",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    title: "Sadakatin Bedeli: Spor Salonları Üyelerini Neden Kaybediyor? | Metehan Gezer",
    description:
      "Kaggle üzerinde yayımlanan 4.000 gözlemlik kamuya açık veri setinde (%26,5 genel terk oranı) yaş, sözleşme süresi ve katılım ilişkisini inceleyen interaktif veri gazeteciliği çalışması.",
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
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#09080e] text-[#f8fafc] font-sans selection:bg-[#9d4edd] selection:text-white">
        {children}
      </body>
    </html>
  );
}
