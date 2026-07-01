import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Leaf, Search } from "lucide-react";

type Mensaje = {
  id: string;
  titulo: string;
  contenido: string;
  imagen_url: string | null;
  categoria: string | null;
  created_at: string;
};

const PAGE_SIZE = 9;

export const Route = createFileRoute("/saberes")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Saberes — Cavunativos" },
      { name: "description", content: "Explora todos los saberes ancestrales, recetas y técnicas indígenas publicados en Cavunativos." },
      { property: "og:title", content: "Saberes — Cavunativos" },
      { property: "og:description", content: "Explora todos los saberes ancestrales, recetas y técnicas indígenas publicados en Cavunativos." },
    ],
  }),
  component: SaberesPage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-stone-700">Error: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-8 text-center">No encontrado</div>,
});

function SaberesPage() {
  const [items, setItems] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");
  const [selected, setSelected] = useState<Mensaje | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let query = supabase
      .from("mensajes")
      .select("id,titulo,contenido,imagen_url,categoria,created_at", { count: "exact" })
      .eq("publicado", true)
      .order("created_at", { ascending: false })
      .range(from, to);
    if (cat) query = query.eq("categoria", cat);
    if (q.trim()) query = query.ilike("titulo", `%${q.trim()}%`);
    query.then(({ data, count }) => {
      if (cancelled) return;
      setItems((data as Mensaje[]) ?? []);
      setTotal(count ?? 0);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [page, q, cat]);

  const categorias = useMemo(
    () => ["", "Alimentación", "Pesca", "Saberes", "Reparaciones", "Vida Sana", "Naturaleza"],
    [],
  );
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-[#f5efe4]">
      <header className="bg-white border-b border-[#e6dcc8] px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[#2d5016]">
          <ArrowLeft className="w-4 h-4" />
          <Leaf className="w-5 h-5" />
          <span className="font-serif text-lg">Cavunativos · Saberes</span>
        </Link>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={q}
              onChange={(e) => {
                setPage(0);
                setQ(e.target.value);
              }}
              placeholder="Buscar por título…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#e6dcc8] bg-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categorias.map((c) => (
              <button
                key={c || "todas"}
                onClick={() => {
                  setPage(0);
                  setCat(c);
                }}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  cat === c
                    ? "bg-[#2d5016] text-white border-[#2d5016]"
                    : "bg-white text-stone-700 border-[#e6dcc8] hover:bg-[#efe6d4]"
                }`}
              >
                {c || "Todas"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-stone-600">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="text-stone-600">Sin resultados.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected(m)}
                className="text-left bg-white border border-[#e6dcc8] rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                {m.imagen_url && (
                  <img src={m.imagen_url} alt={m.titulo} className="w-full h-40 object-cover" loading="lazy" />
                )}
                <div className="p-4">
                  <div className="text-xs uppercase tracking-wide text-[#2d5016] mb-1">
                    {m.categoria ?? "Saber"}
                  </div>
                  <h3 className="font-serif text-lg text-stone-800">{m.titulo}</h3>
                  <p className="text-sm text-stone-600 line-clamp-3 mt-1">{m.contenido}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-3 py-1.5 rounded-lg border border-[#e6dcc8] bg-white disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-stone-600">
            Página {page + 1} de {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg border border-[#e6dcc8] bg-white disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selected.imagen_url && (
              <img src={selected.imagen_url} alt={selected.titulo} className="w-full h-64 object-cover rounded-t-2xl" />
            )}
            <div className="p-6">
              <div className="text-xs uppercase tracking-wide text-[#2d5016] mb-2">
                {selected.categoria ?? "Saber"} · {new Date(selected.created_at).toLocaleDateString()}
              </div>
              <h2 className="font-serif text-2xl text-stone-800 mb-3">{selected.titulo}</h2>
              <p className="text-stone-700 whitespace-pre-wrap leading-relaxed">{selected.contenido}</p>
              <button
                onClick={() => setSelected(null)}
                className="mt-6 px-4 py-2 bg-[#2d5016] text-white rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
