import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useTenantData(table, options = {}) {
  const { tenant } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    if (!tenant?.id) return;
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from(table)
        .select(options.select || '*')
        .eq('tenant_id', tenant.id);

      if (options.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending ?? false });
      }

      const { data: rows, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setData(rows || []);
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tenant?.id, table, options.select, options.order?.column, options.order?.ascending]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const insert = async (record) => {
    if (!tenant?.id) return { error: 'No tenant' };
    const { data: row, error: insertError } = await supabase
      .from(table)
      .insert({ ...record, tenant_id: tenant.id })
      .select()
      .single();
    if (insertError) {
      console.error(`Error inserting ${table}:`, insertError);
      return { error: insertError.message };
    }
    setData((prev) => [row, ...prev]);
    return { data: row };
  };

  const update = async (id, updates) => {
    const { data: row, error: updateError } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (updateError) {
      console.error(`Error updating ${table}:`, updateError);
      return { error: updateError.message };
    }
    setData((prev) => prev.map((r) => (r.id === id ? row : r)));
    return { data: row };
  };

  const remove = async (id) => {
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    if (deleteError) {
      console.error(`Error deleting ${table}:`, deleteError);
      return { error: deleteError.message };
    }
    setData((prev) => prev.filter((r) => r.id !== id));
    return { success: true };
  };

  return { data, loading, error, insert, update, remove, refetch: fetchAll };
}

export function usePatients() {
  const { data, loading, error, insert, update, remove, refetch } = useTenantData('patients', {
    order: { column: 'created_at', ascending: false },
  });
  return { patients: data, loading, error, insertPatient: insert, updatePatient: update, removePatient: remove, refetchPatients: refetch };
}

export function useAppointments() {
  const { data, loading, error, insert, update, remove, refetch } = useTenantData('appointments', {
    select: '*',
    order: { column: 'date', ascending: true },
  });
  return { appointments: data, loading, error, insertAppointment: insert, updateAppointment: update, removeAppointment: remove, refetchAppointments: refetch };
}

export function useJornadas() {
  const { data, loading, error, insert, update, remove, refetch } = useTenantData('jornadas', {
    order: { column: 'date', ascending: true },
  });
  return { jornadas: data, loading, error, insertJornada: insert, updateJornada: update, refetchJornadas: refetch };
}

export function useLeads() {
  const { data, loading, error, insert, update, refetch } = useTenantData('leads', {
    order: { column: 'date', ascending: false },
  });
  return { leads: data, loading, error, insertLead: insert, updateLead: update, refetchLeads: refetch };
}

export function useTransactions() {
  const { data, loading, error, insert, update, refetch } = useTenantData('transactions', {
    order: { column: 'date', ascending: false },
  });
  return { transactions: data, loading, error, insertTransaction: insert, updateTransaction: update, refetchTransactions: refetch };
}

export function useAlerts() {
  const { data, loading, error, insert, update, refetch } = useTenantData('alerts', {
    order: { column: 'created_at', ascending: false },
  });
  return { alerts: data, loading, error, insertAlert: insert, updateAlert: update, refetchAlerts: refetch };
}

export function useScheduledContent() {
  const { data, loading, error, insert, update, refetch } = useTenantData('scheduled_content', {
    order: { column: 'date', ascending: true },
  });
  return { scheduledContent: data, loading, error, insertContent: insert, updateContent: update, refetchContent: refetch };
}

export function useServices() {
  const { data, loading, error, insert, update, remove, refetch } = useTenantData('services', {
    order: { column: 'created_at', ascending: false },
  });
  return { services: data, loading, error, insertService: insert, updateService: update, removeService: remove, refetchServices: refetch };
}

export function useProducts() {
  const { data, loading, error, insert, update, remove, refetch } = useTenantData('products', {
    order: { column: 'created_at', ascending: false },
  });
  return { products: data, loading, error, insertProduct: insert, updateProduct: update, removeProduct: remove, refetchProducts: refetch };
}

export function useJornadaOfferings(jornadaId) {
  const { tenant } = useAuth();
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOfferings = useCallback(async () => {
    if (!tenant?.id || !jornadaId) {
      setOfferings([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('jornada_offerings')
        .select('*, services(*), products(*)')
        .eq('tenant_id', tenant.id)
        .eq('jornada_id', jornadaId);
      if (fetchError) throw fetchError;
      setOfferings(data || []);
    } catch (err) {
      console.error('Error fetching jornada_offerings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tenant?.id, jornadaId]);

  useEffect(() => {
    fetchOfferings();
  }, [fetchOfferings]);

  const addOffering = async ({ itemType, itemId, priceOverride = null }) => {
    if (!tenant?.id || !jornadaId) return { error: 'No tenant or jornada' };
    const record = {
      tenant_id: tenant.id,
      jornada_id: jornadaId,
      item_type: itemType,
      service_id: itemType === 'service' ? itemId : null,
      product_id: itemType === 'product' ? itemId : null,
      price_override: priceOverride,
    };
    const { data, error: insertError } = await supabase
      .from('jornada_offerings')
      .insert(record)
      .select('*, services(*), products(*)')
      .single();
    if (insertError) return { error: insertError.message };
    setOfferings((prev) => [...prev, data]);
    return { data };
  };

  const removeOffering = async (id) => {
    const { error: deleteError } = await supabase
      .from('jornada_offerings')
      .delete()
      .eq('id', id);
    if (deleteError) return { error: deleteError.message };
    setOfferings((prev) => prev.filter((o) => o.id !== id));
    return { success: true };
  };

  return { offerings, loading, error, addOffering, removeOffering, refetchOfferings: fetchOfferings };
}

export function useSales() {
  const { tenant } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSales = useCallback(async () => {
    if (!tenant?.id) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('sales')
        .select('*, sale_items(*), patients(full_name), jornadas(city, date)')
        .eq('tenant_id', tenant.id)
        .order('date', { ascending: false });
      if (fetchError) throw fetchError;
      setSales(data || []);
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tenant?.id]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const createSale = async ({ jornadaId = null, patientId = null, appointmentId = null, items, paymentMethod = 'efectivo', notes = '', date = null }) => {
    if (!tenant?.id) return { error: 'No tenant' };
    if (!items || items.length === 0) return { error: 'Debe haber al menos un item' };

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert({
        tenant_id: tenant.id,
        jornada_id: jornadaId,
        patient_id: patientId,
        appointment_id: appointmentId,
        total,
        payment_method: paymentMethod,
        notes,
        date: date || new Date().toISOString().slice(0, 10),
      })
      .select()
      .single();

    if (saleError) {
      console.error('Error creating sale:', saleError);
      return { error: saleError.message };
    }

    const itemRecords = items.map((item) => ({
      sale_id: sale.id,
      item_type: item.itemType,
      service_id: item.itemType === 'service' ? item.itemId : null,
      product_id: item.itemType === 'product' ? item.itemId : null,
      item_name: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      subtotal: item.subtotal,
    }));

    const { error: itemsError } = await supabase.from('sale_items').insert(itemRecords);
    if (itemsError) {
      await supabase.from('sales').delete().eq('id', sale.id);
      return { error: itemsError.message };
    }

    for (const item of items) {
      if (item.itemType === 'product') {
        const { error: rpcError } = await supabase.rpc('decrement_product_stock', {
          p_id: item.itemId,
          qty: item.quantity,
        });
        if (rpcError) {
          console.error(`Error descontando stock de ${item.name}:`, rpcError);
        }
      }
    }

    await fetchSales();
    return { data: sale };
  };

  const cancelSale = async (id) => {
    const { data, error: updateError } = await supabase
      .from('sales')
      .update({ status: 'cancelada' })
      .eq('id', id)
      .select()
      .single();
    if (updateError) return { error: updateError.message };
    setSales((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    return { data };
  };

  return { sales, loading, error, createSale, cancelSale, refetchSales: fetchSales };
}
