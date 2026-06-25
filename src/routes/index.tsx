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

const MESSAGES = [
  {
    img: cardFood,
    cat: "Alimentación",
    title: "El desayuno de la selva",
    excerpt: "Plátano maduro asado, casabe y miel silvestre. Energía limpia para empezar el día.",
    date: "Hoy",
  },
  {
    img: cardFishing,
    cat: "Pesca",
    title: "Pescar con la luna",
    excerpt: "Los abuelos enseñan que la luna nueva trae los mejores peces al río.",
    date: "Ayer",
  },
  {
    img: cardCrafts,
    cat: "Saberes",
    title: "Reparar antes que comprar",
    excerpt: "Un cuchillo bien afilado dura tres generaciones. Aquí mi método casero.",
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
  { icon: Facebook, name: "Facebook", href: "#" },
  { icon: Instagram, name: "Instagram", href: "#" },
  { icon: Youtube, name: "YouTube", href: "#" },
  { icon: MessageCircle, name: "TikTok", href: "#" },
  { icon: MessageCircle, name: "WhatsApp", href: WA_LINK },
  { icon: Send, name: "Telegram", href: "#" },
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

  useEffect(() => {
    supabase
      .from("mensajes")
      .select("*")
      .eq("publicado", true)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setDbMessages((data as DbMensaje[]) ?? []));
  }, []);

  const messages =
    dbMessages && dbMessages.length > 0
      ? dbMessages.map((m, i) => ({
          img: m.imagen_url || DEFAULT_IMAGES[i % DEFAULT_IMAGES.length],
          cat: m.categoria ?? "Mensaje",
          title: m.titulo,
          excerpt: m.contenido.slice(0, 140) + (m.contenido.length > 140 ? "…" : ""),
          date: formatDate(m.created_at),
        }))
      : MESSAGES;

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
        <img src={heroJungle} alt="Selva al atardecer" width={1920} height={1280} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/20 to-background" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
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
      </section>

      {/* Mensajes */}
      <section id="mensajes" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-leaf">Mensajes diarios</span>
            <h2 className="mt-3 font-display text-4xl font-semibold text-primary sm:text-5xl">
              Reflexiones del río y la selva
            </h2>
            <p className="mt-4 text-muted-foreground">
              Cada día un pensamiento, una receta o una técnica. Pequeñas semillas para una vida más simple.
            </p>
          </div>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {messages.map((m) => (
              <article key={m.title} className="group overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1">
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
                  <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Leer más <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
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
    </div>
  );
}
