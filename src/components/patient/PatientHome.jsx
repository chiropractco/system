import { Calendar, CreditCard, ExternalLink, FileText, LogOut, MapPin, Receipt, Stethoscope, User } from 'lucide-react';
import { usePatientAuth } from '../../contexts/PatientAuthContext';

const CLINIC_NAME = import.meta.env.VITE_CLINIC_NAME || 'chiropract.co';

const APPOINTMENT_TYPE_LABEL = {
  primera_consulta: 'Primera consulta',
  seguimiento: 'Seguimiento',
  jornada: 'Jornada',
  emergencia: 'Emergencia',
};

const STATUS_BADGE = {
  pendiente: 'bg-amber-100 text-amber-800',
  confirmada: 'bg-emerald-100 text-emerald-800',
  cancelada: 'bg-red-100 text-red-800',
  completada: 'bg-slate-100 text-slate-700',
};

function formatCOP(amount) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
    .format(amount || 0);
}

function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
}

function formatTime(t) {
  if (!t) return '';
  const [h, m] = String(t).split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${m} ${ampm}`;
}

export default function PatientHome() {
  const { dashboard, signOut, loading, error, refresh } = usePatientAuth();

  if (loading && !dashboard) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full clinical-gradient mx-auto mb-3 animate-pulse" />
          <p className="text-on-surface-variant text-sm">Cargando tus datos...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <p className="text-on-surface mb-3">{error}</p>
          <button onClick={refresh} className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-medium">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const patient = dashboard?.patient || {};
  const appointments = dashboard?.upcoming_appointments || [];
  const sales = dashboard?.recent_sales || [];
  const pending = dashboard?.pending_payments || [];

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logos/v1-spine-mark.svg" alt={CLINIC_NAME} className="h-9 w-auto" />
            <div>
              <p className="text-sm font-bold text-on-surface leading-tight">{CLINIC_NAME}</p>
              <p className="text-xs text-on-surface-variant leading-tight">Panel del paciente</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-error px-3 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Saludo */}
        <section className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-full clinical-gradient flex items-center justify-center text-on-primary">
              <User size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-on-surface">Hola, {patient.full_name?.split(' ')[0] || 'paciente'}</h1>
              <p className="text-sm text-on-surface-variant">{patient.appointments_count || 0} citas en total</p>
            </div>
          </div>
        </section>

        {/* Pagos pendientes — destacado si hay */}
        {pending.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-on-surface uppercase tracking-wide mb-2 px-1 flex items-center gap-2">
              <CreditCard size={14} />
              Pagos pendientes
            </h2>
            <div className="space-y-2">
              {pending.map((p) => (
                <div
                  key={p.id}
                  className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-on-surface text-sm truncate">{p.description || 'Pago pendiente'}</p>
                    <p className="text-lg font-bold text-amber-900">{formatCOP(p.amount)}</p>
                  </div>
                  {p.payment_url && (
                    <a
                      href={p.payment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1.5 whitespace-nowrap"
                    >
                      Pagar
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Próximas citas */}
        <section>
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-wide mb-2 px-1 flex items-center gap-2">
            <Calendar size={14} />
            Próximas citas
          </h2>
          {appointments.length === 0 ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 text-center">
              <Calendar size={28} className="mx-auto text-on-surface-variant mb-2" />
              <p className="text-sm text-on-surface-variant">No tienes citas programadas.</p>
              <p className="text-xs text-on-surface-variant mt-1">Escríbenos por WhatsApp para agendar.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {appointments.map((a) => (
                <div
                  key={a.id}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-on-surface capitalize">{formatDate(a.date)}</p>
                      <p className="text-2xl font-bold text-primary">{formatTime(a.time)}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${STATUS_BADGE[a.status] || 'bg-slate-100 text-slate-700'}`}>
                      {a.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <Stethoscope size={12} />
                      {a.doctor_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={12} />
                      {APPOINTMENT_TYPE_LABEL[a.type] || a.type}
                    </span>
                    {a.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {a.location}
                      </span>
                    )}
                    {a.price > 0 && (
                      <span className="ml-auto font-semibold text-on-surface">{formatCOP(a.price)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recibos recientes */}
        <section>
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-wide mb-2 px-1 flex items-center gap-2">
            <Receipt size={14} />
            Recibos recientes
          </h2>
          {sales.length === 0 ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 text-center">
              <Receipt size={28} className="mx-auto text-on-surface-variant mb-2" />
              <p className="text-sm text-on-surface-variant">Aún no tienes recibos.</p>
            </div>
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl divide-y divide-outline-variant overflow-hidden">
              {sales.map((s) => (
                <div key={s.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface">
                      {new Date(s.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-on-surface-variant capitalize">
                      {s.payment_method || 'Pago'} · {s.status}
                    </p>
                  </div>
                  <p className="font-bold text-on-surface">{formatCOP(s.total)}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <p className="text-center text-xs text-on-surface-variant pt-4 pb-2">
          ¿Necesitas algo? Escríbenos por WhatsApp.
        </p>
      </main>
    </div>
  );
}
