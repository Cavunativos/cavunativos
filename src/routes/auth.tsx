import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Leaf } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err: any) {
      setError(err.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5efe4] p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-[#e6dcc8]">
        <Link to="/" className="flex items-center gap-2 mb-6 text-[#2d5016]">
          <Leaf className="w-6 h-6" />
          <span className="font-serif text-xl">Cavunativos</span>
        </Link>
        <h1 className="text-2xl font-serif text-[#2d5016] mb-2">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h1>
        <p className="text-sm text-stone-600 mb-6">
          Acceso al panel de administración.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-stone-700">Correo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5016]/30"
            />
          </div>
          <div>
            <label className="text-sm text-stone-700">Contraseña</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5016]/30"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2d5016] text-white py-2.5 rounded-lg font-medium hover:bg-[#3d6a1f] transition disabled:opacity-50"
          >
            {loading ? "..." : mode === "login" ? "Entrar" : "Registrarme"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 text-sm text-[#2d5016] hover:underline w-full text-center"
        >
          {mode === "login"
            ? "¿No tienes cuenta? Crear una"
            : "Ya tengo cuenta, iniciar sesión"}
        </button>
      </div>
    </main>
  );
}
