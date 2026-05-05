// Edge Function: GET /functions/v1/patient-me
//                 POST /functions/v1/patient-me  (logout)
//
// GET — Devuelve dashboard del paciente autenticado.
// Header: Authorization: Bearer <session_token>
//
// Response:
//   {
//     "patient": { id, full_name, email, phone, ... },
//     "upcoming_appointments": [...],
//     "recent_sales": [...],
//     "pending_payments": [...]
//   }
//
// POST con body { "action": "logout" } → revoca la sesión

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function getBearer(req: Request): string | null {
  const auth = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!auth) return null;
  const match = auth.match(/^Bearer\s+([a-fA-F0-9]{32,})$/);
  return match ? match[1] : null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const token = getBearer(req);
  if (!token) {
    return jsonResponse({ error: 'Missing or invalid Bearer token' }, 401);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  try {
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      if (body?.action === 'logout') {
        await supabase.rpc('patient_session_revoke', { p_token: token });
        return jsonResponse({ ok: true });
      }
      return jsonResponse({ error: 'Acción desconocida' }, 400);
    }

    if (req.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    const { data, error } = await supabase.rpc('patient_get_dashboard', { p_token: token });

    if (error) {
      console.error('patient_get_dashboard error', error);
      return jsonResponse({ error: error.message || 'Sesión inválida' }, 401);
    }

    return jsonResponse(data);
  } catch (e) {
    console.error('patient-me fatal', e);
    return jsonResponse({ error: 'Internal error' }, 500);
  }
});
