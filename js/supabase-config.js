import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Tus credenciales reales de Supabase
const SUPABASE_URL = 'https://tu-proyecto.supabase.co'; // Reemplaza con tu URL
const SUPABASE_ANON_KEY = 'tu-clave-anon-publica'; // Reemplaza con tu Anon Key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Login real de Organizador consultando la tabla 'organizadores'
export async function loginOrganizador(email, password) {
    try {
        const { data, error } = await supabase
            .from('organizadores')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) {
            return { success: false, message: "Organizador no registrado en la base de datos." };
        }
        
        // Comprobación de contraseña (si guardas texto plano o hash)
        if (data.password !== password) {
            return { success: false, message: "Contraseña incorrecta." };
        }

        localStorage.setItem('eskorp_session', JSON.stringify({
            tipo: 'organizador',
            email: data.email,
            plan: data.plan_name || 'Estándar',
            maxDoors: data.max_doors || 1,
            empresa: data.company_name || 'ESKORP V-PASS'
        }));

        return { success: true, data };
    } catch (err) {
        console.error(err);
        return { success: false, message: "Error de conexión con Supabase." };
    }
}

// Login real de Validador consultando la tabla 'validadores'
export async function loginValidador(email, password) {
    try {
        const { data, error } = await supabase
            .from('validadores')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) {
            return { success: false, message: "Puerta o validador no encontrado." };
        }
        if (data.status && data.status !== 'Habilitado') {
            return { success: false, message: "Esta puerta se encuentra bloqueada." };
        }
        if (data.password !== password) {
            return { success: false, message: "Contraseña incorrecta." };
        }

        localStorage.setItem('eskorp_session', JSON.stringify({
            tipo: 'validador',
            email: data.email,
            doorName: data.door_name || 'Puerta 1',
            organizerEmail: data.organizer_email
        }));

        return { success: true, data };
    } catch (err) {
        console.error(err);
        return { success: false, message: "Error al validar la puerta en la nube." };
    }
}