import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Leaf, LogOut, Plus, Trash2, Pencil, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

type Mensaje = {
  id: string;
  titulo: string;
  contenido: string;
  imagen_url: string | null;
  categoria: string | null;
  publicado: boolean;
  created_at: string;
};

const CATEGORIAS = ["Alimentación", "Pesca", "Saberes", "Reparaciones", "Vida Sana", "Naturaleza"];

function AdminPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [editing, setEditing] = useState<Mensaje | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: ures } = await supabase.auth.getUser();
      const uid = ures.user?.id ?? "";
      setUserId(uid);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid);
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));
      await load();
    })();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("mensajes")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as Mensaje[]) ?? []);
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este mensaje?")) return;
    await supabase.from("mensajes").delete().eq("id", id);
    await load();
  }

  if (isAdmin === null) {
    return <div className="p-8 text-center text-stone-600">Cargando…</div>;
  }

  return (
    <main className="min-h-screen bg-[#f5efe4]">
      <header className="bg-white border-b border-[#e6dcc8] px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[#2d5016]">
          <Leaf className="w-5 h-5" />
          <span className="font-serif text-lg">Cavunativos · Admin</span>
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-stone-700 hover:text-[#2d5016]"
        >
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {!isAdmin && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4 mb-6 text-sm">
            <p className="font-medium mb-1">Aún no eres administrador.</p>
            <p>
              Para poder publicar mensajes, comparte este ID con tu administrador del proyecto para que te asigne el rol <strong>admin</strong>:
            </p>
            <code className="block mt-2 bg-white p-2 rounded border border-amber-200 text-xs break-all">
              {userId}
            </code>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-serif text-[#2d5016]">Mensajes</h1>
          {isAdmin && (
            <button
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-[#2d5016] text-white px-4 py-2 rounded-lg hover:bg-[#3d6a1f]"
            >
              <Plus className="w-4 h-4" /> Nuevo
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-stone-600">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="text-stone-600">Aún no hay mensajes publicados.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((m) => (
              <li
                key={m.id}
                className="bg-white border border-[#e6dcc8] rounded-lg p-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                    <span>{m.categoria ?? "Sin categoría"}</span>
                    <span>·</span>
                    <span>{new Date(m.created_at).toLocaleDateString()}</span>
                    {!m.publicado && (
                      <span className="text-amber-700">· Borrador</span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg text-[#2d5016]">{m.titulo}</h3>
                  <p className="text-sm text-stone-600 line-clamp-2">{m.contenido}</p>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(m);
                        setShowForm(true);
                      }}
                      className="p-2 text-stone-600 hover:text-[#2d5016]"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => remove(m.id)}
                      className="p-2 text-stone-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {showForm && isAdmin && (
        <MensajeForm
          mensaje={editing}
          onClose={() => setShowForm(false)}
          onSaved={async () => {
            setShowForm(false);
            await load();
          }}
        />
      )}
    </main>
  );
}

function MensajeForm({
  mensaje,
  onClose,
  onSaved,
}: {
  mensaje: Mensaje | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [titulo, setTitulo] = useState(mensaje?.titulo ?? "");
  const [contenido, setContenido] = useState(mensaje?.contenido ?? "");
  const [categoria, setCategoria] = useState(mensaje?.categoria ?? CATEGORIAS[0]);
  const [imagen_url, setImagenUrl] = useState(mensaje?.imagen_url ?? "");
  const [publicado, setPublicado] = useState(mensaje?.publicado ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { titulo, contenido, categoria, imagen_url: imagen_url || null, publicado };
    const { error } = mensaje
      ? await supabase.from("mensajes").update(payload).eq("id", mensaje.id)
      : await supabase.from("mensajes").insert(payload);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-[#e6dcc8]">
          <h2 className="font-serif text-xl text-[#2d5016]">
            {mensaje ? "Editar mensaje" : "Nuevo mensaje"}
          </h2>
          <button onClick={onClose} className="text-stone-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={save} className="p-5 space-y-4">
          <div>
            <label className="text-sm text-stone-700">Título</label>
            <input
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm text-stone-700">Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
            >
              {CATEGORIAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-stone-700">Contenido</label>
            <textarea
              required
              rows={6}
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm text-stone-700">URL de imagen (opcional)</label>
            <input
              type="url"
              value={imagen_url}
              onChange={(e) => setImagenUrl(e.target.value)}
              placeholder="https://…"
              className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={publicado}
              onChange={(e) => setPublicado(e.target.checked)}
            />
            Publicado (visible para todos)
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-[#2d5016] text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
