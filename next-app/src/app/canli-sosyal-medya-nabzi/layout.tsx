import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Canlı Sosyal Medya Nabzı | Bluesky Gerçek Zamanlı Akış & Trend Analizi',
  description:
    'Manisa Celal Bayar Üniversitesi BVA 2245 dersi canlı veri ürünü. Bluesky Jetstream WebSocket akışından Web Worker aracılığıyla gerçek zamanlı etiket frekansı, 5m/1h kayan pencereler ve sıfır veri saklama mimarisi.',
  alternates: {
    canonical: 'https://metehan-gezer.vercel.app/canli-sosyal-medya-nabzi',
  },
  openGraph: {
    title: 'Canlı Sosyal Medya Nabzı | BVA 2245 Gerçek Zamanlı Ürün',
    description:
      'Bluesky Jetstream WebSocket üzerinden Web Worker ile gerçek zamanlı etiket analitiği ve gizlilik öncelikli kayan pencereler.',
    url: 'https://metehan-gezer.vercel.app/canli-sosyal-medya-nabzi',
    siteName: 'Metehan Gezer Portfolyo',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function LivePulseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
