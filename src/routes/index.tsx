import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Leaf, Fish, Apple, Hammer, Sprout, Sparkles, MessageCircle,
  Facebook, Instagram, Youtube, Send, Heart, ArrowRight, Menu, X,
} from "lucide-react";
import heroJungle from "@/assets/hero-jungle.jpg";
import leavesTexture from "@/assets/leaves-texture.jpg";
import cardFood from "@/assets/card-food.jpg";
import cardFishing from "@/assets/card-fishing.jpg";
import cardCrafts from "@/assets/card-crafts.jpg";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Cavunativos — Vive simple, vive sano, vive conectado" },
      { name: "description", content: "Mensajes y saberes ancestrales para la vida cotidiana: alimentación sana, pesca sostenible, reparaciones caseras y vida indígena en armonía con la selva." },
      { property: "og:title", content: "Cavunativos — Saberes ancestrales para el día a día" },
      { property: "og:description", content: "Mensajes diarios desde la selva: alimentación, pesca, reparaciones y sabiduría indígena." },
      { property: "og:url", content: "/" },
      { property: "og:image", content: "/og-image.jpg" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Cavunativos",
          description: "Saberes ancestrales y mensajes diarios para una vida simple, sana y conectada con la naturaleza.",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+58-412-6893075",
            contactType: "customer service",
          },
        }),
      },
    ],
  }),
});

const WHATSAPP = "584126893075";
const WA_LINK = `https://wa.me/${WHATSAPP}`;

const NAV = [
  { href: "#inicio", label: "Inicio" },
  { href: "#mensajes", label: "Mensajes" },
  { href: "#vida", label: "Vida Práctica" },
  { href: "#pesca", label: "Pesca" },
  { href: "#alimentacion", label: "Alimentación Sana" },
  { href: "#contacto", label: "Contacto" },
];

function LeafDivider({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden className={`block h-12 w-full sm:h-16 ${flip ? "rotate-180" : ""} ${className}`}>
      <path fill="currentColor" d="M0,40 C240,90 480,0 720,40 C960,80 1200,10 1440,50 L1440,80 L0,80 Z" />
    </svg>
  );
}

type CardMessage = {
  img: string;
  cat: string;
  title: string;
  excerpt: string;
  full: string;
  date: string;
};

const MESSAGES: CardMessage[] = [
  {
    img: cardFood,
    cat: "Alimentación",
    title: "El desayuno de la selva",
    excerpt: "Plátano maduro asado, casabe y miel silvestre. Energía limpia para empezar el día.",
    full: "En la selva el desayuno es sagrado. Un plátano maduro asado sobre brasas, una lasca de casabe crujiente y una cucharada de miel silvestre bastan para abrir el día con energía limpia. Sin azúcar refinada, sin prisa, masticando despacio para escuchar al cuerpo. Así comían los abuelos y así sigue siendo el ritual de quienes viven cerca del río.",
    date: "Hoy",
  },
  {
    img: cardFishing,
    cat: "Pesca",
    title: "Pescar con la luna",
    excerpt: "Los abuelos enseñan que la luna nueva trae los mejores peces al río.",
    full: "La luna manda en el agua. En luna nueva los peces se acercan a la orilla buscando alimento y la pesca es generosa. En luna llena, en cambio, conviene esperar al amanecer. No es superstición: es observación de generaciones. Pescar es leer el cielo, el viento y la corriente — no solo lanzar el anzuelo.",
    date: "Ayer",
  },
  {
    img: cardCrafts,
    cat: "Saberes",
    title: "Reparar antes que comprar",
    excerpt: "Un cuchillo bien afilado dura tres generaciones. Aquí mi método casero.",
    full: "Antes de pensar en comprar uno nuevo, afila. Una piedra plana mojada, movimientos suaves y constantes en un solo sentido, y cinco minutos de paciencia. El filo vuelve. Un buen cuchillo bien cuidado pasa de abuelo a nieto. Reparar es también un acto de respeto a la tierra: menos basura, menos consumo, más oficio.",
    date: "Hace 2 días",
  },
];

const CATEGORIES = [
  { icon: Apple, name: "Alimentación Sana", desc: "Recetas y plantas que sanan." },
  { icon: Fish, name: "Pesca y Río", desc: "Técnicas sostenibles del agua." },
  { icon: Hammer, name: "Reparaciones Caseras", desc: "Arreglar con lo que tienes." },
  { icon: Sparkles, name: "Saberes Indígenas", desc: "Sabiduría que no se pierde." },
  { icon: Sprout, name: "Vida Autosuficiente", desc: "Sembrar, cosechar, vivir." },
  { icon: Leaf, name: "Conexión Natural", desc: "Volver a la tierra cada día." },
];

const SOCIALS = [
  { icon: Facebook, name: "Facebook", href: "https://facebook.com/cavunativos" },
  { icon: Instagram, name: "Instagram", href: "https://instagram.com/cavunativos" },
  { icon: Youtube, name: "YouTube", href: "https://youtube.com/@cavunativos" },
  { icon: MessageCircle, name: "TikTok", href: "https://tiktok.com/@cavunativos" },
  { icon: MessageCircle, name: "WhatsApp", href: WA_LINK },
  { icon: Send, name: "Telegram", href: "https://t.me/cavunativos" },
];

type DbMensaje = {
  id: string;
  titulo: string;
  contenido: string;
  imagen_url: string | null;
  categoria: string | null;
  created_at: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 86400000;
  if (diff < 1) return "Hoy";
  if (diff < 2) return "Ayer";
  if (diff < 7) return `Hace ${Math.floor(diff)} días`;
  return d.toLocaleDateString();
}

const DEFAULT_IMAGES = [cardFood, cardFishing, cardCrafts];

function Index() {
  const [open, setOpen] = useState(false);
  const [dbMessages, setDbMessages] = useState<DbMensaje[] | null>(null);
  const [selected, setSelected] = useState<CardMessage | null>(null);
  const [subEmail, setSubEmail] = useState("");
  const [subState, setSubState] = useState<"idle" | "loading" | "ok" | "dup" | "err">("idle");
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("Todos");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    const email = subEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      setSubState("err");
      return;
    }
    setSubState("loading");
    const { error } = await supabase.from("suscriptores").insert({ email });
    if (error) {
      setSubState(error.code === "23505" ? "dup" : "err");
      return;
    }
    setSubState("ok");
    setSubEmail("");
  }

  useEffect(() => {
    supabase
      .from("mensajes")
      .select("*")
      .eq("publicado", true)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setDbMessages((data as DbMensaje[]) ?? []));
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const messages: CardMessage[] =
    dbMessages && dbMessages.length > 0
      ? dbMessages.map((m, i) => ({
          img: m.imagen_url || DEFAULT_IMAGES[i % DEFAULT_IMAGES.length],
          cat: m.categoria ?? "Mensaje",
          title: m.titulo,
          excerpt: m.contenido.slice(0, 140) + (m.contenido.length > 140 ? "…" : ""),
          full: m.contenido,
          date: formatDate(m.created_at),
        }))
      : MESSAGES;

  const cats = ["Todos", ...Array.from(new Set(messages.map((m) => m.cat)))];
  const q = query.trim().toLowerCase();
  const filtered = messages.filter((m) => {
    const okCat = activeCat === "Todos" || m.cat === activeCat;
    const okQ = !q || m.title.toLowerCase().includes(q) || m.excerpt.toLowerCase().includes(q) || m.full.toLowerCase().includes(q);
    return okCat && okQ;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <a href="#inicio" className="flex items-center gap-2">
            <img src={logo} alt="Cavunativos" width={40} height={40} className="h-10 w-10" />
            <span className="font-display text-xl font-semibold text-primary">Cavunativos</span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-sm text-foreground/80 transition-colors hover:text-primary">
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href={WA_LINK}
            className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-105 md:inline-flex"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <button onClick={() => setOpen(!open)} className="lg:hidden" aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="border-t border-border/40 bg-background lg:hidden">
            <div className="flex flex-col gap-1 px-5 py-3">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-secondary">
                  {n.label}
                </a>
              ))}
              <a href={WA_LINK} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                <MessageCircle className="h-4 w-4" /> +58 412-6893075
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="inicio" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-20">
        <img src={heroJungle} alt="Selva al atardecer" width={1920} height={1280} className="absolute inset-0 h-full w-full object-cover animate-hero-zoom" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/20 to-background" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-md">
            <Leaf className="h-3.5 w-3.5" /> Sabiduría ancestral
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-white drop-shadow-lg sm:text-6xl md:text-7xl">
            Vive simple,<br />
            <span className="italic text-accent">vive sano</span>,<br />
            vive conectado.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-white/90 sm:text-lg">
            Mensajes y saberes ancestrales para la vida cotidiana.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#mensajes" className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-accent-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-105">
              Explorar Mensajes <ArrowRight className="h-4 w-4" />
            </a>
            <a href={WA_LINK} className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20">
              <MessageCircle className="h-4 w-4" /> Escríbeme por WhatsApp
            </a>
          </div>
        </div>
        <LeafDivider className="absolute bottom-0 left-0 right-0 text-background" />
      </section>

      {/* Mensajes */}
      <section id="mensajes" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 max-w-2xl reveal">
            <span className="text-xs font-semibold uppercase tracking-widest text-leaf">Mensajes diarios</span>
            <h2 className="mt-3 font-display text-4xl font-semibold text-primary sm:text-5xl">
              Reflexiones del río y la selva
            </h2>
            <p className="mt-4 text-muted-foreground">
              Cada día un pensamiento, una receta o una técnica. Pequeñas semillas para una vida más simple.
            </p>
          </div>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar mensaje..."
              className="w-full rounded-full border border-border bg-card px-5 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 sm:max-w-xs"
            />
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    activeCat === c
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground">Sin resultados.</p>
            )}
            {filtered.map((m) => (
              <button
                key={m.title}
                onClick={() => setSelected(m)}
                className="group text-left overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={m.img} alt={m.title} loading="lazy" width={800} height={600} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">{m.cat}</span>
                    <span className="text-muted-foreground">{m.date}</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-semibold text-foreground">{m.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{m.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Leer más <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Vida práctica */}
      <section id="vida" className="relative overflow-hidden py-24">
        <img src={leavesTexture} alt="" aria-hidden width={1600} height={900} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-leaf">Vida práctica</span>
            <h2 id="alimentacion" className="mt-3 font-display text-4xl font-semibold text-primary sm:text-5xl">
              Saberes para cada día
            </h2>
          </div>
          <div id="pesca" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => (
              <a key={c.name} href="#" className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-[var(--shadow-card)]">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <c.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold text-foreground">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Comunidad */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-leaf">Comunidad</span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-primary sm:text-5xl">
            Únete a la tribu digital
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Sígueme en redes y forma parte del grupo. Aquí compartimos lo que la selva nos enseña.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.href} className="group flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-card)]">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-primary to-leaf text-primary-foreground">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{s.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Suscripción por correo */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-leaf">Boletín</span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-primary sm:text-5xl">
            Recibe los mensajes en tu correo
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Saberes, recetas y consejos de la selva, directo a tu bandeja. Sin spam, solo lo esencial.
          </p>
          <form onSubmit={handleSubscribe} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              maxLength={255}
              value={subEmail}
              onChange={(e) => setSubEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm outline-none focus:border-primary"
              aria-label="Correo electrónico"
            />
            <button
              type="submit"
              disabled={subState === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-60"
            >
              {subState === "loading" ? "Enviando..." : "Suscribirme"}
              <Send className="h-4 w-4" />
            </button>
          </form>
          {subState === "ok" && (
            <p className="mt-4 text-sm font-medium text-leaf">¡Listo! Te avisaremos cuando haya novedades.</p>
          )}
          {subState === "dup" && (
            <p className="mt-4 text-sm text-muted-foreground">Este correo ya está suscrito. ¡Gracias!</p>
          )}
          {subState === "err" && (
            <p className="mt-4 text-sm text-destructive">Hubo un problema. Revisa el correo e intenta de nuevo.</p>
          )}
        </div>
      </section>

      {/* Patrocinantes + Apoyo */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-2">
          <div className="rounded-3xl border border-dashed border-primary/40 bg-card/60 p-10 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-gold" />
            <h3 className="mt-4 font-display text-2xl font-semibold text-primary">Patrocinantes y Aliados</h3>
            <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
              Espacio reservado para quienes quieran sumarse a esta misión.
            </p>
            <p className="mt-4 text-sm italic text-foreground/80">
              ¿Quieres apoyar este espacio o colaborar? Contáctame.
            </p>
            <a href={WA_LINK} className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
              Conversemos <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-3xl bg-[var(--gradient-sunset)] p-10 text-center text-white shadow-[var(--shadow-soft)]">
            <Heart className="mx-auto h-8 w-8" />
            <h3 className="mt-4 font-display text-2xl font-semibold">Apoya este espacio</h3>
            <p className="mx-auto mt-3 max-w-sm text-sm text-white/90">
              Tu colaboración ayuda a que más mensajes lleguen, crezcamos en comunidad y sigamos sembrando saber.
            </p>
            <a href={WA_LINK} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary transition-transform hover:scale-105">
              Quiero apoyar <Heart className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="border-t border-border/60 bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <img src={logo} alt="" width={36} height={36} className="h-9 w-9" />
              <span className="font-display text-xl font-semibold">Cavunativos</span>
            </div>
            <p className="mt-3 text-sm text-primary-foreground/80">
              Vive simple, vive sano, vive conectado.
            </p>
          </div>
          <div>
            <h4 className="font-display text-base font-semibold">Contacto</h4>
            <a href={WA_LINK} className="mt-3 inline-flex items-center gap-2 text-sm text-primary-foreground/90 hover:text-accent">
              <MessageCircle className="h-4 w-4" /> +58 412-6893075
            </a>
          </div>
          <div>
            <h4 className="font-display text-base font-semibold">Síguenos</h4>
            <div className="mt-3 flex flex-wrap gap-3">
              {SOCIALS.map((s) => (
                <a key={s.name} href={s.href} aria-label={s.name} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-accent hover:text-accent-foreground">
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-primary-foreground/70 sm:flex-row sm:items-center sm:justify-between">
            <p>© 1997–2026 PCVEN, C.A. Todos los derechos reservados.</p>
            <p>Desarrollado por Carlos Vásquez.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={WA_LINK}
        aria-label="WhatsApp"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[var(--shadow-soft)] transition-transform hover:scale-110"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      {/* Modal de detalle */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-6"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-background/90 text-foreground backdrop-blur-md shadow-md hover:bg-background"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="aspect-[16/9] overflow-hidden">
              <img src={selected.img} alt={selected.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between text-xs">
                <span className="rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">{selected.cat}</span>
                <span className="text-muted-foreground">{selected.date}</span>
              </div>
              <h3 className="mt-4 font-display text-3xl font-semibold text-primary">{selected.title}</h3>
              <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-foreground/85">
                {selected.full}
              </p>
              <a
                href={WA_LINK}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-105"
              >
                <MessageCircle className="h-4 w-4" /> Conversar sobre esto
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
