import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Canlı Sosyal Medya Nabzı Vaka Analizi: Gerçek Zamanlı Akış Mimarisi | Metehan Gezer',
  description:
    'Bluesky Jetstream WebSocket, Web Worker çok dilli agregasyon, kayan pencereler ve veri minimizasyonu ile geliştirilen BVA 2245 Canlı Sosyal Medya Nabzı ürününün detaylı vaka analizi, sistem mimarisi ve test bulguları.',
  openGraph: {
    type: 'article',
    title: 'Canlı Sosyal Medya Nabzı Vaka Analizi | Metehan Gezer',
    description:
      'Merkeziyetsiz sosyal medya protokolünde UI thread dondurmadan gerçek zamanlı trend izleme: Web Worker, 5m/1h kayan pencere ve %100 sıfır veri saklama mimarisi.',
    url: 'https://metehan-gezer.vercel.app/canli-sosyal-medya-nabzi/vaka-analizi',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: 'https://metehan-gezer.vercel.app/canli-sosyal-medya-nabzi/vaka-analizi',
  },
};

export default function LivePulseCaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
