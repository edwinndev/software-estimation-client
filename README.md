# Software Estimation Client

Cliente Next.js para estimar software. Auth y usuarios viven en `localStorage` (API mock) hasta que exista backend.

## Arranque

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Usuario inicial

Se crea solo si `localStorage` no tiene usuarios:

| Campo      | Valor                    |
| ---------- | ------------------------ |
| Correo     | `jcvargas.dev@gmail.com` |
| Contraseña | `admin123`               |
| Rol        | Administrador            |

Si ya hay datos viejos, limpia `localStorage` del origen `localhost:3000` y recarga.

## Rutas

| Ruta                      | Qué hace                |
| ------------------------- | ----------------------- |
| `/login`                  | Iniciar sesión          |
| `/forgot-password`        | Pedir código OTP        |
| `/forgot-password/verify` | Ingresar el código      |
| `/forgot-password/reset`  | Nueva contraseña        |
| `/users`                  | Listado (15 por página) |
| `/users/new`              | Crear usuario           |
| `/users/[userId]/edit`    | Editar usuario          |

## Reset de contraseña (OTP)

1. En `/login` entra a **Olvidé mi contraseña**.
2. Usa un correo que exista (el admin o uno que hayas creado).
3. Abre DevTools → **Console**. El mock imprime:

```text
[OTP] Password reset code { email: "...", code: "123456" }
```

4. Copia el código de 6 dígitos (vale 10 minutos).
5. Define una clave nueva: mínimo 8 caracteres, con letra y número.
6. Vuelve a `/login` e ingresa con la clave nueva.

## Toasts

Arriba a la derecha. Se disparan desde la UI (no desde hooks):

- Login: éxito y error
- OTP: código enviado, verificado, contraseña actualizada (y error)
- Usuarios: creado, actualizado, eliminado (y error)

## Checklist manual

1. Login con clave mala → toast de error arriba a la derecha.
2. Login con el admin → toast de éxito y entra a proyectos.
3. Olvidé mi contraseña con un correo que no existe → toast de error.
4. Correo válido → toast de éxito y código en consola.
5. Código mal / bien → toast de error o éxito.
6. Nueva contraseña → toast de éxito, login con la clave nueva.
7. `/users` → crear, editar y eliminar (no puedes borrar tu propia cuenta).
8. `/users`: buscar en la tabla, abrir **Filtros** (drawer), aplicar/limpiar rol. 20 filas por página (`docs/users.md`).

## Datos locales

Claves en `localStorage`:

- `software-estimation:users`
- `software-estimation:session`
- `software-estimation:password-reset`

## Docs

- Usuarios: `docs/users.md`
- Convenciones del agente: `AGENTS.md`
