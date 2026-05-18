---
name: warrantybee-web-feature
description: >-
  Implements WarrantyBee.Web features: new pages, Pinia state, router guards, API
  integration via apiRequest, and i18n. Use when building auth flows, profile UI,
  dashboard views, or connecting to new API endpoints.
---

# Web Feature Workflow

## Before coding

- [ ] API endpoint exists and contract confirmed (`APIResponse` shape)
- [ ] Error codes documented in `ErrorCodes` if new
- [ ] Design: reuse Element Plus + existing page layout

## Steps

### 1. Constants

```javascript
// constants.js
Endpoints.MY_FEATURE: "/users/my-feature",
```

### 2. API call (in store action or component)

```javascript
const response = await apiRequest(HttpMethods.POST, Endpoints.MY_FEATURE, payload);
if (response?.status === HttpStatus.OK) {
  // use response.data.data
}
```

Handle `error.response?.status` and `error.response?.data?.error?.code`.

### 3. Pinia (if shared)

Add to `stores/global/state.js`, `actions.js`, `getters.js` — keep mutations in actions.

### 4. Page / component

- Page in `src/pages/`
- Register route + guard behavior
- Loader: `globalStore.setLoader(true/false)` in try/finally

### 5. i18n

Add keys for labels, errors, success toasts — use `$t()` everywhere user-visible.

### 6. Router

Protected routes: rely on default `beforeEach` (token + alive + profile fetch).

## OAuth flows

Use `OAuthCallbacks`, `ScreenLoaderLabels`, `handleOAuthCallback` in `guards.js`. Store pending redirect in `globalStore.redirect`.

## Checklist

- [ ] reCAPTCHA works on form submit
- [ ] 401 clears token and routes to Auth
- [ ] No hardcoded API URLs
- [ ] Responsive layout matches ProfilePage / AuthPage quality
