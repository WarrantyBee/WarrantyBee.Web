---
name: warrantybee-web-ui
description: >-
  Polishes WarrantyBee.Web UI with Element Plus, Bootstrap, SCSS, and consistent
  startup-grade UX. Use for component styling, MenuBar, forms, accessibility, and
  visual consistency across pages.
---

# Web UI Polish

## Design system

- **Element Plus** for menus, forms, dialogs, notifications
- **Bootstrap 5** utilities (`d-flex`, `gap-*`, grid) for layout
- **Poppins** font classes: `poppins-light` on menu items
- White page backgrounds on dashboard (`#ffffff`)

## Component quality

- [ ] Consistent padding/margins with sibling components
- [ ] Loading states for async actions (button disabled + loader)
- [ ] Empty states when lists have no data (future product/warranty pages)
- [ ] Form validation messages under fields
- [ ] Avatar fallback when `getAvatarUrl` empty

## MenuBar

`MenuItems` constants for indices. Only implement navigation for routes that exist. Products/Warranties submenus: stub or hide until backend ready — coordinate with product owner.

## Accessibility

- `alt` on images
- Label inputs (Element Plus `el-form-item` `label`)
- Keyboard-focusable buttons
- Sufficient color contrast on auth forms

## SCSS

- `scoped` styles in SFCs
- Avoid `!important` unless overriding Element Plus deeply
- Reuse variables from existing pages when introducing shared tokens

## Review checklist

- [ ] Mobile: menu ellipsis mode works (`:ellipsis="false"` pattern on horizontal menu)
- [ ] No layout shift on profile avatar load
- [ ] i18n complete for new strings
- [ ] No mixed UK/US copy in same flow
