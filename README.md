# Mike McEnery — developer services

React site for Mike's software development and AI services, with three interactive example apps.

## Run locally

```sh
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
npm run check    # every check in scripts/
```

Everything runs in the browser. Contact links use `mike.mcenery1@gmail.com` and LinkedIn (`https://www.linkedin.com/in/mike-mcenery-3710ba19a/`). The example apps use fictional data and save changes only in browser local storage.

## Deploy

The site is a Cloudflare Worker with static assets (`wrangler.jsonc`, Worker `mike-portfolio`), served at https://mike.mcenery.dev. Cloudflare builds every push to `main` with `npm run build` and deploys it with `npx wrangler deploy`, so run `npm run build` and `npm run check` before pushing. Node is pinned in `.node-version`.

## Main site

- **Content:** `src/main.jsx` (services, sections, copy). Sections: Services (01), Interactive examples (02, `#examples`), AI (03), About (04), Approach (05), Contact.
- **Example cards:** `src/ExampleGallery.jsx`, with each card's preview in `src/*Preview.jsx` and `src/*-card.css`. Old `/?page=examples` links redirect to `/#examples`.
- **Styles:** `src/style.css`, `src/profile.css`, `src/blueprint.css`, `src/readability.css`, `src/examples.css`. Colors are tokens on `:root` at the top of `blueprint.css`: action blue for buttons, accent blue for italics, icons and numbers, and amber only for the status dots.
- **`index.html`:** fonts, sharing metadata, structured data. Favicon in `public/favicon.svg`.
- **Résumé:** `public/mike-mcenery-resume.pdf`, linked for download in About and Contact. Replace the file to update it; keep the name so the links keep working.

## Example apps

Each app is code-split, so it downloads only when opened, and links back to `/#examples`.

| Example | Link | Code | Checks |
|---|---|---|---|
| Torque Garage — parts catalog, estimate builder, shop comparisons | `/?page=examples&demo=automotive` | `Automotive.jsx`, `automotive-data.js`, `automotive.css` | `check-automotive`, `check-torque-design`, `check-auto-render` |
| Aster Appointment Studio — weekly schedule, people, booking, mock reminders | `/?page=examples&demo=appointments` | `Appointments.jsx` and the components it imports, `appointment-data.js`, `appointment*.css` | `check-appointments`, `check-added-people`, `check-first-availability`, `check-aster-design`, `check-compact-workspace`, `check-booking-form`, `check-person-details` |
| Lantern & Lore — game store schedule, seat sign-ups, community forum | `/?page=examples&demo=gaming` | `Gaming.jsx`, `Game*.jsx`, `GamingForms.jsx`, `gaming-data.js`, `gaming.css` | `check-gaming` |

Notes:

- **Colors:** each app defines its own color tokens at the top of its main stylesheet (`automotive.css`, `appointments.css`, `gaming.css`). Its design check enforces token use, a 12px minimum text size and WCAG AA contrast.
- **Dialogs:** both apps' dialogs use `src/ModalDialog.jsx`. It opens a native modal, locks page scrolling, restores focus, and closes on Escape or on a press that starts and ends on the backdrop.
- **Aster:** weekdays 9 AM–5 PM, 15-minute starts; provider and person conflicts are both checked.
- **Torque:** estimates exclude tax and fees.
- **Lantern & Lore:** the shop's weekly sessions roll forward automatically, and sessions older than two weeks are removed.
