import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, User, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('El nombre es obligatorio');
        return;
      }
      if (password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres');
        return;
      }
    }

    if (mode !== 'reset' && password.length < 6) {
      setError('La contraseña es muy corta');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else if (mode === 'signup') {
        await signUp(email, password, fullName.trim());
        setSuccess('Cuenta creada. Revisa tu email para confirmar.');
      } else if (mode === 'reset') {
        await resetPassword(email);
        setSuccess('Enlace de recuperación enviado a tu email.');
      }
    } catch (err) {
      const msg = err.message || '';
      setError(
        msg.includes('Invalid login') ? 'Email o contraseña incorrectos'
        : msg.includes('already registered') ? 'Este email ya está registrado'
        : msg.includes('rate limit') ? 'Demasiados intentos. Espera un momento e inténtalo de nuevo.'
        : msg.includes('invalid') ? 'Email inválido. Usa un email real.'
        : msg.includes('Database error') ? 'Error temporal. Inténtalo de nuevo.'
        : msg || 'Error desconocido'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 clinical-gradient text-on-primary flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-on-primary/20 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">Clinical Sanctuary</span>
          </div>
          <p className="text-on-primary/70 text-sm">by chiropract.co</p>
        </div>

        <div className="space-y-8">
          <h1 className="text-5xl font-extrabold leading-tight editorial-title">
            Tu consultorio,<br />
            <span className="text-on-primary/80">perfeccionado.</span>
          </h1>
          <p className="text-lg text-on-primary/70 max-w-md">
            El CRM diseñado por quiroprácticos, para quiroprácticos. Gestiona pacientes, citas, jornadas y finanzas desde un solo lugar.
          </p>
          <div className="flex gap-6">
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-on-primary/60">Pacientes gestionados</p>
            </div>
            <div>
              <p className="text-3xl font-bold">15+</p>
              <p className="text-sm text-on-primary/60">Años de experiencia</p>
            </div>
            <div>
              <p className="text-3xl font-bold">4.9</p>
              <p className="text-sm text-on-primary/60">Satisfacción</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-on-primary/50">
          © 2025 Dr. Miguel Ángel Díaz & Invent Agency. Todos los derechos reservados.
        </p>
      </div>

      {/* Right panel - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 text-primary mb-2">
              <ShieldCheck size={28} />
              <span className="text-2xl font-bold tracking-tight">Clinical Sanctuary</span>
            </div>
            <p className="text-on-surface-variant text-sm">by chiropract.co</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-on-surface">
              {mode === 'login' ? 'Bienvenido de vuelta' : mode === 'signup' ? 'Crear cuenta' : 'Recuperar contraseña'}
            </h2>
            <p className="text-on-surface-variant mt-2">
              {mode === 'login' ? 'Ingresa a tu consultorio digital' : mode === 'signup' ? 'Empieza a gestionar tu práctica' : 'Te enviaremos un enlace de recuperación'}
            </p>
          </div>

          {error && (
            <div className="bg-error-container/20 text-error border border-error/20 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-secondary-container/20 text-secondary border border-secondary/20 px-4 py-3 rounded-xl text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium text-on-surface-variant block mb-1.5">Nombre completo</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Dr. Juan Pérez"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-on-surface-variant block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="tu@consultorio.com"
                  required
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="text-sm font-medium text-on-surface-variant block mb-1.5">Contraseña</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="••••••••"
                    required
                    minLength={mode === 'signup' ? 8 : 6}
                  />
                </div>
                {mode === 'signup' && (
                  <p className="text-xs text-on-surface-variant mt-1">Mínimo 8 caracteres</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full clinical-gradient text-on-primary py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Ingresar' : mode === 'signup' ? 'Crear cuenta' : 'Enviar enlace'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="text-center space-y-3">
            {mode === 'login' && (
              <>
                <button
                  onClick={() => { setMode('reset'); setError(''); setSuccess(''); }}
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
                <p className="text-sm text-on-surface-variant">
                  ¿No tienes cuenta?{' '}
                  <button
                    onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
                    className="text-primary font-bold hover:underline"
                  >
                    Regístrate
                  </button>
                </p>
              </>
            )}
            {mode === 'signup' && (
              <p className="text-sm text-on-surface-variant">
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                  className="text-primary font-bold hover:underline"
                >
                  Inicia sesión
                </button>
              </p>
            )}
            {mode === 'reset' && (
              <button
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                className="text-sm text-primary font-bold hover:underline"
              >
                Volver al inicio de sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
