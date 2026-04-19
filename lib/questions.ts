export type Question = {
  id: string;
  question: string;
  options: string[];
  correct: number;
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
      { id: "t1", question: "Osmanlı İmparatorluğu hangi yılda kuruldu?", options: ["1453", "1071", "1299", "1326"], correct: 2 },
      { id: "t2", question: "İstanbul'un fethi hangi yılda gerçekleşti?", options: ["1299", "1453", "1517", "1402"], correct: 1 },
      { id: "t3", question: "Türkiye Cumhuriyeti hangi yılda kuruldu?", options: ["1920", "1919", "1922", "1923"], correct: 3 },
      { id: "t4", question: "Kurtuluş Savaşı hangi yılda başladı?", options: ["1920", "1919", "1921", "1918"], correct: 1 },
      { id: "t5", question: "Malazgirt Savaşı hangi yılda yapıldı?", options: ["1096", "1176", "1243", "1071"], correct: 3 },
      { id: "t6", question: "Lozan Antlaşması hangi yılda imzalandı?", options: ["1920", "1922", "1923", "1925"], correct: 2 },
      { id: "t7", question: "Atatürk hangi yılda hayatını kaybetti?", options: ["1935", "1940", "1942", "1938"], correct: 3 },
      { id: "t8", question: "Kanuni Sultan Süleyman kaç yıl tahtta kaldı?", options: ["30", "25", "52", "46"], correct: 3 },
      { id: "t9", question: "İlk Türk devleti hangisidir?", options: ["Göktürk", "Uygur", "Selçuklu", "Hun İmparatorluğu"], correct: 3 },
      { id: "t10", question: "Çanakkale Savaşı hangi yılda başladı?", options: ["1914", "1916", "1917", "1915"], correct: 3 },
      { id: "t11", question: "Topkapı Sarayı hangi sultan tarafından yaptırıldı?", options: ["Kanuni Sultan Süleyman", "Yavuz Sultan Selim", "II. Bayezid", "Fatih Sultan Mehmet"], correct: 3 },
      { id: "t12", question: "Anadolu'ya ilk Türk göçleri hangi yüzyılda başladı?", options: ["9. yüzyıl", "13. yüzyıl", "7. yüzyıl", "11. yüzyıl"], correct: 3 },
    ],
  },
  {
    id: "spor",
    name: "Spor",
    emoji: "⚽",
    color: "#16a34a",
    questions: [
      { id: "s1", question: "FIFA Dünya Kupası kaç yılda bir düzenlenir?", options: ["2", "3", "5", "4"], correct: 3 },
      { id: "s2", question: "Olimpiyat Oyunları ilk kez hangi şehirde düzenlendi?", options: ["Paris", "Londra", "Roma", "Atina"], correct: 3 },
      { id: "s3", question: "Basketbolda bir maç kaç dakikadır?", options: ["48", "36", "45", "40"], correct: 3 },
      { id: "s4", question: "Türkiye 2002 Dünya Kupası'nda kaçıncı oldu?", options: ["4.", "2.", "Çeyrek final", "3."], correct: 3 },
      { id: "s5", question: "Tenis'te 'Grand Slam' kaç turnuvadan oluşur?", options: ["3", "5", "6", "4"], correct: 3 },
      { id: "s6", question: "Voleybolda bir takımda kaç oyuncu sahadadır?", options: ["5", "7", "8", "6"], correct: 3 },
      { id: "s7", question: "Hakan Şükür Dünya Kupası'nda en hızlı golü kaç saniyede attı?", options: ["8", "15", "20", "11"], correct: 3 },
      { id: "s8", question: "NBA'de en fazla şampiyonluk hangi takıma aittir?", options: ["Los Angeles Lakers", "Chicago Bulls", "Golden State Warriors", "Boston Celtics"], correct: 3 },
      { id: "s9", question: "Tour de France hangi sporla ilgilidir?", options: ["Atletizm", "Yüzme", "Kayak", "Bisiklet"], correct: 3 },
      { id: "s10", question: "Formül 1'de en fazla şampiyonluk kime aittir?", options: ["Michael Schumacher", "Ayrton Senna", "Sebastian Vettel", "Lewis Hamilton"], correct: 3 },
      { id: "s11", question: "Türkiye'nin en çok şampiyonluk kazanan futbol kulübü hangisidir?", options: ["Fenerbahçe", "Beşiktaş", "Trabzonspor", "Galatasaray"], correct: 3 },
      { id: "s12", question: "Kriket en popüler olarak hangi ülkede oynanır?", options: ["İngiltere", "Avustralya", "Pakistan", "Hindistan"], correct: 3 },
    ],
  },
  {
    id: "bilim",
    name: "Bilim",
    emoji: "🔬",
    color: "#0891b2",
    questions: [
      { id: "b1", question: "Işığın havadaki hızı yaklaşık kaç km/s'dir?", options: ["150.000", "500.000", "200.000", "300.000"], correct: 3 },
      { id: "b2", question: "Periyodik tabloda en hafif element hangisidir?", options: ["Helyum", "Lityum", "Oksijen", "Hidrojen"], correct: 3 },
      { id: "b3", question: "Evrenin yaşı yaklaşık kaç milyar yıldır?", options: ["10", "20", "4.5", "13.8"], correct: 3 },
      { id: "b4", question: "Güneş sisteminde kaç gezegen vardır?", options: ["9", "7", "10", "8"], correct: 3 },
      { id: "b5", question: "Suyun kimyasal formülü nedir?", options: ["CO2", "NaCl", "O2", "H2O"], correct: 3 },
      { id: "b6", question: "İnsanın vücudunda kaç kemik bulunur?", options: ["208", "198", "214", "206"], correct: 3 },
      { id: "b7", question: "Hangi gezegen güneş sisteminin en büyüğüdür?", options: ["Satürn", "Uranüs", "Neptün", "Jüpiter"], correct: 3 },
      { id: "b8", question: "Yerçekimi yasasını keşfeden bilim insanı kimdir?", options: ["Albert Einstein", "Galileo Galilei", "Stephen Hawking", "Isaac Newton"], correct: 3 },
      { id: "b9", question: "Fotosentez sürecinde bitkiler hangi gazı üretir?", options: ["Karbondioksit", "Azot", "Hidrojen", "Oksijen"], correct: 3 },
      { id: "b10", question: "Hangi organ vücutta en fazla oksijen tüketir?", options: ["Kalp", "Karaciğer", "Akciğer", "Beyin"], correct: 3 },
      { id: "b11", question: "DNA'nın açılımı nedir?", options: ["Dino Nükleik Asit", "Difüzyon Nükleik Asit", "Dinamik Nükleik Asit", "Deoksiribo Nükleik Asit"], correct: 3 },
      { id: "b12", question: "Elektriği icat eden bilim insanı kimdir?", options: ["Thomas Edison", "Nikola Tesla", "James Watt", "Benjamin Franklin"], correct: 3 },
    ],
  },
  {
    id: "cografya",
    name: "Coğrafya",
    emoji: "🌍",
    color: "#059669",
    questions: [
      { id: "c1", question: "Türkiye'nin başkenti neresidir?", options: ["İstanbul", "İzmir", "Bursa", "Ankara"], correct: 3 },
      { id: "c2", question: "Dünyanın en uzun nehri hangisidir?", options: ["Amazon", "Yangtze", "Mississippi", "Nil"], correct: 3 },
      { id: "c3", question: "Dünyanın en yüksek dağı hangisidir?", options: ["K2", "Kangchenjunga", "Makalu", "Everest"], correct: 3 },
      { id: "c4", question: "Türkiye kaç komşu ülkeyle sınır paylaşır?", options: ["6", "7", "9", "8"], correct: 3 },
      { id: "c5", question: "Dünyanın en büyük okyanusu hangisidir?", options: ["Atlantik", "Hint", "Arktik", "Pasifik"], correct: 3 },
      { id: "c6", question: "Türkiye'nin en uzun nehri hangisidir?", options: ["Fırat", "Dicle", "Sakarya", "Kızılırmak"], correct: 3 },
      { id: "c7", question: "Hangi şehir hem Asya hem Avrupa'da yer alır?", options: ["Ankara", "Moskova", "Kahire", "İstanbul"], correct: 3 },
      { id: "c8", question: "Amazon Ormanları hangi kıtadadır?", options: ["Afrika", "Asya", "Avustralya", "Güney Amerika"], correct: 3 },
      { id: "c9", question: "Japonya'nın başkenti neresidir?", options: ["Osaka", "Kyoto", "Nagoya", "Tokyo"], correct: 3 },
      { id: "c10", question: "Türkiye'nin en büyük gölü hangisidir?", options: ["Tuz Gölü", "Beyşehir Gölü", "Eğirdir Gölü", "Van Gölü"], correct: 3 },
      { id: "c11", question: "Sahara Çölü hangi kıtadadır?", options: ["Asya", "Güney Amerika", "Avustralya", "Afrika"], correct: 3 },
      { id: "c12", question: "Avrupa'nın en büyük ülkesi hangisidir?", options: ["Ukrayna", "Fransa", "Almanya", "Rusya"], correct: 3 },
    ],
  },
  {
    id: "sinema",
    name: "Sinema",
    emoji: "🎬",
    color: "#7c3aed",
    questions: [
      { id: "si1", question: "Titanic filminde başrolü kim oynadı?", options: ["Brad Pitt", "Tom Hanks", "Johnny Depp", "Leonardo DiCaprio"], correct: 3 },
      { id: "si2", question: "Star Wars serisini kim yönetti?", options: ["Steven Spielberg", "James Cameron", "Christopher Nolan", "George Lucas"], correct: 3 },
      { id: "si3", question: "Marvel Sinematik Evreni'nin ilk filmi hangisidir?", options: ["Thor", "Captain America", "The Avengers", "Iron Man"], correct: 3 },
      { id: "si4", question: "Inception filminin yönetmeni kimdir?", options: ["James Cameron", "Steven Spielberg", "Ridley Scott", "Christopher Nolan"], correct: 3 },
      { id: "si5", question: "The Godfather'da Vito Corleone'yi kim oynadı?", options: ["Al Pacino", "Robert De Niro", "Jack Nicholson", "Marlon Brando"], correct: 3 },
      { id: "si6", question: "Türk sinemasının babası olarak kim bilinir?", options: ["Atıf Yılmaz", "Metin Erksan", "Lütfi Akad", "Yılmaz Güney"], correct: 3 },
      { id: "si7", question: "Şeytan filminin çıkış yılı nedir?", options: ["1968", "1980", "1975", "1973"], correct: 3 },
      { id: "si8", question: "En yüksek hasılat yapan film hangisidir?", options: ["Avengers: Endgame", "Titanic", "Star Wars", "Avatar"], correct: 3 },
      { id: "si9", question: "Jurassic Park'ta dinozorlar nasıl canlandırıldı?", options: ["Gerçek dinozorlar", "Sadece CGI", "Kostümlü oyuncular", "CGI ve animatronik"], correct: 3 },
      { id: "si10", question: "Türk yapımı ilk Oscar adayı film hangisidir?", options: ["Sürü", "Umut", "Arkadaş", "Yol"], correct: 3 },
      { id: "si11", question: "Oscar ödülleri kaç yılı aşkın bir süredir verilmektedir?", options: ["50+", "70+", "80+", "95+"], correct: 3 },
      { id: "si12", question: "En fazla Oscar kazanan film hangisidir?", options: ["Avatar", "Schindler's List", "The Godfather", "Ben-Hur / Titanic / Lord of the Rings"], correct: 3 },
    ],
  },
  {
    id: "muzik",
    name: "Müzik",
    emoji: "🎵",
    color: "#db2777",
    questions: [
      { id: "m1", question: "Beatles hangi ülkeden çıkmıştır?", options: ["ABD", "Avustralya", "Kanada", "İngiltere"], correct: 3 },
      { id: "m2", question: "Mozart kaç yaşında hayatını kaybetti?", options: ["40", "28", "45", "35"], correct: 3 },
      { id: "m3", question: "Do Re Mi Fa Sol La Si kaç notadan oluşur?", options: ["8", "5", "12", "7"], correct: 3 },
      { id: "m4", question: "Michael Jackson'ın en çok satan albümü hangisidir?", options: ["Bad", "Dangerous", "Off the Wall", "Thriller"], correct: 3 },
      { id: "m5", question: "Beethoven kaç senfonisi vardır?", options: ["7", "12", "6", "9"], correct: 3 },
      { id: "m6", question: "Gitar kaç telden oluşur?", options: ["4", "8", "5", "6"], correct: 3 },
      { id: "m7", question: "Türk halk müziğinde kullanılan temel çalgı hangisidir?", options: ["Ney", "Ud", "Kemençe", "Bağlama"], correct: 3 },
      { id: "m8", question: "En fazla Grammy kazanan sanatçı kimdir?", options: ["Taylor Swift", "Michael Jackson", "Adele", "Beyoncé"], correct: 3 },
      { id: "m9", question: "Piyano kaç tuşa sahiptir?", options: ["72", "76", "80", "88"], correct: 3 },
      { id: "m10", question: "Rock müziğin doğduğu ülke hangisidir?", options: ["İngiltere", "Avustralya", "Kanada", "ABD"], correct: 3 },
      { id: "m11", question: "Türk pop müziğinin babası olarak kim bilinir?", options: ["Cem Karaca", "Erkin Koray", "Sezen Aksu", "Barış Manço"], correct: 3 },
      { id: "m12", question: "Türkiye'de en çok satış yapan sanatçı kimdir?", options: ["Ajda Pekkan", "Müslüm Gürses", "Tarkan", "Sezen Aksu"], correct: 3 },
    ],
  },
  {
    id: "yemek",
    name: "Yemek",
    emoji: "🍽️",
    color: "#ea580c",
    questions: [
      { id: "y1", question: "Pizza hangi ülkeye aittir?", options: ["Fransa", "İspanya", "Yunanistan", "İtalya"], correct: 3 },
      { id: "y2", question: "Sushi hangi ülkeye aittir?", options: ["Çin", "Kore", "Tayland", "Japonya"], correct: 3 },
      { id: "y3", question: "Çikolata ilk olarak hangi kıtada kullanıldı?", options: ["Avrupa", "Asya", "Afrika", "Amerika"], correct: 3 },
      { id: "y4", question: "Türk kahvesi UNESCO listesine hangi yılda alındı?", options: ["2010", "2015", "2018", "2013"], correct: 3 },
      { id: "y5", question: "Hangi vitamin portakalda en fazla bulunur?", options: ["A vitamini", "D vitamini", "B12 vitamini", "C vitamini"], correct: 3 },
      { id: "y6", question: "Peynir hangi hayvanın sütünden yapılmaz?", options: ["İnek", "Koyun", "Keçi", "Tavuk"], correct: 3 },
      { id: "y7", question: "Hamburger hangi ülkeden çıkmıştır?", options: ["Almanya", "İngiltere", "Fransa", "ABD"], correct: 3 },
      { id: "y8", question: "Zeytinyağı en fazla hangi ülkede üretilir?", options: ["Türkiye", "İtalya", "Yunanistan", "İspanya"], correct: 3 },
      { id: "y9", question: "Türkiye hangi meyvenin anavatanıdır?", options: ["Elma", "Kayısı", "İncir", "Kiraz"], correct: 3 },
      { id: "y10", question: "Türk mutfağında 'meze' ne demektir?", options: ["Ana yemek", "Tatlı", "İçecek", "Küçük başlangıç yemekleri"], correct: 3 },
      { id: "y11", question: "Baklava en yaygın olarak hangi mutfaklarda yer alır?", options: ["Sadece Türkiye", "Sadece Yunanistan", "Balkanlar", "Türkiye, Yunanistan, Orta Doğu"], correct: 3 },
      { id: "y12", question: "Türkiye'nin milli yemeği olarak kabul edilen yemek hangisidir?", options: ["Döner", "Kebap", "Baklava", "Mercimek Çorbası"], correct: 3 },
    ],
  },
  {
    id: "teknoloji",
    name: "Teknoloji",
    emoji: "💻",
    color: "#2563eb",
    questions: [
      { id: "tek1", question: "Apple'ı kim kurdu?", options: ["Bill Gates", "Elon Musk", "Jeff Bezos", "Steve Jobs"], correct: 3 },
      { id: "tek2", question: "İlk akıllı telefon hangi yılda tanıtıldı?", options: ["2004", "2010", "2001", "2007"], correct: 3 },
      { id: "tek3", question: "Google hangi yılda kuruldu?", options: ["2000", "1995", "2002", "1998"], correct: 3 },
      { id: "tek4", question: "CPU ne anlama gelir?", options: ["Computer Power Unit", "Core Processing Unit", "Central Power Unit", "Central Processing Unit"], correct: 3 },
      { id: "tek5", question: "Bitcoin hangi yılda icat edildi?", options: ["2012", "2007", "2015", "2009"], correct: 3 },
      { id: "tek6", question: "Tesla'nın CEO'su kimdir?", options: ["Jeff Bezos", "Bill Gates", "Tim Cook", "Elon Musk"], correct: 3 },
      { id: "tek7", question: "WiFi kelimesinin açılımı nedir?", options: ["Wireless Finder", "Wide Fidelity", "Wire Free", "Wireless Fidelity"], correct: 3 },
      { id: "tek8", question: "İnternetin mucidi kimdir?", options: ["Bill Gates", "Steve Jobs", "Mark Zuckerberg", "Tim Berners-Lee"], correct: 3 },
      { id: "tek9", question: "Sosyal medyada en fazla kullanıcıya sahip platform hangisidir?", options: ["YouTube", "Instagram", "TikTok", "Facebook"], correct: 3 },
      { id: "tek10", question: "İlk bilgisayar virüsü hangi yılda ortaya çıktı?", options: ["1983", "1990", "1965", "1971"], correct: 3 },
      { id: "tek11", question: "En çok kullanılan programlama dili hangisidir?", options: ["Java", "JavaScript", "C++", "Python"], correct: 3 },
      { id: "tek12", question: "Yapay zeka alanında öncü şirket hangisidir?", options: ["Microsoft", "Meta", "Apple", "Google"], correct: 3 },
    ],
  },
];

export function getRandomQuestions(categoryId: string, count: number): Question[] {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return [];
  const shuffled = [...cat.questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((q) => {
    // Shuffle options and update correct index
    const correctAnswer = q.options[q.correct];
    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
    return { ...q, options: shuffledOptions, correct: newCorrectIndex };
  });
}

export function getDailyQuestions(count: number = 10): { questions: Question[]; categoryIds: string[] } {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);

  const allQuestions: Question[] = [];
  const categoryIds: string[] = [];

  const perCategory = Math.ceil(count / CATEGORIES.length);
  CATEGORIES.forEach((cat, idx) => {
    const seed = dayOfYear + idx * 100;
    const start = seed % cat.questions.length;
    for (let i = 0; i < perCategory && allQuestions.length < count; i++) {
      const q = cat.questions[(start + i) % cat.questions.length];
      // Shuffle options for daily too
      const correctAnswer = q.options[q.correct];
      const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
      const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
      allQuestions.push({ ...q, options: shuffledOptions, correct: newCorrectIndex });
      if (!categoryIds.includes(cat.id)) categoryIds.push(cat.id);
    }
  });

  return { questions: allQuestions.slice(0, count), categoryIds };
}

export function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}
