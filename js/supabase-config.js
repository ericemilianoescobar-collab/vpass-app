/* ==========================================================================
   CONEXIÓN A SUPABASE (ESKORP V-PASS)
   ========================================================================== */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Tus credenciales de Supabase
const SUPABASE_URL = 'https://tu-proyecto.supabase.co'; // Reemplaza con tu URL de Supabase
const SUPABASE_ANON_KEY = 'tu-clave-anon-publica'; // Reemplaza con tu anon key de Supabase

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Autenticación de Organizador
export async function loginOrganizador(email, password) {
    try {
        const { data, error } = await supabase
            .from('organizadores')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) return { success: false, message: "Organizador no encontrado." };
        if (data.password !== password) return { success: false, message: "Contraseña incorrecta." };

        localStorage.setItem('eskorp_session', JSON.stringify({
            tipo: 'organizador',
            email: data.email,
            plan: data.plan_name,
            maxDoors: data.max_doors,
            empresa: data.company_name
        }));
        return { success: true, data };
    } catch (err) {
        return { success: false, message: "Error de conexión con la nube." };
    }
}

// Autenticación de Validador (Puerta)
export async function loginValidador(email, password) {
    try {
        const { data, error } = await supabase
            .from('validadores')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) return { success: false, message: "Acceso de puerta no encontrado." };
        if (data.status !== 'Habilitado') return { success: false, message: "Esta puerta se encuentra bloqueada." };
        if (data.password !== password) return { success: false, message: "Contraseña incorrecta." };

        localStorage.setItem('eskorp_session', JSON.stringify({
            tipo: 'validador',
            email: data.email,
            doorName: data.door_name,
            organizerEmail: data.organizer_email
        }));
        return { success: true, data };
    } catch (err) {
        return { success: false, message: "Error al validar puerta." };
    }
}