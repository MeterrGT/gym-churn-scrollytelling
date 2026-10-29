export interface NavLink {
  label: string;
  href: string;
}

export interface Skill {
  id: string;
  icon: string;
  title: string;
  description: string;
  level: string;
  isPurple?: boolean;
  highlight?: boolean;
}

export interface ProjectTool {
  name: string;
  icon: string;
}

export interface ProjectData {
  id: string;
  badge: string;
  academicNote: string;
  title: string;
  subtitle: string;
  description: string;
  goal: {
    title: string;
    description: string;
  };
  tools: ProjectTool[];
  bottomStatus: string;
  contactMailSubject: string;
}

export interface BlueskyProjectData {
  id: string;
  badge: string;
  academicNote: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: {
    duration: string;
    posts: string;
    nodes: string;
    edges: string;
  };
  tools: ProjectTool[];
  deliverables: {
    interactive: string;
    report: string;
    poster: string;
    presentation: string;
    repository: string;
    caseStudyRoute: string;
  };
}

export interface LivePulseProjectData {
  id: string;
  badge: string;
  academicNote: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: {
    protocol: string;
    latency: string;
    windows: string;
    privacy: string;
  };
  tools: ProjectTool[];
  route: string;
  githubUrl: string;
}

export interface SocialLink {
  platform: string;
  handle: string;
  url: string;
  icon: string;
  type: 'instagram' | 'email' | 'linkedin' | 'github';
}

export interface ScrollyStep {
  step: number;
  badge: string;
  title: string;
  description: string;
  highlightMetric: string;
  status: 'normal' | 'warning' | 'critical';
  chartMode: 'bar' | 'lollipop' | 'heatmap' | 'heatmap-focus' | 'grouped-bar' | 'synthesis' | 'donut' | 'line' | string;
  highlightKey: string | null;
}

export const PORTFOLIO_DATA = {
  personal: {
    name: "Metehan Gezer",
    brandFirst: "Metehan",
    brandLast: ".Gezer",
    university: "Manisa Celal Bayar Üniversitesi",
    department: "Büyük Veri Analistliği",
    role: "Veri Analisti Adayı | MCBÜ Öğrencisi",
    typingSubtitles: "Büyük Veri Analistliği Öğrencisi | Veri Tutkunu",
    heroDescription:
      "Ham verinin içindeki gizli hikayeleri bulmak ve analitik yöntemlerle anlamlı içgörülere dönüştürmek için yola çıkmış bir veri tutkunuyum.",
    email: "gztmetehan@gmail.com",
    location: "Manisa Celal Bayar Üniversitesi, Manisa / Türkiye",
    copyright: "© 2026 Metehan Gezer. Tüm hakları saklıdır.",
  },

  // Fallback alias for any external scripts / extension callbacks referencing .profile
  profile: {
    name: "Metehan Gezer",
    brandFirst: "Metehan",
    brandLast: ".Gezer",
    university: "Manisa Celal Bayar Üniversitesi",
    department: "Büyük Veri Analistliği",
    role: "Veri Analisti Adayı | MCBÜ Öğrencisi",
    typingSubtitles: "Büyük Veri Analistliği Öğrencisi | Veri Tutkunu",
    heroDescription:
      "Ham verinin içindeki gizli hikayeleri bulmak ve analitik yöntemlerle anlamlı içgörülere dönüştürmek için yola çıkmış bir veri tutkunuyum.",
    email: "gztmetehan@gmail.com",
    location: "Manisa Celal Bayar Üniversitesi, Manisa / Türkiye",
    copyright: "© 2026 Metehan Gezer. Tüm hakları saklıdır.",
  },

  navLinks: [
    { label: "Ana Sayfa", href: "#hero" },
    { label: "Hakkımda", href: "#about" },
    { label: "Araçlar & Beceriler", href: "#skills" },
    { label: "Projelerim", href: "#projects" },
    { label: "İletişim", href: "#contact" },
  ] as NavLink[],

  about: {
    tag: "<biyografi>",
    title: "Hakkımda",
    paragraphs: [
      "Manisa Celal Bayar Üniversitesi Büyük Veri Analistliği programında eğitimime devam ediyorum. Veri bilimi dünyasına adım attığımdan bu yana; Python ve SQL temellerimi geliştiriyor, veriyi analiz etme ve anlamlandırma adımlarını öğreniyorum.",
      "Benim için veri, sadece sayılardan ibaret değil; doğru analiz edildiğinde geleceğe ışık tutan stratejik bir pusuladır. Günlük çalışmalarımda açık veri setlerini inceleyerek istatistiksel ve makine öğrenmesi modellerini kavramaya çalışıyorum. Amacım; endüstride karşılaşılan gerçek sorunlara veri odaklı, akılcı ve sürdürülebilir çözümler üretebilen bir analist olmaktır.",
    ],
    focusChips: [
      "Python & Veri Manipülasyonu",
      "İlişkisel Veri Tabanları (SQL)",
      "Temel Makine Öğrenmesi Mantığı",
      "Merak & Problem Çözme Odaklılık",
    ],
  },

  skills: [
    {
      id: "python",
      icon: "fa-brands fa-python",
      title: "Python",
      description: "Temel sözdizimi, veri işleme mantığı, Pandas ve NumPy ile veri analitiği.",
      level: "Aktif Kullanılıyor",
      highlight: true,
      isPurple: true,
    },
    {
      id: "pandas",
      icon: "fa-solid fa-table",
      title: "Pandas & NumPy",
      description: "Veri temizleme, filtreleme, pivot tablolar ve istatistiksel aggregate işlemleri.",
      level: "Aktif Kullanılıyor",
      highlight: true,
    },
    {
      id: "sql",
      icon: "fa-solid fa-database",
      title: "SQL",
      description: "İlişkisel veritabanı sorguları; SELECT, JOIN, filtreleme ve analitik gruplama.",
      level: "Geliştiriliyor",
    },
    {
      id: "ml",
      icon: "fa-solid fa-brain",
      title: "Machine Learning (Giriş)",
      description: "Regresyon, sınıflandırma, Scikit-learn ile modelleme ve churn tahmini.",
      level: "Öğreniliyor",
      isPurple: true,
    },
    {
      id: "react-vite",
      icon: "fa-brands fa-react",
      title: "React & Vite",
      description: "Modern bileşen mimarisi, hooks tabanlı reaktif durum yönetimi ve hızlı derleme.",
      level: "Kullanılıyor",
    },
    {
      id: "typescript",
      icon: "fa-brands fa-js",
      title: "TypeScript",
      description: "Tip güvenliği, arayüz tanımlamaları ve sürdürülebilir web uygulama geliştirme.",
      level: "Kullanılıyor",
    },
    {
      id: "d3",
      icon: "fa-solid fa-chart-pie",
      title: "D3.js & Scrollama",
      description: "Etkileşimli veri görselleştirme, scrollytelling ve dinamik SVG grafik üretimi.",
      level: "Kullanılıyor",
      isPurple: true,
    },
    {
      id: "kaggle",
      icon: "fa-brands fa-kaggle",
      title: "Kaggle & Jupyter",
      description: "Açık veri setlerini keşfetme, EDA hazırlama ve açık kaynaklı notebook çalışmaları.",
      level: "Pratik Alanı",
    },
  ] as Skill[],

  previousProjects: [
    {
      id: "predictive-maintenance",
      badge: "Kestirimci Bakım & IoT Simülasyonu",
      title: "Kestirimci Bakım Sistemleri ile Endüstride Arıza Önleme",
      subtitle: "(Motor Sıcaklığı & Arıza Riski Erken Uyarı Modeli)",
      description:
        "Endüstriyel motor sensör verileri üzerinde termal aşınma ve anomali tespiti. Kritik sıcaklık eşiklerini izleyerek arızaları önleyen makine öğrenmesi erken müdahale simülasyonu.",
      tools: [
        { name: "Python", icon: "fa-brands fa-python" },
        { name: "Pandas", icon: "fa-solid fa-table" },
        { name: "Scikit-learn", icon: "fa-solid fa-brain" },
        { name: "Jupyter", icon: "fa-solid fa-book" },
      ],
    },
    {
      id: "laptop-price-regression",
      badge: "Ekonometri & Çok Değişkenli Regresyon",
      title: "Laptop Fiyat Tahmini ve Ekonometrik Regresyon Analizi",
      subtitle: "(OLS En Küçük Kareler Regresyon Fiyat Simülatörü)",
      description:
        "Donanım bileşenlerinin (RAM, CPU Tier, GPU Tier) piyasa fiyatı üzerindeki marjinal etkilerini tahmin eden OLS regresyon modeli ve interaktif donanım simülatörü.",
      tools: [
        { name: "Python", icon: "fa-brands fa-python" },
        { name: "Statsmodels", icon: "fa-solid fa-chart-line" },
        { name: "Pandas", icon: "fa-solid fa-table" },
        { name: "React + Vite", icon: "fa-brands fa-react" },
      ],
    },
  ],

  project: {
    id: "gym-churn-prediction",
    badge: "Kaggle Büyük Veri Analizi • Dönem Sonu Projesi",
    academicNote: "Akademik Çalışma",
    title: "Gym Customers Features and Churn: Spor Salonu Terk Analizi",
    subtitle: "(Kaggle 4.000 Gözlemli Veri Seti & Analitik Hikaye)",
    description:
      "Kaggle'da yayımlanan 4.000 gözlemli Gym Customers Features and Churn veri seti üzerinde yapılan analiz; Python, Pandas ve D3.js ile gerçekleştirilmiş, yaş ve sözleşme süresine göre gözlemlenen terk örüntüleri incelenmiştir.",
    goal: {
      title: "Projenin Hedefi:",
      description:
        "Kaggle'da yayımlanan 4.000 gözlemli simüle eğitim veri setinde terk (churn) ile yaş ve sözleşme süresi arasındaki gözlemsel örüntüleri modellemek ve interaktif bir veri hikayesiyle sunmak.",
    },
    tools: [
      { name: "Python", icon: "fa-brands fa-python" },
      { name: "Pandas", icon: "fa-solid fa-table" },
      { name: "Scikit-learn", icon: "fa-solid fa-brain" },
      { name: "Jupyter", icon: "fa-solid fa-book" },
      { name: "Kaggle", icon: "fa-brands fa-kaggle" },
    ],
    bottomStatus: "Kaggle Gym Customers Features and Churn veri seti başarıyla incelendi, aggregate edildi ve modellendi.",
    contactMailSubject: "Gym Churn Projesi Hakkında",
  } as ProjectData,

  blueskyProject: {
    id: "bluesky-hashtag-network",
    badge: "Sosyal Ağ Analizi • SNA",
    academicNote: "Akademik Çalışma",
    title: "Bluesky Turkish Hashtag Network",
    subtitle: "(48 Saatlik Arşiv, 7.658 Gönderi, 7.092 Düğüm & 37.206 Kenar)",
    description:
      "Bluesky platformunun Türkçe gönderi akışından toplanan 48 saatlik tarihsel veri arşivi üzerinde gerçekleştirilen büyük ölçekli sosyal ağ analizi (SNA). Eş-zamanlı etiket ilişkileri (co-occurrence), Louvain modülerlik algoritmasıyla topluluk kümelenmesi ve derece merkeziyetleri modellenmiştir.",
    metrics: {
      duration: "48-hour Bluesky archive analysis",
      posts: "7,658 hashtag-bearing posts",
      nodes: "7,092 nodes",
      edges: "37,206 edges",
    },
    tools: [
      { name: "Python", icon: "fa-brands fa-python" },
      { name: "NetworkX", icon: "fa-solid fa-diagram-project" },
      { name: "Louvain Modularity", icon: "fa-solid fa-circle-nodes" },
      { name: "Gephi & D3.js", icon: "fa-solid fa-share-nodes" },
    ],
    deliverables: {
      interactive: "https://meterrgt.github.io/sosyal-ag-hashtag-analizi/interactive.html",
      report: "https://github.com/MeterrGT/sosyal-ag-hashtag-analizi/blob/main/deliverables/2516016026_METEHAN_GEZER_Rapor.pdf",
      poster: "https://github.com/MeterrGT/sosyal-ag-hashtag-analizi/blob/main/deliverables/hashtag_network_poster_A3.pdf",
      presentation: "https://github.com/MeterrGT/sosyal-ag-hashtag-analizi/blob/main/deliverables/2516016026_METEHAN_GEZER_Sunum.pdf",
      repository: "https://github.com/MeterrGT/sosyal-ag-hashtag-analizi",
      caseStudyRoute: "/bluesky-hashtag-network",
    },
  } as BlueskyProjectData,

  livePulseProject: {
    id: "canli-sosyal-medya-nabzi",
    badge: "BVA 2245 • Canlı Veri Ürünü",
    academicNote: "Gerçek Zamanlı Veri",
    title: "Canlı Sosyal Medya Nabzı: Bluesky Gerçek Zamanlı Akış & Trend Analizi",
    subtitle: "(WebSocket Jetstream, Web Worker, 5m/1h Kayan Pencere & Sıfır Veri Saklama)",
    description:
      "Bluesky genel post akışına (Jetstream WebSocket) doğrudan bağlanan ve Web Worker üzerinde UI dondurmadan çalışan gerçek zamanlı trend dinleme ürünü. 5 dakikalık ve 1 saatlik kayan pencerelerde etiket sayımı, dakikalık akış hızı zaman serisi ve %100 gizlilik odaklı mimari.",
    metrics: {
      protocol: "Bluesky Jetstream WebSocket",
      latency: "< 50ms Web Worker",
      windows: "5 Dk & 1 Saat Kayan Pencere",
      privacy: "%100 Ham Veri İmhası",
    },
    tools: [
      { name: "WebSocket (Jetstream)", icon: "fa-solid fa-bolt" },
      { name: "Web Worker", icon: "fa-solid fa-gears" },
      { name: "Rolling Window", icon: "fa-solid fa-clock-rotate-left" },
      { name: "React & SVG Charts", icon: "fa-brands fa-react" },
    ],
    route: "/canli-sosyal-medya-nabzi",
    githubUrl: "https://github.com/MeterrGT/gym-churn-scrollytelling",
  } as LivePulseProjectData,

  socialLinks: [
    {
      platform: "Instagram",
      handle: "@metehangezer",
      url: "https://www.instagram.com/metehangezer/?hl=tr",
      icon: "fa-brands fa-instagram",
      type: "instagram",
    },
    {
      platform: "Kişisel E-Posta",
      handle: "gztmetehan@gmail.com",
      url: "mailto:gztmetehan@gmail.com",
      icon: "fa-regular fa-envelope",
      type: "email",
    },
    {
      platform: "LinkedIn",
      handle: "Metehan Gezer",
      url: "https://www.linkedin.com/in/metehan-gezer-aa444b403/?isSelfProfile=true",
      icon: "fa-brands fa-linkedin-in",
      type: "linkedin",
    },
    {
      platform: "GitHub",
      handle: "MeterrGT",
      url: "https://github.com/MeterrGT",
      icon: "fa-brands fa-github",
      type: "github",
    },
  ] as SocialLink[],

  scrollySteps: [
    {
      step: 1,
      badge: "ADIM 1 / 6 • SÖZLEŞME SÜRELERİ",
      title: "Sözleşme Süresi Kategorilerine Göre Gözlemlenen Terk Oranları",
      description:
        "Kaggle'da yayımlanan 4.000 gözlemli Gym Customers Features and Churn veri seti üzerinde yapılan analizde; bu veri setinde en düşük gözlenen terk oranı 12 aylık sözleşme grubundadır (%2,40). 1 aylık sözleşmelerde gözlenen terk oranı %42,32 iken, 6 aylık sözleşmelerde %12,48'e, 12 aylık sözleşmelerde ise %2,40'a inmektedir (39,92 yüzde puanlık gözlemsel fark).",
      highlightMetric: "1 Ay: %42,32 • 6 Ay: %12,48 • 12 Ay: %2,40 (39,92 yüzde puan fark)",
      status: "normal",
      chartMode: "bar",
      highlightKey: "1",
    },
    {
      step: 2,
      badge: "ADIM 2 / 6 • YAŞ KATEGORİLERİ",
      title: "Yaş Gruplarına Göre Gözlemlenen Terk Dağılımı",
      description:
        "18 ile 41 yaş aralığındaki gözlemler incelendiğinde; 18-25 yaş grubunda terk oranı %61,94 ile en yüksek seviyede gözlemlenmektedir. Yaş grupları ilerledikçe gözlemlenen terk oranı düşmekte, 34+ yaş grubunda %3,31'e kadar gerilemektedir (Veri setindeki genel churn oranı: %26,5).",
      highlightMetric: "18-25: %61,94 • 26-29: %33,08 • 30-33: %12,60 • 34+: %3,31 (Genel Terk: %26,5)",
      status: "warning",
      chartMode: "lollipop",
      highlightKey: "18-25",
    },
    {
      step: 3,
      badge: "ADIM 3 / 6 • ETKİLEŞİM MATRİSİ",
      title: "Yaş Grubu ve Sözleşme Süresi Etkileşim Matrisi (12 Hücre)",
      description:
        "4 yaş grubu ile 3 sözleşme modelinin kesişimi incelendiğinde; 18-25 yaş grubunda 1 aylık pakette gözlemlenen terk oranı %78,20 iken, 12 aylık taahhüde sahip aynı yaş grubunda bu oran %6,10 olarak gözlemlenmiştir.",
      highlightMetric: "4 Yaş Grubu × 3 Sözleşme Tipi = 12 Hücrelik Gözlem Matrisi",
      status: "normal",
      chartMode: "heatmap",
      highlightKey: null,
    },
    {
      step: 4,
      badge: "ADIM 4 / 6 • UÇ NOKTALAR",
      title: "Zirve Risk (%78,20) ve En Düşük Terk Segmenti (%0,00)",
      description:
        "İncelenen veri setinde en yüksek terk oranı %78,20 ile 18-25 yaş grubunda 1 aylık sözleşme alanlarda (367 gözlemden 287'si terk); en düşük oran ise %0,00 ile 34+ yaş grubunda 12 aylık sözleşme alanlarda (112 gözlemden 0 terk) kaydedilmiştir.",
      highlightMetric: "Zirve: %78,20 (18-25 & 1 Ay) • En Düşük: %0,00 (34+ & 12 Ay) [78,20 pp Fark]",
      status: "critical",
      chartMode: "heatmap-focus",
      highlightKey: "18-25-1",
    },
    {
      step: 5,
      badge: "ADIM 5 / 6 • ÜYELİK SÜRESİ (LIFETIME)",
      title: "Lifetime kategorilerine göre gözlenen terk oranları",
      description:
        "Lifetime kategorilerine göre gözlenen terk oranları incelendiğinde; 0. ve 1. ay kategorilerinde terk oranının yüksek (%82,75 ve %49,11), 3+ ay kategorilerinde ise %10'un altında olduğu gözlemlenmektedir. Ancak bu analiz kesitsel bir dağılım olup zamana bağlı bir yaşam kalımı (survival/time-to-event) takibi değildir; ayrılma anının kesin kronolojisini kanıtlamaz veya ilk 90 günün doğrudan terke neden olduğunu iddia etmez.",
      highlightMetric: "Lifetime Kategorileri: 0. Ay: %82,75 → 3. Ay: %10,20 → 6+ Ay: %0,66 (Kesitsel Dağılım)",
      status: "normal",
      chartMode: "area",
      highlightKey: null,
    },
    {
      step: 6,
      badge: "ADIM 6 / 6 • KATILIM SIKLIĞI VE KISITLAR",
      title: "Haftalık Katılım, Sınırlılıklar ve Nedensellik Uyarısı",
      description:
        "Aktif kalan gözlemlerin son aydaki haftalık ortalama ders sıklığı 2,03 gün iken, terk eden grupta bu değer 1,04 gün olarak gözlemlenmiştir. Ancak uzun sözleşme veya yüksek katılım ile düşük terk arasındaki bu bağlantı korelasyoneldir; bireylerin motivasyon farkları (kendini seçme yanlılığı) gibi dışsal faktörler kontrol edilmeden nedensel bir sonuç çıkarılamaz.",
      highlightMetric: "Metodolojik İlke: Korelasyon ≠ Nedensellik • Katılım Sıklığı: 2,03 vs 1,04 Gün/Hafta",
      status: "warning",
      chartMode: "synthesis",
      highlightKey: null,
    },
  ] as ScrollyStep[],

  regressionModel: {
    basePrice: 280,
    ramBeta: 16,
    cpuBeta: 85,
    gpuBeta: 155,
    cpuDescriptions: {
      1: "Seviye 1 (Giriş Seviyesi)",
      2: "Seviye 2 (Temel i3 / Ryzen 3)",
      3: "Seviye 3 (Orta i5 / Ryzen 5)",
      4: "Seviye 4 (i5 Yüksek Performans)",
      5: "Seviye 5 (İleri i7 / Ryzen 7)",
      6: "Seviye 6 (i7 Güçlü Oyun/İş)",
      7: "Seviye 7 (Üst Düzey i9 / Ryzen 9)",
      8: "Seviye 8 (i9 H-Serisi Canavarı)",
      9: "Seviye 9 (Ultra İş İstasyonu)",
      10: "Seviye 10 (En Üst Düzey Donanım)",
    } as Record<number, string>,
    gpuDescriptions: {
      1: "Seviye 1 (Dahili Grafik - Iris Xe)",
      2: "Seviye 2 (Giriş Harici - MX Serisi)",
      3: "Seviye 3 (GTX 1650 / RTX 2050)",
      4: "Seviye 4 (RTX 3050 Güncel)",
      5: "Seviye 5 (RTX 4050 / RTX 4060)",
      6: "Seviye 6 (RTX 4070 Yüksek FPS)",
      7: "Seviye 7 (RTX 4080 Profesyonel)",
      8: "Seviye 8 (RTX 4080 Ti)",
      9: "Seviye 9 (RTX 4090 Taşınabilir Güç)",
      10: "Seviye 10 (RTX 4090 Seviyesi)",
    } as Record<number, string>,
  },

  easterEgg: {
    clickTarget: 5,
    timeoutMs: 3000,
    durationMs: 1800,
    lines: [
      "> SISTEM BOZULDU...",
      "> VERI ANALIZI DURDURULDU...",
      "> HACKER MODU AKTIF...",
      "> BILGI: CHURN RISKI YUKSEK SEGMENT TESPIT EDILDI...",
    ],
  },
};
