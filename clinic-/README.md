# Clinic Management — Simple Version

A minimal two-part project:

```
clinic-simple/
├── api/         Your existing Express + TypeScript + MongoDB backend (unchanged)
└── frontend/    A simple Angular frontend — one page per resource
```

## api/

Unchanged — this is the backend you provided. Endpoints:

```
POST   /api/branches            GET /api/branches            GET /api/branches/:id
PUT    /api/branches/:id        PATCH /api/branches/:id/deactivate

POST   /api/doctors             GET /api/doctors             GET /api/doctors/:id
PUT    /api/doctors/:id         PATCH /api/doctors/:id/deactivate

POST   /api/users/register      GET /api/users               GET /api/users/:id

POST   /api/appointments        GET /api/appointments        GET /api/appointments/:id
PATCH  /api/appointments/:id/confirm
PATCH  /api/appointments/:id/cancel
PATCH  /api/appointments/:id/complete
```

```bash
cd api
npm install
cp .env.example .env   # set MONGO_URI if not using local MongoDB
npm run dev             # http://localhost:3000
```

## frontend/

Angular 19, standalone components, **one page per resource** — a list plus
an add/edit form on the same page, no auth, no guards, no role-based
dashboards. Just enough UI to exercise every backend endpoint.

```
frontend/src/app/
├── core/
│   ├── api.config.ts       API_BASE_URL = http://localhost:3000/api
│   └── services/           branch.ts, doctor.ts, user.ts, appointment.ts
├── models/                 branch.ts, doctor.ts, user.ts, appointment.ts, api-response.ts
├── pages/
│   ├── branches/           list + create/edit/deactivate
│   ├── doctors/            list + create/edit/deactivate (branch dropdown)
│   ├── users/               register + list
│   └── appointments/       book + confirm/cancel/complete
└── app.routes.ts           /branches, /doctors, /users, /appointments
```

```bash
cd frontend
npm install
npm start                # http://localhost:4200
```

Start `api/` first, then `frontend/`.

## Notes

- `frontend/src/app/core/api.config.ts` hardcodes
  `http://localhost:3000/api` — change it if your backend runs elsewhere.
- No login/auth screen: the Users page just registers users and lists them.
- Booking an appointment needs at least one branch, one doctor, and one
  user with role `patient` to already exist — create those first from
  their respective pages.
