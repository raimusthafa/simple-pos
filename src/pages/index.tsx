import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Head from "next/head";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      void router.replace("/dashboard");
    }
  }, [isSignedIn, isLoaded, router]);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Head>
        <title>Simple POS — Point of Sale Modern untuk Bisnis Anda</title>
        <meta
          name="description"
          content="Kelola penjualan, produk, kategori, dan laporan bisnis Anda dalam satu platform yang modern. Mulai berjualan dalam hitungan menit."
        />
      </Head>

      <div className="min-h-screen bg-[oklch(0.99_0_0)] font-sans overflow-x-hidden">
        {/* ── Navbar ── */}
        <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-md bg-white/80 border-b border-[oklch(0.90_0_0)]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <span className="font-bold text-lg tracking-tight text-[oklch(0.20_0_0)]">
              Simple<span className="text-[oklch(0.83_0.13_160.91)]">POS</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[oklch(0.44_0_0)]">
            <button
              onClick={scrollToFeatures}
              className="hover:text-[oklch(0.20_0_0)] transition-colors cursor-pointer"
            >
              Fitur
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-[oklch(0.44_0_0)] hover:text-[oklch(0.20_0_0)] transition-colors px-3 py-1.5"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-[oklch(0.83_0.13_160.91)] text-[oklch(0.26_0.01_166.46)] hover:bg-[oklch(0.76_0.15_160.91)] transition-all duration-200 shadow-sm"
            >
              Mulai Gratis
            </Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 md:px-12 overflow-hidden">
          {/* Background blobs */}
          <div
            aria-hidden
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, oklch(0.83 0.13 160.91), transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, oklch(0.62 0.19 259.81), transparent 70%)",
            }}
          />

          <div className="relative max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.95_0.04_160.91)] text-[oklch(0.44_0.10_156.76)] text-xs font-medium mb-6 border border-[oklch(0.83_0.13_160.91)]/30">
              <span className="w-2 h-2 rounded-full bg-[oklch(0.83_0.13_160.91)] animate-pulse" />
              Gratis selama masa beta
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[oklch(0.20_0_0)] leading-tight mb-6">
              Kasir Digital{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[oklch(0.83_0.13_160.91)]">
                  Simpel &amp; Cepat
                </span>
                <span
                  className="absolute bottom-1 left-0 w-full h-3 rounded-full -z-10 opacity-30"
                  style={{ background: "oklch(0.83 0.13 160.91)" }}
                />
              </span>{" "}
              <br className="hidden md:block" />
              untuk Bisnis Anda
            </h1>

            <p className="text-lg md:text-xl text-[oklch(0.44_0_0)] max-w-2xl mx-auto mb-10 leading-relaxed">
              Kelola penjualan, produk, kategori, dan laporan bisnis Anda dalam
              satu platform yang modern. Mulai berjualan dalam hitungan menit.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                id="cta-signup"
                className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-[oklch(0.83_0.13_160.91)] text-[oklch(0.26_0.01_166.46)] font-semibold text-base hover:bg-[oklch(0.76_0.15_160.91)] transition-all duration-200 shadow-lg shadow-[oklch(0.83_0.13_160.91)]/30 hover:shadow-xl hover:shadow-[oklch(0.83_0.13_160.91)]/40 hover:-translate-y-0.5"
              >
                Mulai Sekarang — Gratis
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                href="/login"
                id="cta-signin"
                className="px-8 py-4 rounded-xl border border-[oklch(0.90_0_0)] text-[oklch(0.44_0_0)] font-medium text-base hover:bg-[oklch(0.95_0_0)] hover:border-[oklch(0.83_0.13_160.91)]/50 transition-all duration-200"
              >
                Sudah punya akun? Masuk
              </Link>
            </div>

            <p className="mt-8 text-sm text-[oklch(0.55_0_0)]">
              ✨ Tidak perlu kartu kredit &nbsp;·&nbsp; Setup dalam 2 menit
              &nbsp;·&nbsp; Pembayaran terintegrasi
            </p>
          </div>

          {/* Dashboard mockup */}
          <div className="relative max-w-5xl mx-auto mt-16 md:mt-20">
            <div className="relative rounded-2xl overflow-hidden border border-[oklch(0.90_0_0)] shadow-2xl shadow-black/10">
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-[oklch(0.97_0_0)] border-b border-[oklch(0.90_0_0)]">
                <div className="w-3 h-3 rounded-full bg-[oklch(0.65_0.19_32.73)]" />
                <div className="w-3 h-3 rounded-full bg-[oklch(0.77_0.16_70.08)]" />
                <div className="w-3 h-3 rounded-full bg-[oklch(0.70_0.15_162.48)]" />
                <div className="ml-4 flex-1 max-w-xs rounded-md bg-[oklch(0.93_0_0)] px-3 py-1 text-xs text-[oklch(0.55_0_0)]">
                  simple-pos-swart.vercel.app/dashboard
                </div>
              </div>
              {/* Mock dashboard UI */}
              <div className="bg-[oklch(0.97_0_0)] p-6 min-h-[320px] md:min-h-[380px]">
                <div className="flex gap-4 h-full">
                  {/* Sidebar mock */}
                  <div className="hidden md:flex flex-col gap-2 w-44 shrink-0">
                    <div className="h-8 rounded-lg bg-[oklch(0.83_0.13_160.91)]/15 flex items-center px-3 gap-2">
                      <div className="w-4 h-4 rounded bg-[oklch(0.83_0.13_160.91)]/40" />
                      <div className="h-3 w-16 rounded bg-[oklch(0.83_0.13_160.91)]/60" />
                    </div>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 rounded-lg bg-[oklch(0.90_0_0)] flex items-center px-3 gap-2"
                      >
                        <div className="w-4 h-4 rounded bg-[oklch(0.80_0_0)]" />
                        <div
                          className="h-3 rounded bg-[oklch(0.80_0_0)]"
                          style={{ width: `${50 + i * 8}px` }}
                        />
                      </div>
                    ))}
                  </div>
                  {/* Main content mock */}
                  <div className="flex-1 flex flex-col gap-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Total Penjualan", value: "Rp 4.2jt", color: "oklch(0.83 0.13 160.91)" },
                        { label: "Transaksi", value: "128", color: "oklch(0.62 0.19 259.81)" },
                        { label: "Produk Aktif", value: "34", color: "oklch(0.77 0.16 70.08)" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-xl bg-white p-3 border border-[oklch(0.90_0_0)]"
                        >
                          <div
                            className="h-2 w-12 rounded mb-2"
                            style={{ background: stat.color, opacity: 0.4 }}
                          />
                          <div className="text-base font-bold" style={{ color: stat.color }}>
                            {stat.value}
                          </div>
                          <div className="text-[10px] text-[oklch(0.55_0_0)] mt-0.5">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Product grid mock */}
                    <div className="grid grid-cols-4 gap-2 flex-1">
                      {[
                        { name: "Kopi Susu", price: "Rp 18k" },
                        { name: "Matcha Latte", price: "Rp 22k" },
                        { name: "Es Teh", price: "Rp 8k" },
                        { name: "Croissant", price: "Rp 25k" },
                      ].map((p) => (
                        <div
                          key={p.name}
                          className="rounded-xl bg-white border border-[oklch(0.90_0_0)] p-2.5 flex flex-col gap-1.5"
                        >
                          <div className="rounded-lg bg-[oklch(0.95_0.02_160.91)] h-14 flex items-center justify-center text-2xl">
                            ☕
                          </div>
                          <div className="text-[11px] font-medium text-[oklch(0.20_0_0)] truncate">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-[oklch(0.83_0.13_160.91)] font-semibold">
                            {p.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow under mockup */}
            <div
              aria-hidden
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 blur-2xl opacity-30 rounded-full pointer-events-none"
              style={{ background: "oklch(0.83 0.13 160.91)" }}
            />
          </div>
        </section>

        {/* ── Features ── */}
        <section
          ref={featuresRef}
          id="features"
          className="py-20 md:py-32 px-6 md:px-12 bg-[oklch(0.97_0_0)]"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-[oklch(0.83_0.13_160.91)] uppercase tracking-widest mb-3">
                Fitur Unggulan
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[oklch(0.20_0_0)] tracking-tight">
                Semua yang Anda butuhkan,{" "}
                <br className="hidden md:block" />
                dalam satu aplikasi
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🛍️",
                  title: "Manajemen Produk",
                  desc: "Tambah, edit, dan kelola produk dengan foto, harga, dan kategori. Stok selalu terpantau real-time.",
                  color: "oklch(0.95 0.04 160.91)",
                },
                {
                  icon: "💳",
                  title: "Pembayaran Digital",
                  desc: "Terima pembayaran QRIS, transfer bank, dan e-wallet via Xendit. Konfirmasi otomatis tanpa manual.",
                  color: "oklch(0.95 0.03 259.81)",
                },
                {
                  icon: "📊",
                  title: "Laporan & Analitik",
                  desc: "Pantau performa penjualan harian, mingguan, dan bulanan dengan grafik yang mudah dipahami.",
                  color: "oklch(0.95 0.04 70.08)",
                },
                {
                  icon: "🗂️",
                  title: "Kategori Produk",
                  desc: "Organisir produk Anda dengan sistem kategori. Filter cepat saat melayani pelanggan.",
                  color: "oklch(0.95 0.04 292.72)",
                },
                {
                  icon: "🧾",
                  title: "Riwayat Transaksi",
                  desc: "Semua transaksi tercatat lengkap. Cari, filter, dan export data kapan saja.",
                  color: "oklch(0.95 0.04 160.91)",
                },
                {
                  icon: "🔐",
                  title: "Aman & Terpercaya",
                  desc: "Autentikasi via Clerk dengan enkripsi tingkat enterprise. Data bisnis Anda selalu aman.",
                  color: "oklch(0.95 0.02 32.73)",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="group rounded-2xl bg-white p-6 border border-[oklch(0.90_0_0)] hover:border-[oklch(0.83_0.13_160.91)]/40 hover:shadow-xl hover:shadow-[oklch(0.83_0.13_160.91)]/10 transition-all duration-300 hover:-translate-y-1 cursor-default"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-200"
                    style={{ background: f.color }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-[oklch(0.20_0_0)] mb-2">{f.title}</h3>
                  <p className="text-sm text-[oklch(0.44_0_0)] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats band ── */}
        <section className="py-16 px-6 md:px-12 border-y border-[oklch(0.90_0_0)]">
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
            {[
              { val: "2 menit", label: "Waktu setup rata-rata" },
              { val: "99.9%", label: "Uptime dijamin" },
              { val: "Gratis", label: "Selama masa beta" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-bold text-[oklch(0.83_0.13_160.91)] mb-1">
                  {s.val}
                </div>
                <div className="text-sm text-[oklch(0.55_0_0)]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Bottom ── */}
        <section className="py-24 md:py-32 px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative">
              <div
                aria-hidden
                className="absolute inset-0 rounded-3xl blur-3xl opacity-20 scale-95"
                style={{ background: "oklch(0.83 0.13 160.91)" }}
              />
              <div className="relative rounded-3xl bg-gradient-to-br from-[oklch(0.95_0.04_160.91)] to-[oklch(0.93_0.03_160.91)] border border-[oklch(0.83_0.13_160.91)]/30 px-10 py-14">
                <span className="text-5xl mb-4 block">🚀</span>
                <h2 className="text-3xl md:text-4xl font-bold text-[oklch(0.20_0_0)] mb-4 tracking-tight">
                  Siap mulai berjualan?
                </h2>
                <p className="text-[oklch(0.44_0_0)] mb-8 leading-relaxed">
                  Daftar sekarang, gratis — tidak butuh kartu kredit.
                  <br />
                  Mulai terima pembayaran dalam hitungan menit.
                </p>
                <Link
                  href="/register"
                  id="cta-bottom-signup"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[oklch(0.83_0.13_160.91)] text-[oklch(0.26_0.01_166.46)] font-semibold text-base hover:bg-[oklch(0.76_0.15_160.91)] transition-all duration-200 shadow-lg shadow-[oklch(0.83_0.13_160.91)]/30 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Buat Akun Gratis
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="py-8 px-6 md:px-12 border-t border-[oklch(0.90_0_0)]">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛒</span>
              <span className="font-bold text-sm text-[oklch(0.20_0_0)]">
                Simple<span className="text-[oklch(0.83_0.13_160.91)]">POS</span>
              </span>
            </div>
            <p className="text-xs text-[oklch(0.55_0_0)]">
              © {new Date().getFullYear()} SimplePOS. Dibuat dengan ❤️
            </p>
            <div className="flex items-center gap-6 text-xs text-[oklch(0.55_0_0)]">
              <Link href="/login" className="hover:text-[oklch(0.20_0_0)] transition-colors">
                Masuk
              </Link>
              <Link href="/register" className="hover:text-[oklch(0.20_0_0)] transition-colors">
                Daftar
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
