# Software Estimation Client

Cliente Next.js para estimar software. Auth y usuarios hablan con la API real (`software-estimation-api`).

## Entornos

| Archivo             | Uso                                |
| ------------------- | ---------------------------------- |
| `.env.dev`          | Local (`npm run dev`)              |
| `.env.prod.example` | Plantilla para producción / Vercel |

Variable: `NEXT_PUBLIC_API_BASE_URL`

En **Vercel** → Environment Variables → Production:

```
NEXT_PUBLIC_API_BASE_URL=https://tu-api.ejemplo.com
```

Luego redeploy. CORS del backend debe incluir el dominio del front.

## Arranque

```bash
npm install
npm run dev
```

Backend en `:8080`. Front en [http://localhost:3000](http://localhost:3000).

## Usuario inicial

Viene del seed de la API (Flyway `V2__seed.sql`):

| Campo      | Valor                    |
| ---------- | ------------------------ |
| Correo     | `jcvargas.dev@gmail.com` |
| Contraseña | `admin123`               |
| Rol        | Administrador            |

Si tenías datos mock viejos en el navegador, limpia `localStorage` de `localhost:3000` y recarga.

## Autenticación

- Login: `POST /api/v1/auth/login` → JWT access + refresh.
- El cliente guarda tokens en `localStorage` y envía `Authorization: Bearer <token>`.
- Si el access expira, renueva con `POST /api/v1/auth/refresh-token`.
- Logout: `POST /api/v1/auth/logout` (invalida tokens en el servidor).
- Permisos: vienen en la respuesta de login/refresh y se usan para menús y rutas.

## Rutas

| Ruta                      | Qué hace                |
| ------------------------- | ----------------------- |
| `/login`                  | Iniciar sesión          |
| `/forgot-password`        | Pedir código OTP        |
| `/forgot-password/verify` | Ingresar el código      |
| `/forgot-password/reset`  | Nueva contraseña        |
| `/users`                  | Listado (20 por página) |
| `/users/new`              | Crear usuario           |
| `/users/[userId]/edit`    | Editar usuario          |
| `/profile`                | Mi perfil y avatar      |

## Reset de contraseña (OTP)

1. En `/login` entra a **Olvidé mi contraseña**.
2. Usa un correo que exista.
3. Revisa el correo: la API envía un código de 6 dígitos (10 minutos).
4. Verifica el código y define una clave nueva (mínimo 8 caracteres, con letra y número).
5. Vuelve a `/login`.

Al crear un usuario, la API envía una invitación OTP al correo para que active su cuenta (no se define contraseña en el formulario de alta).

## Checklist manual

1. Backend arriba en `:8080` y `NEXT_PUBLIC_API_BASE_URL` correcto.
2. Login con clave mala → toast de error.
3. Login con el admin → entra a proyectos.
4. Olvidé mi contraseña → código por correo → nueva clave → login.
5. `/users` → listar, filtrar, crear (sin contraseña), editar, activar/desactivar, eliminar.
6. Avatar en `/profile` (JPG/PNG, máx. 2MB).

## Datos locales

Claves en `localStorage` (sesión y tokens; el resto sigue mockeado por ahora):

- `software-estimation:session`
- `software-estimation:auth-tokens`

## Docs

- Usuarios: `docs/users.md`
- Convenciones del agente: `AGENTS.md`
