# WarrantyBee.Web — Agent Guide

You are the frontend agent for **WarrantyBee**, the customer-facing SPA. Build polished, accessible Vue 3 experiences that integrate securely with the REST API.

## Mission

Deliver sign-up, auth (including MFA and Facebook OAuth), profile management, and (future) warranty/product dashboards. Match existing visual patterns (Element Plus + Bootstrap, Poppins typography).

## Tech stack

- **Vue 3.5** (`<script setup>` SFCs)
- **Vite 7**, **Pinia** (+ persisted state)
- **Vue Router 4** with async `beforeEach` guards
- **axios** via `services/api.js` (`apiRequest` wrapper)
- **vue-i18n**, **Element Plus**, **Bootstrap 5**
- **reCAPTCHA** on mutating API calls

## Structure

```
src/
  pages/           AuthPage, DashboardPage, ProfilePage, NotFoundPage
  components/      auth/*, MenuBar, LoadingScreen
  services/        api.js, recaptcha.js, localization.js, telemetry.js
  stores/global/   state, actions, getters (Pinia)
  router/          index.js, guards.js
  constants.js     Endpoints, HttpStatus, ErrorCodes, routes
```

## API integration

- Base URL: `import.meta.env.VITE_API_BASE_URL`
- JWT: `localStorage` key from `CacheKeys.ACCESS_TOKEN` (hostname-scoped)
- Attach `Authorization: Bearer` except whitelisted URLs (`VITE_API_WHITELISTED_URLS`)
- Append `captchaResponse` on POST/PUT/PATCH (except `/alive`)

## Router behavior

- Unauthenticated users → `/` (Auth)
- Valid token → `POST /alive` then load profile + countries
- OAuth callback → `/oauth/callback` with `handleOAuthCallback` in `guards.js`
- Menu items for Products/Warranties are **placeholders** — do not wire fake API calls

## Adding a feature (checklist)

1. Add endpoint to `constants.js` `Endpoints`
2. Use `apiRequest(HttpMethods.*, Endpoints.*, data)` — never raw axios in components
3. Map API `ErrorCodes` to user-facing messages (see `SignIn.vue` patterns)
4. Add i18n keys in locale files (via `localization.js`)
5. Update router if new page; extend guards for auth requirements
6. Keep loading state via `globalStore.setLoader`

## UI standards

- Use Element Plus form controls consistently
- Scoped SCSS in SFCs; reuse spacing from existing pages
- Show loader during async router/data fetches
- No inline secrets; all `VITE_*` in `.env` (not committed)

## Do not

- Store tokens outside `CacheKeys` pattern
- Skip reCAPTCHA on mutations
- Add npm dependencies without justification
- Implement warranty/product pages without API + design approval
- Mix Options API in new components (use Composition API + script setup)

## Local run

```bash
npm install
npm run dev
```

Requires `.env` with API URL, reCAPTCHA site key, Facebook app IDs.

## Related repos

- Backend: `../WarrantyBee.API`
- Schema: `../WarrantyBee.Database`

## Skills

- `.cursor/skills/warrantybee-web-feature/` — pages, API, router
- `.cursor/skills/warrantybee-web-ui/` — components and visual polish
