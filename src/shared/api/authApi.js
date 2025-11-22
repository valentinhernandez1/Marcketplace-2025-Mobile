// Usuarios de prueba almacenados localmente
const USUARIOS_PRUEBA = [
  {
    id: '1',
    email: 'solicitante@mail.com',
    password: '123',
    nombre: 'Juan Solicitante',
    rol: 'SOLICITANTE',
  },
  {
    id: '2',
    email: 'servicio@mail.com',
    password: '123',
    nombre: 'María Proveedora',
    rol: 'PROVEEDOR_SERVICIO',
  },
  {
    id: '3',
    email: 'insumos@mail.com',
    password: '123',
    nombre: 'Carlos Proveedor',
    rol: 'PROVEEDOR_INSUMOS',
  },
];

export async function loginApi(email, password) {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  const usuario = USUARIOS_PRUEBA.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!usuario) {
    throw new Error('Credenciales incorrectas');
  }

  // Retornar usuario sin la contraseña
  const { password: _, ...userWithoutPassword } = usuario;
  return userWithoutPassword;
}

