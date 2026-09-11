// Cliente global de Supabase configurado por CDN clásico
const SUPABASE_URL = 'https://bkvjrzzufqqvyuhytvc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__gFLNEd1OZWH8E_jeTmM2w_kTisJ...'; 

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Login de Organizador
export async function loginOrganizador(email, password) {
    try {
        const { data, error } = await supabase
            .from('organizadores')
            .select('*')
            .eq('email', email.trim())
            .maybeSingle();

        if (error) {
            console.error("Supabase Error:", error);
            return { success: false, message: "Error en la base de datos: " + error.message };
        }
        if (!data) {
            return { success: false, message: "El correo no está registrado en organizadores." };
        }
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
        console.error("Fetch Error:", err);
        return { success: false, message: "Error crítico de conexión con la nube." };
    }
}

// Login de Validador
export async function loginValidador(email, password) {
    try {
        const { data, error } = await supabase
            .from('validadores')
            .select('*')
            .eq('email', email.trim())
            .maybeSingle();

        if (error || !data) {
            return { success: false, message: "Puerta no encontrada en la base de datos." };
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
            doorName: data.door_name || 'Puerta Principal',
            organizerEmail: data.organizer_email
        }));

        return { success: true, data };
    } catch (err) {
        return { success: false, message: "Error al validar puerta en la nube." };
    }
}