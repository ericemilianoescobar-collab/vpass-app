/* ==========================================================================
   BASE DE DATOS CENTRALIZADA DE CLIENTES (ESKORP / V-PASS)
   - Controla: Correo, contraseña, nombre, planes activos (0 o 1) y número de validadores permitidos.
   ========================================================================== */

const databaseOrganizers = [
  {
    email: "admin@eskorp.com",
    password: "AdminPassword2026*",
    name: "Eric Emiliano Escobar (Director General)",
    plans: {
      basico: 0,
      estandar: 0,
      premium: 1 // Plan Premium Activo
    },
    maxValidadores: 5 // Hasta 5 validadores
  },
  {
    email: "nix@eskorp.com",
    password: "NixChilcano2026",
    name: "Organizador NIX (Bebidas RTD)",
    plans: {
      basico: 0,
      estandar: 1, // Plan Estándar Activo (S/ 150 - 350 entradas - 3 validadores)
      premium: 0
    },
    maxValidadores: 3
  },
  {
    email: "luz@eskorp.com",
    password: "ChocotejasLuz2026",
    name: "Organizador Submarca Luz (Confitería)",
    plans: {
      basico: 1, // Plan Básico Activo (S/ 100 - 250 entradas - 1 validador)
      estandar: 0,
      premium: 0
    },
    maxValidadores: 1
  }
];

// Función universal de autenticación
function authenticateOrganizer(email, password) {
  const organizer = databaseOrganizers.find(org => org.email === email && org.password === password);
  
  if (organizer) {
    localStorage.setItem('vpass_logged', 'true');
    localStorage.setItem('vpass_org_name', organizer.name);
    localStorage.setItem('vpass_org_email', organizer.email);
    localStorage.setItem('vpass_plans', JSON.stringify(organizer.plans));
    localStorage.setItem('vpass_max_validadores', organizer.maxValidadores);
    return true;
  }
  return false;
}

function checkSessionOrRedirect() {
  if (localStorage.getItem('vpass_logged') !== 'true') {
    window.location.href = 'login.html';
  }
}

function logoutSession() {
  localStorage.clear();
  window.location.href = 'index.html';
}