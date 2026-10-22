# Usuarios

Listado, filtros y CRUD de cuentas internas. Habla con la API real.

Tamaño por defecto: **20** (`TABLE_PAGE_SIZE`). `pageNumber` es **base 0**.

## CRUD del servicio

```
usersService.getUsers(query)              POST /api/v1/users/search
usersService.getUser(id)                  GET /api/v1/users/:id
usersService.createUser(body)             POST /api/v1/users
usersService.updateUser(body)             PUT /api/v1/users/:id
usersService.updateUserStatus(body)       PATCH /api/v1/users/:id/status
usersService.deleteUser(id)               DELETE /api/v1/users/:id
usersService.resendInvitation(id)         POST /api/v1/users/:id/resend-invitation
usersService.uploadAvatar(id, file)       PUT /api/v1/users/:id/avatar
usersService.deleteAvatar(id)             DELETE /api/v1/users/:id/avatar
rolesService.getRoles(activeOnly)         GET /api/v1/roles?activeOnly=true
```

## QueryRequest

```json
{
  "filters": [
    { "key": "search", "operator": "LK", "values": ["laura"] },
    { "key": "role", "operator": "EQ", "values": ["estimator"] }
  ],
  "pagination": {
    "pageNumber": 0,
    "pageSize": 20,
    "orderBy": "createdAt",
    "sortDirection": "DESC"
  }
}
```

Operadores: `EQ`, `NE`, `LK`, `IN`, `GT`, `LT`, `GE`, `LE`, `BT`.

Filtros de usuario en backend: `search`, `firstName`, `lastName`, `email`, `isActive`, `role` (código), `createdAt`.

## CreateUser / UpdateUser

Alta (sin contraseña; la API envía OTP de invitación):

```json
{
  "firstName": "Laura",
  "lastName": "Gómez",
  "email": "laura.gomez@intecx.com",
  "roleId": "uuid-del-rol",
  "isActive": true
}
```

No se puede asignar el rol de sistema (`admin`).

## UserSearchResponse

`PaginatedResponse<User, "userResponse">`

| Campo           | Qué es                           |
| --------------- | -------------------------------- |
| `userResponse`  | Filas de esta página             |
| `pageNumber`    | Página actual (empieza en 0)     |
| `pageSize`      | 20                               |
| `totalElements` | Total de registros               |
| `totalPages`    | `ceil(totalElements / pageSize)` |
| `hasNext`       | Hay página siguiente             |
| `hasPrevious`   | Hay página anterior              |

## Modelo User (API)

```ts
{
  ;(id,
    firstName,
    lastName,
    email,
    isActive,
    roleId,
    roleCode,
    roleName,
    avatar,
    createdAt,
    updatedAt)
}
```

## JSON de getUsers

`POST /api/v1/users/search`

```json
{
  "userResponse": [
    {
      "id": "8f2a1c4e-3b9d-4a11-9c0e-2d7f6a1b0e33",
      "firstName": "Laura",
      "lastName": "Gómez",
      "email": "laura.gomez@intecx.com",
      "isActive": true,
      "roleId": "...",
      "roleCode": "estimator",
      "roleName": "ESTIMADOR",
      "avatar": null,
      "createdAt": "2026-03-12T14:20:00",
      "updatedAt": null
    }
  ],
  "pageNumber": 0,
  "pageSize": 20,
  "totalElements": 47,
  "totalPages": 3,
  "hasNext": true,
  "hasPrevious": false
}
```
