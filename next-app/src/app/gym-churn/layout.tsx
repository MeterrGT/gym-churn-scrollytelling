import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sadakatin Bedeli: Spor Salonları Üyelerini Neden Kaybediyor? | Gym Churn Veri Hikayesi',
  description:
    "Kaggle üzerinde yayımlanan 4.000 gözlemlik kamuya açık veri setinde (%26,5 genel terk oranı) yaş, sözleşme süresi ve katılım ilişkisini inceleyen interaktif veri gazeteciliği çalışması.",
  openGraph: {
    type: 'article',
    title: 'Sadakatin Bedeli: Spor Salonları Üyelerini Neden Kaybediyor? | Metehan Gezer',
    description:
      'Kaggle 4.000 gözlemlik veri setinde (%26,5 genel terk oranı) sözleşme süresi ve yaş gruplarına göre terk örüntülerini inceleyen D3.js scrollytelling veri hikayesi.',
    images: ['/og-image.svg'],
  },
};

export default function GymChurnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
