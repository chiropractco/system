import { useState } from 'react';
import { Search, Plus, X, Edit2, Phone, Mail, MapPin, ChevronRight, Filter } from 'lucide-react';
import { patientStatuses, formatCOP, formatDate } from '../utils/format';
import { usePatients } from '../hooks/useTenantData';

export default function Pacientes() {
  const { patients, loading, insertPatient, updatePatient, removePatient } = usePatients();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const patientList = patients.map((p) => ({
    ...p,
    name: p.full_name,
    totalSpent: p.total_spent,
    appointmentsCount: p.appointments_count,
    lastVisit: p.last_visit,
  }));

  const filtered = patientList.filter((p) => {
    const matchSearch = search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchCity = filterCity === 'all' || p.city === filterCity;
    return matchSearch && matchStatus && matchCity;
  });

  const uniqueCities = [...new Set(patientList.filter((p) => p.city).map((p) => p.city))];

  const statusBadge = (status) => {
    const s = patientStatuses.find((ps) => ps.value === status);
    const colors = {
      activo: 'bg-green-100 text-green-700',
      inactivo: 'bg-gray-100 text-gray-600',
      en_tratamiento: 'bg-blue-100 text-blue-700',
      completado: 'bg-teal-100 text-teal-700',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
        {s?.label || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Pacientes</h2>
          <p className="text-on-surface-variant text-sm mt-1">{patientList.length} pacientes registrados</p>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> Nuevo Paciente
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">Todos los estados</option>
          {patientStatuses.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <select
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">Todas las ciudades</option>
          {uniqueCities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Patient List */}
      {loading ? (
        <div className="bg-surface-container-lowest rounded-xl shadow-clinical border border-outline-variant p-12 text-center">
          <p className="text-on-surface-variant">Cargando pacientes...</p>
        </div>
      ) : (
      <div className="bg-surface-container-lowest rounded-xl shadow-clinical border border-outline-variant overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">Nombre</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">Teléfono</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">Ciudad</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">Estado</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">Última visita</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">Total</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="border-b border-outline-variant/30 hover:bg-surface-container-low/50 cursor-pointer transition-colors"
                onClick={() => setSelectedPatient(p)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      {p.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-surface">{p.name}</p>
                      {p.vip && <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-bold">VIP</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-on-surface-variant">{p.phone}</td>
                <td className="px-4 py-3 text-sm text-on-surface-variant">{p.city}</td>
                <td className="px-4 py-3">{statusBadge(p.status)}</td>
                <td className="px-4 py-3 text-sm text-on-surface-variant">{formatShortDateLocal(p.lastVisit)}</td>
                <td className="px-4 py-3 text-sm font-medium text-on-surface text-right">{formatCOP(p.totalSpent)}</td>
                <td className="px-4 py-3">
                  <ChevronRight size={16} className="text-on-surface-variant/50" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-on-surface-variant/70 text-sm">No se encontraron pacientes</div>
        )}
      </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && !showEditForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPatient(null)}>
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-on-surface">{selectedPatient.name}</h3>
              <button onClick={() => setSelectedPatient(null)} className="text-on-surface-variant/50 hover:text-on-surface-variant"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {statusBadge(selectedPatient.status)}
                {selectedPatient.vip && <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold">VIP</span>}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-on-surface-variant"><Phone size={14} /> {selectedPatient.phone}</div>
                <div className="flex items-center gap-2 text-on-surface-variant"><Mail size={14} /> {selectedPatient.email}</div>
                <div className="flex items-center gap-2 text-on-surface-variant col-span-2"><MapPin size={14} /> {selectedPatient.address}</div>
              </div>
              <div className="bg-surface-container-low rounded-lg p-4">
                <p className="text-xs text-on-surface-variant/70 mb-1">Tratamiento</p>
                <p className="text-sm font-medium text-on-surface">{selectedPatient.treatment}</p>
              </div>
              <div className="bg-surface-container-low rounded-lg p-4">
                <p className="text-xs text-on-surface-variant/70 mb-1">Notas del doctor</p>
                <p className="text-sm text-on-surface">{selectedPatient.notes}</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-primary/5 rounded-lg p-3">
                  <p className="text-lg font-bold text-primary">{selectedPatient.appointmentsCount}</p>
                  <p className="text-xs text-on-surface-variant">Citas</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-lg font-bold text-success">{formatCOP(selectedPatient.totalSpent)}</p>
                  <p className="text-xs text-on-surface-variant">Total</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-lg font-bold text-blue-600">{formatShortDateLocal(selectedPatient.lastVisit)}</p>
                  <p className="text-xs text-on-surface-variant">Última visita</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowEditForm(true); }}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit2 size={14} /> Editar
                </button>
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                  <Phone size={14} /> WhatsApp
                </button>
              </div>
              {confirmDelete ? (
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-danger font-medium mb-2">¿Eliminar este paciente?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => { await removePatient(selectedPatient.id); setSelectedPatient(null); setConfirmDelete(false); }}
                      className="flex-1 bg-danger text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                    >Sí, eliminar</button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 bg-surface-container text-on-surface-variant py-2 rounded-lg text-sm font-medium hover:bg-surface-container-high transition-colors"
                    >Cancelar</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full text-danger/70 hover:text-danger text-sm py-2 transition-colors"
                >Eliminar paciente</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Patient Form Modal */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowNewForm(false)}>
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-on-surface">Nuevo Paciente</h3>
              <button onClick={() => setShowNewForm(false)} className="text-on-surface-variant/50 hover:text-on-surface-variant"><X size={20} /></button>
            </div>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              await insertPatient({
                full_name: form.full_name.value,
                phone: form.phone.value || null,
                email: form.email.value || null,
                address: form.address.value || null,
                city: form.city.value,
                status: form.status.value,
                treatment: form.treatment.value || null,
                notes: form.notes.value || null,
              });
              setShowNewForm(false);
            }}>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-on-surface-variant block mb-1">Nombre completo</label>
                  <input name="full_name" required className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Nombre completo" />
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant block mb-1">Teléfono</label>
                  <input name="phone" className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="311-234-5678" />
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant block mb-1">Email</label>
                  <input name="email" type="email" className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="email@ejemplo.com" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-on-surface-variant block mb-1">Dirección</label>
                  <input name="address" className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Dirección completa" />
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant block mb-1">Ciudad</label>
                  <select name="city" className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option>Bogotá</option><option>Soatá</option><option>Guamal</option><option>Muzo</option><option>Garcés Navas</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant block mb-1">Estado</label>
                  <select name="status" className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {patientStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-on-surface-variant block mb-1">Tratamiento</label>
                  <input name="treatment" className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Tratamiento inicial" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-on-surface-variant block mb-1">Notas</label>
                  <textarea name="notes" className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" rows={3} placeholder="Notas del doctor..." />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                Guardar Paciente
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Patient Form Modal */}
      {showEditForm && selectedPatient && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { setShowEditForm(false); setSelectedPatient(null); }}>
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-on-surface">Editar Paciente</h3>
              <button onClick={() => { setShowEditForm(false); setSelectedPatient(null); }} className="text-on-surface-variant/50 hover:text-on-surface-variant"><X size={20} /></button>
            </div>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              await updatePatient(selectedPatient.id, {
                full_name: form.full_name.value,
                phone: form.phone.value || null,
                email: form.email.value || null,
                address: form.address.value || null,
                city: form.city.value,
                status: form.status.value,
                treatment: form.treatment.value || null,
                notes: form.notes.value || null,
              });
              setShowEditForm(false);
              setSelectedPatient(null);
            }}>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-on-surface-variant block mb-1">Nombre completo</label>
                  <input name="full_name" required defaultValue={selectedPatient.name} className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant block mb-1">Teléfono</label>
                  <input name="phone" defaultValue={selectedPatient.phone} className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant block mb-1">Email</label>
                  <input name="email" type="email" defaultValue={selectedPatient.email} className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-on-surface-variant block mb-1">Dirección</label>
                  <input name="address" defaultValue={selectedPatient.address} className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant block mb-1">Ciudad</label>
                  <select name="city" defaultValue={selectedPatient.city} className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option>Bogotá</option><option>Soatá</option><option>Guamal</option><option>Muzo</option><option>Garcés Navas</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant block mb-1">Estado</label>
                  <select name="status" defaultValue={selectedPatient.status} className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {patientStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-on-surface-variant block mb-1">Tratamiento</label>
                  <input name="treatment" defaultValue={selectedPatient.treatment} className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-on-surface-variant block mb-1">Notas</label>
                  <textarea name="notes" defaultValue={selectedPatient.notes} className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" rows={3} />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function formatShortDateLocal(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}
