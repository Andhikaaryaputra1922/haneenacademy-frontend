"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, BookOpen, Users, Award, PlayCircle,
  CheckCircle, Star, ChevronLeft, ChevronRight,
  GraduationCap, Clock, Zap, Shield,
} from "lucide-react";

// ── Animated Counter ──────────────────────────────────────────────────────────
function useCounter(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ── Intersection Observer Hook ─────────────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Stats Section ─────────────────────────────────────────────────────────────
function StatsSection() {
  const { ref, inView } = useInView();
  const students = useCounter(4000, 2000, inView);
  const lessons  = useCounter(500,  1800, inView);
  const teachers = useCounter(20,   1500, inView);
  const rating   = useCounter(98,   2200, inView);

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[
        { value: students, suffix: "+", label: "Siswa Aktif",     icon: <Users size={22} />,        color: "text-blue-600",   bg: "bg-blue-50" },
        { value: lessons,  suffix: "+", label: "Materi & Rekaman",icon: <PlayCircle size={22} />,   color: "text-violet-600", bg: "bg-violet-50" },
        { value: teachers, suffix: "+", label: "Pengajar Expert", icon: <GraduationCap size={22} />,color: "text-emerald-600",bg: "bg-emerald-50" },
        { value: rating,   suffix: "%", label: "Kepuasan Siswa",  icon: <Star size={22} />,         color: "text-amber-600",  bg: "bg-amber-50" },
      ].map((s) => (
        <div key={s.label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center hover:-translate-y-1 transition-transform duration-300">
          <div className={"w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 " + s.bg + " " + s.color}>
            {s.icon}
          </div>
          <p className={"text-3xl font-black " + s.color}>
            {s.value.toLocaleString()}{s.suffix}
          </p>
          <p className="text-sm text-slate-500 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ── Carousel ──────────────────────────────────────────────────────────────────
const SLIDES = [
  {
    title: "Belajar Bahasa Arab dari Nol",
    desc: "Kurikulum terstruktur dengan buku Arabiyyah Baina Yadaik. Cocok untuk pemula hingga mahir.",
    badge: "Paling Populer",
    badgeColor: "bg-blue-100 text-blue-700",
    meetings: "40x Pertemuan",
    price: "Rp 399.000",
    icon: <BookOpen size={32} />,
    color: "from-blue-500 to-blue-700",
  },
  {
    title: "Kelas Pemula Bahasa Arab",
    desc: "Mulai dari dasar dengan buku Durusullughah. Belajar 4x per minggu bersama pengajar alumni LIPIA.",
    badge: "Terjangkau",
    badgeColor: "bg-emerald-100 text-emerald-700",
    meetings: "16x Pertemuan",
    price: "Rp 100.000",
    icon: <GraduationCap size={32} />,
    color: "from-emerald-500 to-emerald-700",
  },
  {
    title: "Akses Materi 24 Jam",
    desc: "Rekaman kelas dan materi bisa diakses kapan saja. Tidak perlu khawatir ketinggalan pelajaran.",
    badge: "Gratis",
    badgeColor: "bg-amber-100 text-amber-700",
    meetings: "Unlimited",
    price: "Included",
    icon: <PlayCircle size={32} />,
    color: "from-amber-500 to-orange-600",
  },
  {
    title: "Sertifikat Resmi",
    desc: "Dapatkan 2 sertifikat untuk yang full hadir dan menyelesaikan semua tugas.",
    badge: "Eksklusif",
    badgeColor: "bg-violet-100 text-violet-700",
    meetings: "Full Course",
    price: "2 Sertifikat",
    icon: <Award size={32} />,
    color: "from-violet-500 to-violet-700",
  },
];

function Carousel() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = (dir: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActive((prev) => (prev + dir + SLIDES.length) % SLIDES.length);
      setAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const t = setInterval(() => go(1), 4000);
    return () => clearInterval(t);
  }, []);

  const s = SLIDES[active];

  return (
    <div className="relative">
      <div className={"rounded-3xl p-8 md:p-12 bg-gradient-to-br text-white overflow-hidden transition-all duration-500 " + s.color + (animating ? " opacity-0 scale-95" : " opacity-100 scale-100")}>
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <span className={"text-xs font-bold px-3 py-1 rounded-full " + s.badgeColor}>
              {s.badge}
            </span>
            <h3 className="text-2xl md:text-3xl font-black mt-4">{s.title}</h3>
            <p className="mt-3 text-white/80 leading-relaxed">{s.desc}</p>
            <div className="mt-6 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-semibold">
                <Clock size={15} /> {s.meetings}
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-semibold">
                <Zap size={15} /> {s.price}
              </div>
            </div>
            <Link href="/login" className="mt-6 inline-flex items-center gap-2 bg-white text-slate-800 font-bold px-6 py-3 rounded-full hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
              Daftar Sekarang <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hidden md:flex w-20 h-20 rounded-2xl bg-white/20 items-center justify-center shrink-0">
            {s.icon}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={"h-2 rounded-full transition-all duration-300 " + (i === active ? "w-8 bg-blue-600" : "w-2 bg-slate-300")}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => go(-1)} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => go(1)} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: <PlayCircle size={24} />,   title: "Rekaman 24 Jam",           desc: "Akses rekaman kelas kapan saja dan di mana saja.",              color: "text-blue-600",    bg: "bg-blue-50" },
  { icon: <Users size={24} />,        title: "Kelas Interaktif",         desc: "Belajar langsung via Google Meet/Zoom bersama pengajar.",       color: "text-violet-600",  bg: "bg-violet-50" },
  { icon: <Shield size={24} />,       title: "Pengajar Berpengalaman",   desc: "Alumni LIPIA dan S2 PBA yang sudah terverifikasi.",             color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: <CheckCircle size={24} />,  title: "Kurikulum Terstruktur",    desc: "Materi disusun sistematis dari dasar hingga mahir.",            color: "text-amber-600",   bg: "bg-amber-50" },
  { icon: <Award size={24} />,        title: "Sertifikat Resmi",         desc: "Dapatkan 2 sertifikat setelah menyelesaikan kursus.",           color: "text-rose-600",    bg: "bg-rose-50" },
  { icon: <Zap size={24} />,          title: "Konsultasi Gratis",        desc: "Tanya pengajar 24 jam tanpa biaya tambahan.",                  color: "text-cyan-600",    bg: "bg-cyan-50" },
];

function FeaturesSection() {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {FEATURES.map((f, i) => (
        <div key={f.title}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:-translate-y-1 transition-all duration-300"
          style={{ transitionDelay: inView ? i * 80 + "ms" : "0ms", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)" }}
        >
          <div className={"w-11 h-11 rounded-xl flex items-center justify-center mb-4 " + f.bg + " " + f.color}>
            {f.icon}
          </div>
          <h3 className="font-bold text-slate-800">{f.title}</h3>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Ahmad F.",   role: "Siswa Batch 01",    text: "Alhamdulillah setelah ikut kelas ini saya bisa baca kitab sendiri. Pengajarnya sabar dan materinya terstruktur.", rating: 5 },
  { name: "Siti R.",    role: "Siswa Pemula",       text: "Saya dari nol sama sekali tidak tahu bahasa Arab. Sekarang sudah bisa memahami kalimat dasar. Recommended!", rating: 5 },
  { name: "Ustadz B.",  role: "Alumni Kelas",       text: "Metode pengajaran yang dipakai sangat efektif. Dalam 2 bulan sudah bisa khatam 1 jilid Arabiyyah Baina Yadaik.", rating: 5 },
  { name: "Fatimah N.", role: "Ibu Rumah Tangga",   text: "Jadwalnya fleksibel dan ada rekaman jadi bisa belajar sambil jaga anak. Sangat membantu!", rating: 5 },
];

function TestimonialsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {TESTIMONIALS.map((t) => (
        <div key={t.name} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex gap-1 mb-3">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">"{t.text}"</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
              {t.name[0]}
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-800">{t.name}</p>
              <p className="text-xs text-slate-400">{t.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function LandingClient() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-black text-lg">Haneen<span className="text-blue-600">.</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#fitur" className="hover:text-slate-900 transition-colors">Fitur</a>
            <a href="#kelas" className="hover:text-slate-900 transition-colors">Kelas</a>
            <a href="#testimoni" className="hover:text-slate-900 transition-colors">Testimoni</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Masuk
            </Link>
            <Link href="/login" className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">

        {/* Hero */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full">
            <Zap size={14} /> Platform Belajar Bahasa Arab Online
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight max-w-3xl mx-auto">
            Belajar Bahasa Arab{" "}
            <span className="text-blue-600">Lebih Mudah</span>{" "}
            & Terstruktur
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Bergabung dengan 4000+ siswa yang sudah membuktikan metode belajar Haneen Academy. Pengajar alumni LIPIA, materi terstruktur, akses 24 jam.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/login" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
              Mulai Belajar Sekarang <ArrowRight size={18} />
            </Link>
            <Link href="#kelas" className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-2xl hover:bg-slate-50 transition-colors">
              Lihat Kelas
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <CheckCircle size={14} className="text-emerald-500" />
            Gratis konsultasi 24 jam
            <span className="mx-2">·</span>
            <CheckCircle size={14} className="text-emerald-500" />
            Rekaman kelas tersedia
            <span className="mx-2">·</span>
            <CheckCircle size={14} className="text-emerald-500" />
            Sertifikat resmi
          </div>
        </section>

        {/* Stats */}
        <section>
          <StatsSection />
        </section>

        {/* Carousel */}
        <section id="kelas" className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-black">Program Unggulan</h2>
            <p className="text-slate-500 mt-2">Pilih program yang sesuai dengan kebutuhanmu</p>
          </div>
          <Carousel />
        </section>

        {/* Features */}
        <section id="fitur" className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-black">Kenapa Haneen Academy?</h2>
            <p className="text-slate-500 mt-2">Semua yang kamu butuhkan untuk belajar bahasa Arab ada di sini</p>
          </div>
          <FeaturesSection />
        </section>

        {/* Testimonials */}
        <section id="testimoni" className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-black">Kata Mereka</h2>
            <p className="text-slate-500 mt-2">Ribuan siswa sudah merasakan manfaatnya</p>
          </div>
          <TestimonialsSection />
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-10 md:p-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-black">Siap Mulai Belajar?</h2>
          <p className="mt-4 text-blue-100 text-lg max-w-xl mx-auto">
            Bergabunglah sekarang dan dapatkan akses ke semua materi, rekaman kelas, dan konsultasi gratis.
          </p>
          <Link href="/login" className="mt-8 inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5">
            Daftar Sekarang <ArrowRight size={18} />
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-8 text-center text-sm text-slate-400">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <BookOpen size={14} className="text-white" />
            </div>
            <span className="font-black text-slate-700">Haneen<span className="text-blue-600">.</span></span>
          </div>
          <p>© 2026 Haneen Academy. All rights reserved.</p>
          <p className="mt-1">📞 0812 3955 1423 (Minha) · Instagram: @haneen_arabic</p>
        </footer>

      </div>
    </main>
  );
}
