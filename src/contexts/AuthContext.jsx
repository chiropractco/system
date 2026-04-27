import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// Site URL fija para auth redirects (SEC-005). Si VITE_PUBLIC_SITE_URL
// no está definida, fallback a window.location.origin (solo dev).
const SITE_URL = import.meta.env.VITE_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadProfileAndTenant(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadProfileAndTenant(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setTenant(null);
        setMembership(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const ensureProfile = async (userId, fullName) => {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (!existing) {
      await supabase
        .from('profiles')
        .insert({ id: userId, full_name: fullName || 'Usuario' });
    }
  };

  const loadProfileAndTenant = async (userId) => {
    try {
      let { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!prof) {
        await ensureProfile(userId);
        const { data: newProf } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        setProfile(newProf);
        prof = newProf;
      } else {
        setProfile(prof);
      }

      if (prof?.default_tenant_id) {
        const { data: ten } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', prof.default_tenant_id)
          .single();

        const { data: mem } = await supabase
          .from('tenant_memberships')
          .select('*')
          .eq('user_id', userId)
          .eq('tenant_id', prof.default_tenant_id)
          .single();

        setTenant(ten);
        setMembership(mem);
      }
    } catch (err) {
      logger.error('load profile/tenant', err);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${SITE_URL}/#crm`,
      },
    });
    if (error) throw error;

    // If user is immediately available (email confirmation disabled), create profile
    if (data.user && !data.session) {
      // Email confirmation required - user needs to verify
      return data;
    }
    if (data.user) {
      await ensureProfile(data.user.id, fullName);
    }
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
    setTenant(null);
    setMembership(null);
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/reset-password`,
    });
    if (error) throw error;
  };

  const isSlugAvailable = async (slug) => {
    const { data, error } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    if (error) return true;
    return !data;
  };

  const createTenant = async (name, slug, extra = {}) => {
    // Llamada a RPC transaccional (crea tenant + membership + actualiza profile en una sola tx).
    const { data, error } = await supabase.rpc('create_tenant_with_owner', {
      p_name: name,
      p_slug: slug,
      p_city: extra.city || null,
      p_phone: extra.phone || null,
      p_plan: extra.plan || 'trial',
    });

    if (error) {
      if (error.code === '23505' || error.message?.includes('en uso')) {
        throw new Error('Esa URL ya está en uso. Elige otra.');
      }
      logger.error('createTenant', error);
      throw new Error('No se pudo crear el consultorio. Inténtalo de nuevo.');
    }

    setTenant(data);
    setMembership({ role: 'owner', tenant_id: data.id });
    setProfile((prev) => prev ? { ...prev, default_tenant_id: data.id } : prev);
    return data;
  };

  const updateProfile = async (updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (error) throw error;
    setProfile(data);
    return data;
  };

  const updateTenant = async (updates) => {
    const { data, error } = await supabase
      .from('tenants')
      .update(updates)
      .eq('id', tenant.id)
      .select()
      .single();
    if (error) throw error;
    setTenant(data);
    return data;
  };

  const value = {
    user,
    profile,
    tenant,
    membership,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    createTenant,
    isSlugAvailable,
    updateProfile,
    updateTenant,
    refreshTenant: () => loadProfileAndTenant(user.id),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
