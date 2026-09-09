/* ==========================================================================
   BASE DE DATOS CENTRALIZADA DE CLIENTES Y PLANES (ESKORP / V-PASS)
   - Controla correos, contraseñas, nombres y activación de planes (0 = Inactivo, 1 = Activo).
   ========================================================================== */

const databaseOrganizers = [
  {
    email: "admin@eskorp.com",
    password: "AdminPassword2026*",
    name: "Eric Emiliano Escobar (Director General)",
    plans: {
      basico: 1,
      estandar: 1,
      premium: 1 // Acceso total corporativo
    }
  },
  {
    email: "nix@eskorp.com",
    password: "NixChilcano2026",
    name: "Submarca NIX (Bebidas RTD)",
    plans: {
      basico: 0,
      estandar: 1, // Plan Estándar activo
      premium: 0
    }
  },
  {
    email: "luz@eskorp.com",
    password: "ChocotejasLuz2026",
    name: "Submarca Luz (Confitería)",
    plans: {
      basico: 1, // Plan Básico activo
      estandar: 0,
      premium: 0
    }
  }
];

// Función universal de autenticación
function authenticateOrganizer(email, password) {
  const organizer = databaseOrganizers.find(org => org.email === email && org.password === password);
  
  if (organizer) {
    // Guardar sesión y planes activos en el navegador del cliente de forma segura
    localStorage.setItem('vpass_logged', 'true');
    localStorage.setItem('vpass_org_name', organizer.name);
    localStorage.setItem('vpass_org_email', organizer.email);
    localStorage.setItem('vpass_plans', JSON.stringify(organizer.plans));
    return true;
  }
  return false;
}

// Función para verificar si hay sesión activa en páginas protegidas
function checkSessionOrRedirect() {
  if (localStorage.getItem('vpass_logged') !== 'true') {
    window.location.href = 'login.html';
  }
}

// Función para cerrar sesión
function logoutSession() {
  localStorage.clear();
  window.location.href = 'index.html';
}