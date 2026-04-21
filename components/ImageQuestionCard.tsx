"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ImageQuestion } from "@/lib/imageQuestions";

export type Difficulty = "kolay" | "orta" | "zor";

const MAX_TOKENS = 3;
const QUESTION_TIME = 30;

const DIFF_CONFIG = {
  kolay: {
    scratchRadius: 30,
    scratchLimit: 180,
    baseXP: [100, 70, 45, 25],
    tokenEmoji: "🪟",
    hintText: "🪟 Cam sileceğiyle kazı!",
    activeText: "Siliyorsun...",
    emptyText: "⚠️ Hakkın bitti — tahmin et!",
    coatColor: "#0d1f2d",
    accentColor: "rgba(56,189,248,0.35)",
    borderColor: "rgba(56,189,248,0.5)",
    glowColor: "rgba(56,189,248,0.2)",
  },
  orta: {
    scratchRadius: 24,
    scratchLimit: 260,
    baseXP: [150, 100, 65, 35],
    tokenEmoji: "🍃",
    hintText: "🍃 Yaprakları üfle!",
    activeText: "Üflüyorsun...",
    emptyText: "⚠️ Hakkın bitti — tahmin et!",
    coatColor: "#0f1a0d",
    accentColor: "rgba(134,239,172,0.35)",
    borderColor: "rgba(74,222,128,0.5)",
    glowColor: "rgba(74,222,128,0.2)",
  },
  zor: {
    scratchRadius: 19,
    scratchLimit: 340,
    baseXP: [250, 180, 120, 70],
    tokenEmoji: "⛏️",
    hintText: "⛏️ Kumu kaz!",
    activeText: "Kazıyorsun...",
    emptyText: "⚠️ Hakkın bitti — tahmin et!",
    coatColor: "#1a1505",
    accentColor: "rgba(251,191,36,0.35)",
    borderColor: "rgba(234,179,8,0.5)",
    glowColor: "rgba(234,179,8,0.2)",
  },
};

type Props = {
  question: ImageQuestion;
  questionIndex: number;
  totalQuestions: number;
  difficulty: Difficulty;
  onAnswer: (correct: boolean, xp: number) => void;
};

export default function ImageQuestionCard({ question, questionIndex, totalQuestions, difficulty, onAnswer }: Props) {
  const cfg = DIFF_CONFIG[difficulty];
  const coatCanvasRef = useRef<HTMLCanvasElement>(null);
  const toolCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const tokenScratchDist = useRef(0);
  const tokensLeftRef = useRef(MAX_TOKENS);
  const answeredRef = useRef(false);

  const [tokensLeft, setTokensLeft] = useState(MAX_TOKENS);
  const [tokensUsed, setTokensUsed] = useState(0);
  const [scratchingActive, setScratchingActive] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [imgReady, setImgReady] = useState(false);
  const [imgError, setImgError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const drawCoat = useCallback(() => {
    const canvas = coatCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width;
    const h = canvas.height;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, w, h);

    const rng = (() => { let s = 42; return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; }; })();

    if (difficulty === "kolay") {
      // ── Buğulu cam ──
      // 1. Koyu mavi-gri zemin
      ctx.fillStyle = "#0a1520";
      ctx.fillRect(0, 0, w, h);

      // 2. Buğu tabakası — açık gri-beyaz (gerçek buğulu cam rengi)
      const fogGrad = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.5, w * 0.8);
      fogGrad.addColorStop(0, "rgba(215,230,245,0.72)");
      fogGrad.addColorStop(0.5, "rgba(190,215,235,0.60)");
      fogGrad.addColorStop(1, "rgba(150,185,215,0.40)");
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, 0, w, h);

      // 3. Cam yüzeyindeki nem lekeleri (büyük bulanık lekeler)
      for (let i = 0; i < 18; i++) {
        const bx = rng() * w;
        const by = rng() * h;
        const br = 30 + rng() * 80;
        const bg2 = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        bg2.addColorStop(0, "rgba(220,240,255,0.22)");
        bg2.addColorStop(1, "rgba(220,240,255,0)");
        ctx.fillStyle = bg2;
        ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
      }

      // 4. Gerçekçi su damlacıkları
      for (let i = 0; i < 90; i++) {
        const dx = rng() * w;
        const dy = rng() * h;
        const dr = 3 + rng() * 14;
        const elongate = 1 + rng() * 0.8; // dikey uzama (yerçekimi etkisi)
        ctx.save();
        ctx.translate(dx, dy);
        // Damla gövdesi
        const dGrad = ctx.createRadialGradient(-dr * 0.25, -dr * 0.3, 0, 0, 0, dr);
        dGrad.addColorStop(0, "rgba(255,255,255,0.75)");
        dGrad.addColorStop(0.4, "rgba(180,220,255,0.55)");
        dGrad.addColorStop(1, "rgba(100,160,220,0.30)");
        ctx.fillStyle = dGrad;
        ctx.beginPath();
        ctx.ellipse(0, dr * 0.1 * elongate, dr * 0.8, dr * elongate, 0, 0, Math.PI * 2);
        ctx.fill();
        // Damla parlaması
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.beginPath();
        ctx.ellipse(-dr * 0.2, -dr * 0.2, dr * 0.2, dr * 0.12, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Aşağı süzülen damla izleri
      ctx.strokeStyle = "rgba(180,220,255,0.25)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 12; i++) {
        const tx = rng() * w;
        const ty = rng() * h * 0.5;
        const tlen = 20 + rng() * 70;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.bezierCurveTo(tx + (rng() - 0.5) * 8, ty + tlen * 0.3, tx + (rng() - 0.5) * 8, ty + tlen * 0.7, tx + (rng() - 0.5) * 5, ty + tlen);
        ctx.stroke();
      }

      // 6. Metin
      ctx.fillStyle = "rgba(210,240,255,0.7)";
      ctx.font = "bold 17px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(56,189,248,0.8)";
      ctx.shadowBlur = 12;
      ctx.fillText("🪟  CAM SİLECEĞİ  🪟", w / 2, h / 2);
      ctx.shadowBlur = 0;

    } else if (difficulty === "orta") {
      // ── Sonbahar yaprakları ──
      // 1. Zemin: koyu toprak
      ctx.fillStyle = "#2a1a08";
      ctx.fillRect(0, 0, w, h);

      // 2. Zemin dokusu
      for (let i = 0; i < 800; i++) {
        const nx = rng() * w;
        const ny = rng() * h;
        ctx.fillStyle = `rgba(${80 + Math.round(rng() * 50)},${50 + Math.round(rng() * 30)},${15 + Math.round(rng() * 20)},${0.2 + rng() * 0.25})`;
        ctx.beginPath(); ctx.arc(nx, ny, 0.8 + rng() * 2, 0, Math.PI * 2); ctx.fill();
      }

      // 3. Yapraklar — gerçekçi bezier yaprak şekli
      const leafColors = [
        [215, 30, 30],   // parlak kırmızı
        [230, 75, 8],    // canlı turuncu
        [210, 155, 0],   // altın sarısı
        [145, 55, 10],   // kahve
        [170, 90, 5],    // koyu turuncu
        [190, 20, 20],   // koyu kırmızı
        [90, 150, 15],   // yeşil
        [190, 130, 15],  // amber
      ];

      const drawLeaf = (lx: number, ly: number, size: number, angle: number, color: number[]) => {
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(angle);
        const alpha = 0.65 + rng() * 0.3;
        // Yaprak dolgusu — bezier eğrisi ile gerçekçi yaprak
        const lGrad = ctx.createLinearGradient(-size, 0, size, 0);
        lGrad.addColorStop(0, `rgba(${color[0]},${color[1]},${color[2]},${alpha})`);
        lGrad.addColorStop(0.5, `rgba(${Math.min(color[0]+30,255)},${Math.min(color[1]+20,255)},${color[2]},${alpha})`);
        lGrad.addColorStop(1, `rgba(${color[0]},${color[1]},${color[2]},${alpha * 0.7})`);
        ctx.fillStyle = lGrad;
        ctx.beginPath();
        ctx.moveTo(0, -size); // tepe
        ctx.bezierCurveTo(size * 0.9, -size * 0.6, size * 1.1, size * 0.1, 0, size * 0.4); // sağ kenar
        ctx.bezierCurveTo(-size * 1.1, size * 0.1, -size * 0.9, -size * 0.6, 0, -size); // sol kenar
        ctx.fill();
        // Ana damar
        ctx.strokeStyle = `rgba(${color[0] - 30},${color[1] - 20},${color[2]},${alpha * 0.6})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(0, -size); ctx.lineTo(0, size * 0.3); ctx.stroke();
        // Yan damarlar
        ctx.lineWidth = 0.5;
        for (let v = -3; v <= 3; v++) {
          const vy = -size * 0.5 + v * size * 0.2;
          const vlen = size * 0.4 * (1 - Math.abs(v) * 0.2);
          ctx.beginPath(); ctx.moveTo(0, vy); ctx.lineTo(vlen, vy + vlen * 0.4); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, vy); ctx.lineTo(-vlen, vy + vlen * 0.4); ctx.stroke();
        }
        // Sap
        ctx.strokeStyle = `rgba(${color[0]-20},${color[1]-10},${color[2]},${alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, size * 0.3); ctx.lineTo(0, size * 0.9); ctx.stroke();
        ctx.restore();
      };

      // 100+ yaprak
      for (let i = 0; i < 110; i++) {
        const lx = rng() * (w + 40) - 20;
        const ly = rng() * (h + 40) - 20;
        const ls = 14 + rng() * 28;
        const la = rng() * Math.PI * 2;
        const lc = leafColors[Math.floor(rng() * leafColors.length)];
        drawLeaf(lx, ly, ls, la, lc);
      }

      // 4. Metin
      ctx.fillStyle = "rgba(253,224,71,0.85)";
      ctx.font = "bold 17px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(234,88,12,0.9)";
      ctx.shadowBlur = 14;
      ctx.fillText("🍃  FAN MAKİNESİ  🍃", w / 2, h / 2);
      ctx.shadowBlur = 0;

    } else {
      // ── Kum zemin ──
      // 1. Gerçek kum rengi zemin (sahil kumu)
      ctx.fillStyle = "#c8a84b";
      ctx.fillRect(0, 0, w, h);

      // 2. Kum gradient — ışık/gölge geçişi
      const sandGrad = ctx.createLinearGradient(0, 0, w, h);
      sandGrad.addColorStop(0, "rgba(240,200,110,0.55)");
      sandGrad.addColorStop(0.35, "rgba(200,165,75,0.35)");
      sandGrad.addColorStop(0.7, "rgba(180,140,55,0.45)");
      sandGrad.addColorStop(1, "rgba(155,115,40,0.55)");
      ctx.fillStyle = sandGrad;
      ctx.fillRect(0, 0, w, h);

      // 3. Kum dalgalanmaları (rüzgar çizgileri)
      for (let row = 0; row < 22; row++) {
        const ry = (h / 22) * row + rng() * 8;
        const amplitude = 4 + rng() * 8;
        const freq = 0.008 + rng() * 0.012;
        const phase = rng() * Math.PI * 2;
        const alpha = 0.12 + rng() * 0.18;
        ctx.strokeStyle = row % 2 === 0
          ? `rgba(240,200,110,${alpha})`
          : `rgba(130,90,30,${alpha * 0.7})`;
        ctx.lineWidth = 1 + rng() * 1.5;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 3) {
          const y = ry + Math.sin(x * freq + phase) * amplitude;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // 4. Kum tanesi dokusu — görünür boyutlarda
      for (let i = 0; i < 1800; i++) {
        const sx = rng() * w;
        const sy = rng() * h;
        const sr = 0.8 + rng() * 2.2;
        const r = 190 + Math.round(rng() * 50);
        const g = 150 + Math.round(rng() * 45);
        const b = 55 + Math.round(rng() * 40);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.35 + rng() * 0.45})`;
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
      }

      // 5. Küçük kaya/taş parçaları
      for (let i = 0; i < 25; i++) {
        const rx2 = rng() * w;
        const ry2 = rng() * h;
        const rr2 = 2.5 + rng() * 6;
        ctx.fillStyle = `rgba(${120 + Math.round(rng() * 60)},${95 + Math.round(rng() * 40)},${45 + Math.round(rng() * 30)},0.65)`;
        ctx.beginPath();
        ctx.ellipse(rx2, ry2, rr2, rr2 * (0.6 + rng() * 0.6), rng() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Kürek izi — çapraz düz çizgiler
      ctx.strokeStyle = "rgba(100,65,15,0.25)";
      ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) {
        const sx2 = rng() * w * 0.8;
        const sy2 = rng() * h * 0.8;
        ctx.beginPath();
        ctx.moveTo(sx2, sy2);
        ctx.lineTo(sx2 + 40 + rng() * 60, sy2 + 20 + rng() * 40);
        ctx.stroke();
      }

      // 7. Metin
      ctx.fillStyle = "rgba(255,220,100,0.85)";
      ctx.font = "bold 17px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(160,100,10,0.9)";
      ctx.shadowBlur = 14;
      ctx.fillText("⛏️  KUM ZEMİN  ⛏️", w / 2, h / 2);
      ctx.shadowBlur = 0;
    }
  }, [difficulty]);

  useEffect(() => {
    setTokensLeft(MAX_TOKENS);
    setTokensUsed(0);
    setScratchingActive(false);
    setSelected(null);
    setCorrect(null);
    setTimeLeft(QUESTION_TIME);
    setImgReady(false);
    setImgError(false);
    answeredRef.current = false;
    tokensLeftRef.current = MAX_TOKENS;
    isDrawing.current = false;
    lastPos.current = null;
    tokenScratchDist.current = 0;
    drawCoat();
  }, [question.id, drawCoat]);

  useEffect(() => {
    if (selected !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          if (!answeredRef.current) { answeredRef.current = true; setTimeout(() => onAnswer(false, 0), 300); }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current!); };
  }, [question.id, selected, onAnswer]);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    let cx: number, cy: number;
    if ("touches" in e) { cx = e.touches[0].clientX; cy = e.touches[0].clientY; }
    else { cx = e.clientX; cy = e.clientY; }
    return { x: (cx - rect.left) * sx, y: (cy - rect.top) * sy };
  };

  const clearTool = useCallback(() => {
    const c = toolCanvasRef.current;
    if (!c) return;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
  }, []);

  const drawTool = useCallback((x: number, y: number, angle: number) => {
    const c = toolCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);

    if (difficulty === "kolay") {
      // ── Gerçek cam silecek bıçağı ──
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2); // bıçak harekete dik durur

      const bW = 92; // bıçak uzunluğu

      // Metal kol (merkeze bağlantı)
      const armGrad = ctx.createLinearGradient(-3, -40, 3, -40);
      armGrad.addColorStop(0, "#6a8090"); armGrad.addColorStop(0.5, "#a0bcd0"); armGrad.addColorStop(1, "#5a7080");
      ctx.fillStyle = armGrad;
      ctx.beginPath(); ctx.roundRect(-3, -40, 6, 34, 2); ctx.fill();

      // Yatay metal tutucu
      ctx.fillStyle = "#7090a8";
      ctx.beginPath(); ctx.roundRect(-bW / 2 + 6, -10, bW - 12, 5, 2); ctx.fill();

      // Kauçuk bıçak gövdesi
      const bladeGrad = ctx.createLinearGradient(0, -6, 0, 9);
      bladeGrad.addColorStop(0, "#4a4a4a"); bladeGrad.addColorStop(0.5, "#2e2e2e"); bladeGrad.addColorStop(1, "#1a1a1a");
      ctx.fillStyle = bladeGrad;
      ctx.beginPath(); ctx.roundRect(-bW / 2, -6, bW, 14, [2, 2, 3, 3]); ctx.fill();

      // Kauçuk kesici kenar (alt)
      ctx.fillStyle = "#111";
      ctx.beginPath(); ctx.roundRect(-bW / 2 + 3, 6, bW - 6, 3, 1); ctx.fill();

      // Metalik parlaklık
      const sheen = ctx.createLinearGradient(0, -6, 0, 2);
      sheen.addColorStop(0, "rgba(255,255,255,0.18)"); sheen.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sheen;
      ctx.beginPath(); ctx.roundRect(-bW / 2, -6, bW, 8, 2); ctx.fill();

      ctx.restore();

    } else if (difficulty === "orta") {
      // ── Gerçek fön makinesi ──
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle); // hareket yönüne doğru uzanır

      // Ana gövde
      const bodyGrad = ctx.createLinearGradient(-15, -13, -15, 13);
      bodyGrad.addColorStop(0, "#6070a0"); bodyGrad.addColorStop(0.4, "#8090c0"); bodyGrad.addColorStop(1, "#3a4870");
      ctx.fillStyle = bodyGrad;
      ctx.beginPath(); ctx.roundRect(-16, -13, 46, 26, [9, 5, 5, 9]); ctx.fill();

      // Gövde üst parlama
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath(); ctx.roundRect(-15, -12, 44, 10, [8, 4, 0, 0]); ctx.fill();

      // Nozul (ön çıkış)
      ctx.fillStyle = "#5060a0";
      ctx.beginPath(); ctx.roundRect(28, -8, 22, 16, [2, 7, 7, 2]); ctx.fill();

      // Nozul ağzı
      ctx.fillStyle = "#1a2050";
      ctx.beginPath(); ctx.roundRect(47, -6, 4, 12, 2); ctx.fill();

      // Sap
      const handleGrad = ctx.createLinearGradient(-6, 12, 12, 12);
      handleGrad.addColorStop(0, "#3a4870"); handleGrad.addColorStop(0.5, "#6070a0"); handleGrad.addColorStop(1, "#2a3860");
      ctx.fillStyle = handleGrad;
      ctx.beginPath(); ctx.roundRect(-9, 12, 20, 30, [2, 2, 7, 7]); ctx.fill();

      // Arka fan ızgarası
      ctx.strokeStyle = "#1a2050"; ctx.lineWidth = 1.5;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath(); ctx.moveTo(-14, i * 3.8); ctx.lineTo(-7, i * 3.8); ctx.stroke();
      }

      // Hava akışı çizgileri
      const airColors = ["rgba(180,220,255,0.8)", "rgba(160,200,255,0.65)", "rgba(140,180,255,0.5)", "rgba(120,170,255,0.4)", "rgba(100,155,255,0.3)"];
      for (let i = 0; i < 5; i++) {
        const lx0 = 53 + (i % 2) * 5;
        const ly0 = -9 + i * 4.5;
        ctx.strokeStyle = airColors[i]; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(lx0, ly0);
        ctx.bezierCurveTo(lx0 + 10, ly0 - 1, lx0 + 18, ly0 + 1, lx0 + 26, ly0);
        ctx.stroke();
      }

      ctx.restore();

    } else {
      // ── Gerçek kürek ──
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2); // sap yukarı, kepçe aşağıda (cursor'da)

      // Ahşap sap
      const woodGrad = ctx.createLinearGradient(-5, -95, 5, -95);
      woodGrad.addColorStop(0, "#7a4018"); woodGrad.addColorStop(0.35, "#c47830"); woodGrad.addColorStop(0.65, "#a05820"); woodGrad.addColorStop(1, "#6a3612");
      ctx.fillStyle = woodGrad;
      ctx.beginPath(); ctx.roundRect(-4, -95, 8, 77, 3); ctx.fill();

      // Ahşap desen çizgileri
      ctx.strokeStyle = "rgba(80,35,5,0.35)"; ctx.lineWidth = 0.6;
      for (let i = 0; i < 6; i++) {
        const gy = -90 + i * 13;
        ctx.beginPath(); ctx.moveTo(-3.5, gy); ctx.lineTo(2, gy + 9); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(3.5, gy + 4); ctx.lineTo(-2, gy + 11); ctx.stroke();
      }

      // Metal soket (sap-kepçe bağlantısı)
      const socketGrad = ctx.createLinearGradient(-8, -22, 8, -22);
      socketGrad.addColorStop(0, "#555"); socketGrad.addColorStop(0.4, "#ccc"); socketGrad.addColorStop(1, "#444");
      ctx.fillStyle = socketGrad;
      ctx.beginPath(); ctx.roundRect(-8, -22, 16, 22, 2); ctx.fill();

      // Soket çemberi çizgisi
      ctx.strokeStyle = "#333"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(-8, -16); ctx.lineTo(8, -16); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-8, -9); ctx.lineTo(8, -9); ctx.stroke();

      // Kepçe D-şekli
      const bW2 = 40;
      const bladeMetal = ctx.createLinearGradient(-bW2 / 2, -2, bW2 / 2, 24);
      bladeMetal.addColorStop(0, "#909090"); bladeMetal.addColorStop(0.2, "#d8d8d8"); bladeMetal.addColorStop(0.6, "#b0b0b0"); bladeMetal.addColorStop(1, "#686868");
      ctx.fillStyle = bladeMetal;
      ctx.beginPath();
      ctx.moveTo(-bW2 / 2, 24);
      ctx.lineTo(bW2 / 2, 24);
      ctx.arc(0, 0, bW2 / 2, 0, Math.PI, true);
      ctx.closePath();
      ctx.fill();

      // Kepçe kenar çizgisi
      ctx.strokeStyle = "#e8e8e8"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-bW2 / 2 + 2, 24); ctx.lineTo(bW2 / 2 - 2, 24); ctx.stroke();

      // Kepçede kum
      ctx.fillStyle = "rgba(200,168,72,0.8)";
      ctx.beginPath(); ctx.ellipse(0, 16, bW2 / 2 - 5, 7, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(220,185,90,0.55)";
      ctx.beginPath(); ctx.ellipse(-4, 13, 9, 4, -0.4, 0, Math.PI * 2); ctx.fill();
      // Kum tanecikleri
      ctx.fillStyle = "rgba(180,145,55,0.7)";
      for (let i = 0; i < 8; i++) {
        const sx = -14 + i * 4 + (i % 2) * 2;
        const sy = 12 + (i % 3) * 3;
        ctx.beginPath(); ctx.arc(sx, sy, 1.2, 0, Math.PI * 2); ctx.fill();
      }

      ctx.restore();
    }
  }, [difficulty]);

  const scratch = useCallback((x: number, y: number) => {
    const canvas = coatCanvasRef.current;
    if (!canvas || tokensLeftRef.current <= 0) return;
    const ctx = canvas.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";

    const prev = lastPos.current;
    const dx = prev ? x - prev.x : 0;
    const dy = prev ? y - prev.y : 0;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = dist > 0 ? Math.atan2(dy, dx) : 0;

    drawTool(x, y, angle);

    if (difficulty === "kolay") {
      // ── Cam silecek — kesintisiz düz bant ──
      const bladeW = cfg.scratchRadius * 3.5;
      const bladeH = cfg.scratchRadius * 0.6;
      const perpAngle = angle + Math.PI / 2;
      const hw = bladeW / 2;

      if (prev && dist > 0) {
        // Önceki ve mevcut bıçak konumları arasındaki dörtgeni doldur → boşluksuz süpürme
        ctx.beginPath();
        ctx.moveTo(prev.x + Math.cos(perpAngle) * hw, prev.y + Math.sin(perpAngle) * hw);
        ctx.lineTo(prev.x - Math.cos(perpAngle) * hw, prev.y - Math.sin(perpAngle) * hw);
        ctx.lineTo(x - Math.cos(perpAngle) * hw,      y - Math.sin(perpAngle) * hw);
        ctx.lineTo(x + Math.cos(perpAngle) * hw,      y + Math.sin(perpAngle) * hw);
        ctx.closePath();
        ctx.fill();
      }
      // Mevcut konum bıçak ucu
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(perpAngle);
      ctx.beginPath();
      ctx.roundRect(-hw, -bladeH / 2, bladeW, bladeH, 2);
      ctx.fill();
      ctx.restore();

    } else if (difficulty === "orta") {
      // ── Fön — küçük koni ──
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      const coneLen = cfg.scratchRadius * 1.6; // küçültüldü
      const coneAngle = Math.PI / 8;           // daraltıldı (22°)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(-coneAngle) * coneLen, Math.sin(-coneAngle) * coneLen);
      ctx.arc(0, 0, coneLen, -coneAngle, coneAngle);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, cfg.scratchRadius * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

    } else {
      // ── Kürek kepçesi ──
      // D şekli: düz keskin alt kenar + yarım daire üst
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2); // kepçe harekete dik tutulur
      const sW = cfg.scratchRadius * 2.2;  // kepçe genişliği
      // Kepçe — alt düz kenar + üst yarım daire
      ctx.beginPath();
      ctx.moveTo(-sW / 2, 0);             // sol alt köşe (keskin kenar)
      ctx.lineTo(sW / 2, 0);              // sağ alt köşe
      ctx.arc(0, 0, sW / 2, 0, Math.PI, true); // üst yarım daire
      ctx.closePath();
      ctx.fill();
      // Kepçenin kazıma derinliği — itme yönünde dikdörtgen
      if (dist > 0) {
        ctx.rotate(-Math.PI / 2);
        const pushLen = Math.min(dist + 4, 20);
        ctx.fillRect(-sW / 2, -pushLen, sW, pushLen);
      }
      ctx.restore();
    }

    if (lastPos.current) {
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      tokenScratchDist.current += Math.sqrt(dx * dx + dy * dy);
      if (tokenScratchDist.current >= cfg.scratchLimit) {
        isDrawing.current = false;
        lastPos.current = null;
        tokenScratchDist.current = 0;
        const rem = tokensLeftRef.current - 1;
        tokensLeftRef.current = rem;
        setTokensLeft(rem);
        setTokensUsed((u) => u + 1);
        setScratchingActive(false);
        return;
      }
    }
    lastPos.current = { x, y };
  }, [cfg.scratchLimit, cfg.scratchRadius, difficulty, drawTool]);

  const startScratch = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!coatCanvasRef.current || tokensLeftRef.current <= 0 || selected !== null || !imgReady) return;
    e.preventDefault();
    isDrawing.current = true;
    setScratchingActive(true);
    const pos = getPos(e, coatCanvasRef.current);
    lastPos.current = pos;
    scratch(pos.x, pos.y);
  }, [selected, imgReady, scratch]);

  const moveScratch = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !coatCanvasRef.current || selected !== null) return;
    e.preventDefault();
    scratch(getPos(e, coatCanvasRef.current).x, getPos(e, coatCanvasRef.current).y);
  }, [selected, scratch]);

  const endScratch = useCallback(() => {
    isDrawing.current = false;
    lastPos.current = null;
    clearTool();
  }, [clearTool]);

  const handleGuess = (idx: number) => {
    if (selected !== null || answeredRef.current) return;
    if (timerRef.current) clearInterval(timerRef.current!);
    answeredRef.current = true;
    const isCorrect = idx === question.correct;
    setSelected(idx);
    setCorrect(isCorrect);
    let xp = 0;
    if (isCorrect) xp = cfg.baseXP[Math.min(tokensUsed, cfg.baseXP.length - 1)] + Math.round((timeLeft / QUESTION_TIME) * 30);
    setTimeout(() => onAnswer(isCorrect, xp), 1000);
  };

  const timerPercent = (timeLeft / QUESTION_TIME) * 100;
  const timerDanger = timeLeft <= 8;
  const optionLetters = ["A", "B", "C", "D"];

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-up">
      <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
        <span>Soru {questionIndex + 1}/{totalQuestions}</span>
        <span className={timerDanger ? "text-red-400 font-bold" : ""}>{timeLeft}s</span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
        <div className="h-full rounded-full transition-all duration-1000" style={{
          width: `${timerPercent}%`,
          background: timerDanger ? "#ef4444" : difficulty === "kolay" ? "linear-gradient(90deg,#38bdf8,#7dd3fc)" : difficulty === "orta" ? "linear-gradient(90deg,#4ade80,#86efac)" : "linear-gradient(90deg,#eab308,#fbbf24)"
        }} />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-400 text-xs">Hak:</span>
          {Array.from({ length: MAX_TOKENS }).map((_, i) => (
            <span key={i} className="text-lg" style={{ opacity: i < tokensLeft ? 1 : 0.2 }}>{cfg.tokenEmoji}</span>
          ))}
        </div>
        <div className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{
          background: tokensUsed === 0 ? "rgba(251,191,36,0.25)" : tokensUsed === 1 ? `${cfg.accentColor}` : tokensUsed === 2 ? "rgba(249,115,22,0.25)" : "rgba(239,68,68,0.25)",
          border: "1px solid",
          borderColor: tokensUsed === 0 ? "rgba(251,191,36,0.6)" : tokensUsed === 1 ? cfg.borderColor : tokensUsed === 2 ? "rgba(249,115,22,0.6)" : "rgba(239,68,68,0.6)",
          color: tokensUsed === 0 ? "#fbbf24" : tokensUsed === 1 ? "#ffffff" : tokensUsed === 2 ? "#fb923c" : "#f87171",
        }}>
          ⭐ {cfg.baseXP[Math.min(tokensUsed, cfg.baseXP.length - 1)]}+ XP
        </div>
      </div>

      <div className="relative mb-4 rounded-2xl overflow-hidden" style={{ aspectRatio: "4/3", border: `2px solid ${cfg.borderColor}`, boxShadow: `0 0 40px ${cfg.glowColor}` }}>
        {imgError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ background: "#1e1b4b" }}>
            <span className="text-4xl">🖼️</span>
            <span className="text-zinc-400 text-sm">Görsel yüklenemedi</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={question.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onLoad={() => setImgReady(true)}
            onError={() => { setImgError(true); setImgReady(true); }}
          />
        )}

        <canvas
          ref={coatCanvasRef}
          width={600}
          height={450}
          className="absolute inset-0 w-full h-full"
          style={{
            display: "block",
            cursor: tokensLeft > 0 && selected === null && imgReady ? (scratchingActive ? "crosshair" : "pointer") : "default",
            touchAction: "none",
          }}
          onMouseDown={startScratch}
          onMouseMove={moveScratch}
          onMouseUp={endScratch}
          onMouseLeave={endScratch}
          onTouchStart={startScratch}
          onTouchMove={moveScratch}
          onTouchEnd={endScratch}
        />

        {/* Tool overlay — alet görseli, pointer-events yok */}
        <canvas
          ref={toolCanvasRef}
          width={600}
          height={450}
          className="absolute inset-0 w-full h-full"
          style={{ display: "block", pointerEvents: "none", zIndex: 5 }}
        />

        {!imgReady && !imgError && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none" style={{ background: cfg.coatColor }}>
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: cfg.borderColor }} />
          </div>
        )}

        {selected !== null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20" style={{ background: correct ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)" }}>
            <span className="text-7xl">{correct ? "✅" : "❌"}</span>
          </div>
        )}
      </div>

      <p className="text-center text-xs mb-3" style={{ color: tokensLeft === 0 ? "#fb923c" : "#71717a" }}>
        {selected !== null ? " " : tokensLeft === 0 ? cfg.emptyText : scratchingActive ? cfg.activeText : cfg.hintText}
      </p>

      <p className="text-white font-bold text-center mb-3 text-sm">{question.question}</p>

      <div className="grid grid-cols-2 gap-2">
        {question.options.map((option, idx) => {
          const showCorrect = selected !== null && idx === question.correct;
          const showWrong = selected !== null && selected === idx && !correct;
          let bg = "rgba(99,102,241,0.28)", border = "2px solid rgba(99,102,241,0.55)", color = "#ffffff";
          if (showCorrect) { bg = "rgba(16,185,129,0.35)"; border = "2px solid rgba(16,185,129,0.8)"; color = "#6ee7b7"; }
          else if (showWrong) { bg = "rgba(239,68,68,0.35)"; border = "2px solid rgba(239,68,68,0.8)"; color = "#fca5a5"; }
          return (
            <button key={idx} onClick={() => handleGuess(idx)} disabled={selected !== null}
              className="p-3 rounded-xl flex items-center gap-2 transition-all duration-200 text-left active:scale-95"
              style={{ background: bg, border, color }}
            >
              <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-black flex-shrink-0" style={{
                background: showCorrect ? "rgba(16,185,129,0.5)" : showWrong ? "rgba(239,68,68,0.5)" : "rgba(99,102,241,0.4)",
                color: showCorrect ? "#34d399" : showWrong ? "#f87171" : "#a5b4fc",
              }}>
                {showCorrect ? "✓" : showWrong ? "✗" : optionLetters[idx]}
              </span>
              <span className="font-medium text-sm leading-tight">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
