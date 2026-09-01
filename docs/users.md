# Usuarios

Listado, filtros y CRUD de cuentas internas. El mock en `localStorage` usa el mismo contrato que la API.

Tamaño por defecto: **20** (`TABLE_PAGE_SIZE`). `pageNumber` es **base 0**.

## CRUD del servicio

```
usersService.getUsers(query)     POST /users/search
usersService.getUser(id)         GET /users/:id
usersService.createUser(body)    POST /users
usersService.updateUser(body)    PUT /users/:id
usersService.deleteUser(id)      DELETE /users/:id
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

## Cómo listar

La página de la tabla sale de `usePagination`. Si cambia un filtro o la búsqueda, llama `resetPage()`.

```tsx
const { pageNumber, pageSize, setPageNumber, resetPage } = usePagination()
const debouncedSearch = useDebounce(search, 500)

const query: QueryRequest = {
  filters: apiFilters,
  pagination: {
    pageNumber,
    pageSize,
    orderBy: "createdAt",
    sortDirection: "DESC",
  },
}

const { data, isLoading, isError } = useUsers(query)
const pagination = data ?? emptyPage

<DataTable
  isLoading={isLoading}
  isError={isError}
  errorMessage="No se pudieron cargar los usuarios."
  isEmpty={pagination.userResponse.length === 0}
  emptyMessage="No hay registros."
  pagination={pagination}
  onPageChange={setPageNumber}
>
  <UsersTable users={pagination.userResponse} />
</DataTable>
```

`emptyPage` debe usar los mismos campos de `PaginationMeta` (`pageNumber: 0`, `pageSize: TABLE_PAGE_SIZE`, `totalElements: 0`, `hasNext: false`, `hasPrevious: false`).

Ejemplo real: `src/features/users/ui/users-view.tsx`.

## JSON de getUsers

`POST /users/search`

```json
{
  "userResponse": [
    {
      "id": "8f2a1c4e-3b9d-4a11-9c0e-2d7f6a1b0e33",
      "firstName": "Laura",
      "lastName": "Gómez",
      "email": "laura.gomez@intecx.com",
      "role": "estimator",
      "createdAt": "2026-03-12T14:20:00.000Z"
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
