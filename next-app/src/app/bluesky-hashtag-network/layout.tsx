import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bluesky Turkish Hashtag Network: Büyük Ölçekli Sosyal Ağ Analizi | Metehan Gezer',
  description:
    'Bluesky platformunun Türkçe gönderi akışından toplanan 48 saatlik tarihsel arşiv (7.658 etiketli gönderi, 7.092 düğüm, 37.206 kenar) üzerinde Louvain algoritmasıyla topluluk tespiti ve ağ topolojisi analizi.',
  openGraph: {
    type: 'article',
    title: 'Bluesky Turkish Hashtag Network: Büyük Ölçekli Sosyal Ağ Analizi | Metehan Gezer',
    description:
      '48 saatlik tarihsel veri arşivi, 7.658 gönderi, 7.092 düğüm ve 37.206 kenar ile Türkçe dijital söylemin eş-oluşum ağı ve topluluk kümeleri.',
    images: ['/og-image.svg'],
  },
};

export default function BlueskyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
