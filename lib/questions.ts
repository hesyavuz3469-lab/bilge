export type Question = {
  id: string;
  question: string;
  options: string[];
  correct: number; // index of correct option
  explanation?: string;
};

export type Category = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  questions: Question[];
};

export const CATEGORIES: Category[] = [
  {
    id: "tarih",
    name: "Tarih",
    emoji: "🏛️",
    color: "#b45309",
    questions: [
      { id: "t1", question: "Osmanlı İmparatorluğu hangi yılda kuruldu?", options: ["1299", "1453", "1071", "1326"], correct: 0, explanation: "Osmanlı İmparatorluğu 1299'da Osman Bey tarafından kuruldu." },
      { id: "t2", question: "İstanbul'un fethi hangi yılda gerçekleşti?", options: ["1453", "1299", "1517", "1402"], correct: 0, explanation: "İstanbul 29 Mayıs 1453'te Fatih Sultan Mehmet tarafından fethedildi." },
      { id: "t3", question: "Türkiye Cumhuriyeti hangi yılda kuruldu?", options: ["1923", "1920", "1919", "1922"], correct: 0, explanation: "Türkiye Cumhuriyeti 29 Ekim 1923'te ilan edildi." },
      { id: "t4", question: "Kurtuluş Savaşı hangi yılda başladı?", options: ["1919", "1920", "1921", "1918"], correct: 0, explanation: "Kurtuluş Savaşı 19 Mayıs 1919'da başladı." },
      { id: "t5", question: "Malazgirt Savaşı hangi yılda yapıldı?", options: ["1071", "1096", "1176", "1243"], correct: 0, explanation: "Malazgirt Savaşı 1071'de Alparslan önderliğinde kazanıldı." },
      { id: "t6", question: "Anadolu'ya ilk Türk göçleri hangi dönemde başladı?", options: ["11. yüzyıl", "9. yüzyıl", "13. yüzyıl", "7. yüzyıl"], correct: 0 },
      { id: "t7", question: "Lozan Antlaşması hangi yılda imzalandı?", options: ["1923", "1920", "1922", "1925"], correct: 0 },
      { id: "t8", question: "Atatürk hangi yılda hayatını kaybetti?", options: ["1938", "1935", "1940", "1942"], correct: 0 },
      { id: "t9", question: "Kanuni Sultan Süleyman kaç yıl tahtta kaldı?", options: ["46", "30", "25", "52"], correct: 0 },
      { id: "t10", question: "İlk Türk devleti hangisidir?", options: ["Hun İmparatorluğu", "Göktürk", "Uygur", "Selçuklu"], correct: 0 },
      { id: "t11", question: "Çanakkale Savaşı hangi yılda başladı?", options: ["1915", "1914", "1916", "1917"], correct: 0 },
      { id: "t12", question: "Topkapı Sarayı hangi sultan tarafından yaptırıldı?", options: ["Fatih Sultan Mehmet", "Kanuni Sultan Süleyman", "Yavuz Sultan Selim", "II. Bayezid"], correct: 0 },
    ],
  },
  {
    id: "spor",
    name: "Spor",
    emoji: "⚽",
    color: "#16a34a",
    questions: [
      { id: "s1", question: "Türkiye'nin en çok şampiyonluk kazanan futbol kulübü hangisidir?", options: ["Galatasaray", "Fenerbahçe", "Beşiktaş", "Trabzonspor"], correct: 0 },
      { id: "s2", question: "FIFA Dünya Kupası kaç yılda bir düzenlenir?", options: ["4", "2", "3", "5"], correct: 0 },
      { id: "s3", question: "Olimpiyat Oyunları ilk kez hangi şehirde düzenlendi?", options: ["Atina", "Paris", "Londra", "Roma"], correct: 0 },
      { id: "s4", question: "Basketbolda bir maç kaç dakikadır?", options: ["40", "48", "36", "45"], correct: 0 },
      { id: "s5", question: "Türkiye 2002 Dünya Kupası'nda kaçıncı oldu?", options: ["3.", "4.", "2.", "Çeyrek final"], correct: 0 },
      { id: "s6", question: "Tenis'te 'Grand Slam' kaç turnuvadan oluşur?", options: ["4", "3", "5", "6"], correct: 0 },
      { id: "s7", question: "Voleybolda bir takımda kaç oyuncu sahadadır?", options: ["6", "5", "7", "8"], correct: 0 },
      { id: "s8", question: "Formül 1'de şampiyonluk rekoru kime aittir?", options: ["Lewis Hamilton", "Michael Schumacher", "Ayrton Senna", "Sebastian Vettel"], correct: 0 },
      { id: "s9", question: "Hakan Şükür'ün Dünya Kupası'nda attığı en hızlı gol kaç saniyedir?", options: ["11", "8", "15", "20"], correct: 0 },
      { id: "s10", question: "NBA'de en fazla şampiyonluk hangi takıma aittir?", options: ["Boston Celtics", "Los Angeles Lakers", "Chicago Bulls", "Golden State Warriors"], correct: 0 },
      { id: "s11", question: "Kriket en popüler olarak hangi ülkede oynanır?", options: ["Hindistan", "İngiltere", "Avustralya", "Pakistan"], correct: 0 },
      { id: "s12", question: "Tour de France hangi sporla ilgilidir?", options: ["Bisiklet", "Atletizm", "Yüzme", "Kayak"], correct: 0 },
    ],
  },
  {
    id: "bilim",
    name: "Bilim",
    emoji: "🔬",
    color: "#0891b2",
    questions: [
      { id: "b1", question: "Işığın havadaki hızı yaklaşık kaç km/s'dir?", options: ["300.000", "150.000", "500.000", "200.000"], correct: 0 },
      { id: "b2", question: "DNA'nın açılımı nedir?", options: ["Deoksiribo Nükleik Asit", "Dino Nükleik Asit", "Difüzyon Nükleik Asit", "Dinamik Nükleik Asit"], correct: 0 },
      { id: "b3", question: "Periyodik tabloda en hafif element hangisidir?", options: ["Hidrojen", "Helyum", "Lityum", "Oksijen"], correct: 0 },
      { id: "b4", question: "Evrenin yaşı yaklaşık kaç milyar yıldır?", options: ["13.8", "10", "20", "4.5"], correct: 0 },
      { id: "b5", question: "Hangi organ vücutta en fazla oksijen tüketir?", options: ["Beyin", "Kalp", "Karaciğer", "Akciğer"], correct: 0 },
      { id: "b6", question: "Güneş sisteminde kaç gezegen vardır?", options: ["8", "9", "7", "10"], correct: 0 },
      { id: "b7", question: "Suyun kimyasal formülü nedir?", options: ["H2O", "CO2", "NaCl", "O2"], correct: 0 },
      { id: "b8", question: "İnsanın vücudunda kaç kemik bulunur?", options: ["206", "208", "198", "214"], correct: 0 },
      { id: "b9", question: "Hangi gezegen güneş sisteminin en büyüğüdür?", options: ["Jüpiter", "Satürn", "Uranüs", "Neptün"], correct: 0 },
      { id: "b10", question: "Elektriği icat eden bilim insanı kimdir?", options: ["Benjamin Franklin", "Thomas Edison", "Nikola Tesla", "James Watt"], correct: 0 },
      { id: "b11", question: "Yerçekimi yasasını keşfeden bilim insanı kimdir?", options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"], correct: 0 },
      { id: "b12", question: "Fotosentez sürecinde bitkiler hangi gazı üretir?", options: ["Oksijen", "Karbondioksit", "Azot", "Hidrojen"], correct: 0 },
    ],
  },
  {
    id: "cografya",
    name: "Coğrafya",
    emoji: "🌍",
    color: "#059669",
    questions: [
      { id: "c1", question: "Türkiye'nin başkenti neresidir?", options: ["Ankara", "İstanbul", "İzmir", "Bursa"], correct: 0 },
      { id: "c2", question: "Dünyanın en uzun nehri hangisidir?", options: ["Nil", "Amazon", "Yangtze", "Mississippi"], correct: 0 },
      { id: "c3", question: "Dünyanın en yüksek dağı hangisidir?", options: ["Everest", "K2", "Kangchenjunga", "Makalu"], correct: 0 },
      { id: "c4", question: "Türkiye kaç komşu ülkeyle sınır paylaşır?", options: ["8", "6", "7", "9"], correct: 0 },
      { id: "c5", question: "Avrupa'nın en büyük ülkesi hangisidir?", options: ["Rusya", "Ukrayna", "Fransa", "Almanya"], correct: 0 },
      { id: "c6", question: "Dünyanın en büyük okyanusu hangisidir?", options: ["Pasifik", "Atlantik", "Hint", "Arktik"], correct: 0 },
      { id: "c7", question: "Türkiye'nin en uzun nehri hangisidir?", options: ["Kızılırmak", "Fırat", "Dicle", "Sakarya"], correct: 0 },
      { id: "c8", question: "Hangi şehir hem Asya hem Avrupa'da yer alır?", options: ["İstanbul", "Ankara", "Moskova", "Kahire"], correct: 0 },
      { id: "c9", question: "Amazon Ormanları hangi kıtadadır?", options: ["Güney Amerika", "Afrika", "Asya", "Avustralya"], correct: 0 },
      { id: "c10", question: "Japonya'nın başkenti neresidir?", options: ["Tokyo", "Osaka", "Kyoto", "Nagoya"], correct: 0 },
      { id: "c11", question: "Sahara Çölü hangi kıtadadır?", options: ["Afrika", "Asya", "Güney Amerika", "Avustralya"], correct: 0 },
      { id: "c12", question: "Türkiye'nin en büyük gölü hangisidir?", options: ["Van Gölü", "Tuz Gölü", "Beyşehir Gölü", "Eğirdir Gölü"], correct: 0 },
    ],
  },
  {
    id: "sinema",
    name: "Sinema",
    emoji: "🎬",
    color: "#7c3aed",
    questions: [
      { id: "si1", question: "Titanic filminde başrolü kim oynadı?", options: ["Leonardo DiCaprio", "Brad Pitt", "Tom Hanks", "Johnny Depp"], correct: 0 },
      { id: "si2", question: "En fazla Oscar kazanan film hangisidir?", options: ["Ben-Hur / Titanic / Lord of the Rings", "Avatar", "Schindler's List", "The Godfather"], correct: 0 },
      { id: "si3", question: "Star Wars serisini kim yönetti?", options: ["George Lucas", "Steven Spielberg", "James Cameron", "Christopher Nolan"], correct: 0 },
      { id: "si4", question: "Türk sinemasının babası olarak kim bilinir?", options: ["Yılmaz Güney", "Atıf Yılmaz", "Metin Erksan", "Lütfi Akad"], correct: 0 },
      { id: "si5", question: "Marvel Sinematik Evreni'nin ilk filmi hangisidir?", options: ["Iron Man", "Thor", "Captain America", "The Avengers"], correct: 0 },
      { id: "si6", question: "Inception filminin yönetmeni kimdir?", options: ["Christopher Nolan", "James Cameron", "Steven Spielberg", "Ridley Scott"], correct: 0 },
      { id: "si7", question: "Oscar ödülleri kaç yıldan beri verilmektedir?", options: ["95+", "50+", "70+", "80+"], correct: 0 },
      { id: "si8", question: "Şeytan filminin çıkış yılı nedir?", options: ["1973", "1968", "1980", "1975"], correct: 0 },
      { id: "si9", question: "The Godfather filminde Vito Corleone'yi kim oynadı?", options: ["Marlon Brando", "Al Pacino", "Robert De Niro", "Jack Nicholson"], correct: 0 },
      { id: "si10", question: "Türk yapımı ilk Oscar adayı film hangisidir?", options: ["Yol", "Sürü", "Umut", "Arkadaş"], correct: 0 },
      { id: "si11", question: "Jurassic Park filminde dinozorları kim canlandırıyordu?", options: ["CGI ve animatronik", "Gerçek dinozorlar", "Sadece CGI", "Kostümlü oyuncular"], correct: 0 },
      { id: "si12", question: "En yüksek hasılat yapan film hangisidir?", options: ["Avatar", "Avengers: Endgame", "Titanic", "Star Wars"], correct: 0 },
    ],
  },
  {
    id: "muzik",
    name: "Müzik",
    emoji: "🎵",
    color: "#db2777",
    questions: [
      { id: "m1", question: "Türk pop müziğinin babası olarak kim bilinir?", options: ["Barış Manço", "Cem Karaca", "Erkin Koray", "Sezen Aksu"], correct: 0 },
      { id: "m2", question: "Beatles hangi ülkeden çıkmıştır?", options: ["İngiltere", "ABD", "Avustralya", "Kanada"], correct: 0 },
      { id: "m3", question: "Mozart kaç yaşında hayatını kaybetti?", options: ["35", "40", "28", "45"], correct: 0 },
      { id: "m4", question: "Do Re Mi Fa Sol La Si kaç notadan oluşur?", options: ["7", "8", "5", "12"], correct: 0 },
      { id: "m5", question: "Türkiye'de en çok satış yapan sanatçı kimdir?", options: ["Sezen Aksu", "Tarkan", "Ajda Pekkan", "Müslüm Gürses"], correct: 0 },
      { id: "m6", question: "Michael Jackson'ın en çok satan albümü hangisidir?", options: ["Thriller", "Bad", "Dangerous", "Off the Wall"], correct: 0 },
      { id: "m7", question: "Beethoven kaç senfonisi vardır?", options: ["9", "7", "12", "6"], correct: 0 },
      { id: "m8", question: "Gitar kaç telden oluşur?", options: ["6", "4", "8", "5"], correct: 0 },
      { id: "m9", question: "Türk halk müziğinde kullanılan temel çalgı hangisidir?", options: ["Bağlama", "Ney", "Ud", "Kemençe"], correct: 0 },
      { id: "m10", question: "En fazla Grammy kazanan sanatçı kimdir?", options: ["Beyoncé", "Taylor Swift", "Michael Jackson", "Adele"], correct: 0 },
      { id: "m11", question: "Piyano kaç tuşa sahiptir?", options: ["88", "72", "76", "80"], correct: 0 },
      { id: "m12", question: "Rock müziğin doğduğu ülke hangisidir?", options: ["ABD", "İngiltere", "Avustralya", "Kanada"], correct: 0 },
    ],
  },
  {
    id: "yemek",
    name: "Yemek",
    emoji: "🍽️",
    color: "#ea580c",
    questions: [
      { id: "y1", question: "Türkiye'nin milli yemeği olarak kabul edilen yemek hangisidir?", options: ["Mercimek Çorbası", "Döner", "Kebap", "Baklava"], correct: 0 },
      { id: "y2", question: "Pizza hangi ülkeye aittir?", options: ["İtalya", "Fransa", "İspanya", "Yunanistan"], correct: 0 },
      { id: "y3", question: "Sushi hangi ülkeye aittir?", options: ["Japonya", "Çin", "Kore", "Tayland"], correct: 0 },
      { id: "y4", question: "Baklava hangi ülkelerin mutfağında yer alır?", options: ["Türkiye, Yunanistan, Orta Doğu", "Sadece Türkiye", "Sadece Yunanistan", "Balkanlar"], correct: 0 },
      { id: "y5", question: "Çikolata ilk olarak hangi kıtada kullanıldı?", options: ["Amerika", "Avrupa", "Asya", "Afrika"], correct: 0 },
      { id: "y6", question: "Türk kahvesi UNESCO listesine hangi yılda alındı?", options: ["2013", "2010", "2015", "2018"], correct: 0 },
      { id: "y7", question: "Hangi vitamin portakalda en fazla bulunur?", options: ["C vitamini", "A vitamini", "D vitamini", "B12 vitamini"], correct: 0 },
      { id: "y8", question: "Peynir hangi hayvanın sütünden yapılmaz?", options: ["Tavuk", "İnek", "Koyun", "Keçi"], correct: 0 },
      { id: "y9", question: "Türk mutfağında 'meze' ne demektir?", options: ["Küçük başlangıç yemekleri", "Ana yemek", "Tatlı", "İçecek"], correct: 0 },
      { id: "y10", question: "Hamburger hangi ülkeden çıkmıştır?", options: ["ABD", "Almanya", "İngiltere", "Fransa"], correct: 0 },
      { id: "y11", question: "Zeytinyağı en fazla hangi ülkede üretilir?", options: ["İspanya", "Türkiye", "İtalya", "Yunanistan"], correct: 0 },
      { id: "y12", question: "Türkiye hangi meyvenin anavatanıdır?", options: ["Kiraz", "Elma", "Kayısı", "İncir"], correct: 0 },
    ],
  },
  {
    id: "teknoloji",
    name: "Teknoloji",
    emoji: "💻",
    color: "#2563eb",
    questions: [
      { id: "tek1", question: "İnternetin mucidi kimdir?", options: ["Tim Berners-Lee", "Bill Gates", "Steve Jobs", "Mark Zuckerberg"], correct: 0 },
      { id: "tek2", question: "Apple'ı kim kurdu?", options: ["Steve Jobs", "Bill Gates", "Elon Musk", "Jeff Bezos"], correct: 0 },
      { id: "tek3", question: "İlk akıllı telefon hangi yılda tanıtıldı?", options: ["2007", "2004", "2010", "2001"], correct: 0 },
      { id: "tek4", question: "Google hangi yılda kuruldu?", options: ["1998", "2000", "1995", "2002"], correct: 0 },
      { id: "tek5", question: "CPU ne anlama gelir?", options: ["Central Processing Unit", "Computer Power Unit", "Core Processing Unit", "Central Power Unit"], correct: 0 },
      { id: "tek6", question: "En çok kullanılan programlama dili hangisidir?", options: ["Python", "Java", "JavaScript", "C++"], correct: 0 },
      { id: "tek7", question: "Bitcoin hangi yılda icat edildi?", options: ["2009", "2012", "2007", "2015"], correct: 0 },
      { id: "tek8", question: "Sosyal medyada en fazla kullanıcıya sahip platform hangisidir?", options: ["Facebook", "YouTube", "Instagram", "TikTok"], correct: 0 },
      { id: "tek9", question: "Tesla'nın CEO'su kimdir?", options: ["Elon Musk", "Jeff Bezos", "Bill Gates", "Tim Cook"], correct: 0 },
      { id: "tek10", question: "WiFi kelimesinin açılımı nedir?", options: ["Wireless Fidelity", "Wireless Finder", "Wide Fidelity", "Wire Free"], correct: 0 },
      { id: "tek11", question: "İlk bilgisayar virüsü hangi yılda ortaya çıktı?", options: ["1971", "1983", "1990", "1965"], correct: 0 },
      { id: "tek12", question: "Yapay zeka alanında en çok araştırma yapan şirket hangisidir?", options: ["Google", "Microsoft", "OpenAI", "Meta"], correct: 0 },
    ],
  },
];

export function getRandomQuestions(categoryId: string, count: number): Question[] {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return [];
  const shuffled = [...cat.questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getDailyQuestions(count: number = 10): { questions: Question[]; categoryIds: string[] } {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);

  const allQuestions: Question[] = [];
  const categoryIds: string[] = [];

  // Pick questions from each category proportionally
  const perCategory = Math.ceil(count / CATEGORIES.length);
  CATEGORIES.forEach((cat, idx) => {
    const seed = dayOfYear + idx * 100;
    const start = seed % cat.questions.length;
    for (let i = 0; i < perCategory && allQuestions.length < count; i++) {
      const q = cat.questions[(start + i) % cat.questions.length];
      allQuestions.push(q);
      if (!categoryIds.includes(cat.id)) categoryIds.push(cat.id);
    }
  });

  return { questions: allQuestions.slice(0, count), categoryIds };
}

export function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}
