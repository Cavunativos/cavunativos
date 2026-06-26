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
        <div className="bg-white border border-[#e6dcc8] rounded-lg p-4 mb-6">
          <p className="text-xs uppercase tracking-wide text-stone-500 mb-2">
            Tu UUID de usuario {isAdmin && <span className="text-[#2d5016] normal-case">· admin ✓</span>}
          </p>
          <div className="flex items-stretch gap-2">
            <input
              readOnly
              value={userId}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 font-mono text-sm bg-[#f5efe4] border border-[#e6dcc8] rounded-md px-3 py-2 text-stone-800 select-all"
            />
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(userId);
                  alert("UUID copiado al portapapeles");
                } catch {
                  alert(userId);
                }
              }}
              className="px-3 py-2 bg-[#2d5016] text-white rounded-md text-sm hover:bg-[#3d6a1f]"
            >
              Copiar
            </button>
          </div>
          {!isAdmin && (
            <p className="text-xs text-amber-800 mt-2">
              Aún no eres administrador. Comparte este UUID para que te asignen el rol <strong>admin</strong>.
            </p>
          )}
        </div>

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
            <label className="text-sm text-stone-700">Imagen (sube un archivo o pega URL)</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                setError(null);
                const ext = file.name.split(".").pop() || "jpg";
                const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
                const up = await supabase.storage.from("mensajes").upload(path, file, {
                  contentType: file.type,
                  upsert: false,
                });
                if (up.error) {
                  setError(up.error.message);
                  setUploading(false);
                  return;
                }
                const signed = await supabase.storage
                  .from("mensajes")
                  .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
                if (signed.data?.signedUrl) setImagenUrl(signed.data.signedUrl);
                setUploading(false);
              }}
              className="mt-1 w-full text-sm"
            />
            {uploading && <p className="text-xs text-stone-500 mt-1">Subiendo…</p>}
            <input
              type="url"
              value={imagen_url}
              onChange={(e) => setImagenUrl(e.target.value)}
              placeholder="https://… (o queda lleno tras subir)"
              className="mt-2 w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
            {imagen_url && (
              <img src={imagen_url} alt="preview" className="mt-2 h-24 rounded-lg object-cover" />
            )}
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
