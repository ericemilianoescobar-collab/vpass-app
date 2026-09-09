/* ==========================================================================
   SISTEMA CENTRAL DE AUTENTICACIÓN Y DATOS (ESKORP / V-PASS)
   ========================================================================== */

// Base de datos inicial para organizadores
const defaultOrganizers = [
  {
    email: "admin@eskorp.com",
    password: "AdminPassword2026*",
    name: "Eric Emiliano Escobar",
    plans: {
      basico: { active: 0, used: false },
      estandar: { active: 0, used: false },
      premium: { active: 1, used: false } // Plan activo y disponible
    },
    maxValidadores: 5,
    validadoresConfig: [
      { id: 1, name: "Puerta Principal VIP", email: "vip@eskorp.com", pass: "123456", status: "Habilitado" },
      { id: 2, name: "Puerta General 1", email: "gen1@eskorp.com", pass: "123456", status: "Habilitado" },
      { id: 3, name: "Puerta General 2", email: "gen2@eskorp.com", pass: "123456", status: "Habilitado" },
      { id: 4, name: "Puerta Artistas", email: "art@eskorp.com", pass: "123456", status: "Habilitado" },
      { id: 5, name: "Puerta Logística", email: "log@eskorp.com", pass: "123456", status: "Habilitado" }
    ],
    eventos: []
  },
  {
    email: "nix@eskorp.com",
    password: "NixChilcano2026",
    name: "Organizador NIX (Bebidas RTD)",
    plans: {
      basico: { active: 0, used: false },
      estandar: { active: 1, used: false },
      premium: { active: 0, used: false }
    },
    maxValidadores: 3,
    validadoresConfig: [
      { id: 1, name: "Barra Central NIX", email: "nix1@eskorp.com", pass: "nix123", status: "Habilitado" },
      { id: 2, name: "Acceso Terraza", email: "nix2@eskorp.com", pass: "nix123", status: "Habilitado" },
      { id: 3, name: "Ingreso VIP NIX", email: "nix3@eskorp.com", pass: "nix123", status: "Habilitado" }
    ],
    eventos: []
  }
];

// Inicializar almacenamiento si no existe
function initDatabase() {
  if (!localStorage.getItem('vpass_db_orgs')) {
    localStorage.setItem('vpass_db_orgs', JSON.stringify(defaultOrganizers));
  }
}

function getOrganizers() {
  initDatabase();
  return JSON.parse(localStorage.getItem('vpass_db_orgs'));
}

function saveOrganizers(orgs) {
  localStorage.setItem('vpass_db_orgs', JSON.stringify(orgs));
}

// Autenticación de organizadores
function authenticateOrganizer(email, password) {
  const orgs = getOrganizers();
  const org = orgs.find(o => o.email === email && o.password === password);
  if (org) {
    localStorage.setItem('vpass_logged_org', JSON.stringify(org));
    return true;
  }
  return false;
}

// Autenticación para validadores (puertas)
function authenticateValidador(email, password) {
  const orgs = getOrganizers();
  for (let org of orgs) {
    const val = org.validadoresConfig.find(v => v.email === email && v.pass === password && v.status === "Habilitado");
    if (val) {
      localStorage.setItem('vpass_logged_val', JSON.stringify({ ...val, orgEmail: org.email, orgName: org.name }));
      return true;
    }
  }
  return false;
}