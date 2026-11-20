# The Collection Studios website

Client site built by Hizlan (HeyHizlan Designs). Client came through Dean Wong.

## The business
- The Collection Studios, Ara Damansara, Petaling Jaya.
- Rental studio: curated, ready-styled spaces for photography, film, pop-ups and events.
- Three spaces (names from their Instagram bio):
  - **La Maison**: home set. Marble fireplace, black leather lounge chair, warm window light.
  - **La Galerie**: gallery set. Oxblood red walls, gilt-framed paintings, plaster busts, velvet rope.
  - **L'Hôtel**: hotel set. Red-ceiling corridor, cobalt carpet lounge, tatami room.
- Sets get restyled over time, so room content must be easy to swap.
- WhatsApp: +60 12-657 6099 (wa.me/60126576099)
- Instagram: @the_collection_studios

## Dean's brief (from WhatsApp, see /reference)
- Basic website first. **No booking system.**
- Calendar showing available dates + WhatsApp to book.
- Payment maybe later (Dean still researching). Calendly and Google Workspace were floated, not decided.
- Visual style: the "lab." layout (reference/style-lab-layout.png). Editorial grid, big bold type, grey + orange, isometric cutaway building as hero.
- Idea origin: cozy isometric room render (reference/style-isometric-room.png).

## Positioning
"Ready-made sets. Just bring the camera." Boutique, slightly cinematic. Copy is direct and specific, never generic.

## Current build
- `index.html`: single self-contained page.
  - Hero: Three.js (v0.160, vendored) isometric building. Upper floor La Maison, ground floor La Galerie + L'Hôtel. Hover lifts a room + orange outline, click scrolls to its card. Camera parallax on mouse.
  - Sections: Rooms, Use cases, Availability (calendar + WhatsApp prefill), FAQ, footer.
  - Availability: `BOOKED` array in the second `<script>` tag. Dean edits dates there (YYYY-MM-DD).
  - Hero scene lives in assets/hero.js (rounded furniture, window light, canvas textures). Three.js + addons vendored in assets/vendor/ (no CDN).
  - Scroll reveals: sections with `data-anim` get `.in` on enter, lose it on exit, so animations replay. Respects prefers-reduced-motion.
  - Use cases (02): pinned scroll sequence on desktop. Photos read from assets/uses/{photography,film,popups,events}.jpg (fall back to colour blocks). Each links to Instagram; swap href for story highlight links.
  - Footer email capture: set `FORM_ENDPOINT` (Formspree) in the script. Empty = sends the email to WhatsApp.
- Fonts: Inter Tight + Instrument Serif (Google Fonts).
- Colours: bg #ECEAE6, ink #141414, orange #F2542D.

## Known gaps / next steps
1. Room photos are grey placeholders. Swap in real Instagram shots (put files in assets/rooms/).
2. Booked dates are dummy data.
3. No pricing yet. Ask Dean.
4. 3D hero is blockier than the cozy reference. Agreed plan: model the building in Spline or Blender (GLB, baked lighting), then load it in Three.js and keep the hover/click behaviour. Current code is the placeholder.
5. Calendar is a hardcoded list. Possible upgrade: Google Calendar embed or feed Dean can update himself.
6. Deploy: GitHub Pages from main branch root (file must stay named index.html).

## Working style (Hizlan)
- Short, direct sentences. No corporate language, no em dashes.
- Explain strategy before execution.
- Honest feedback over reassurance.

## Deploy + backups
- Push straight to `main` only (Hizlan's instruction). No working side branches.
- Before every push, snapshot the current live `main` as a branch `backup/YYYY-MM-DD-<what-changes-next>` (tags can't be pushed from the cloud sandbox). Backups are frozen, never deployed.
- To roll back: GitHub > Branches > pick the backup, or `git checkout main && git reset --hard origin/backup/<name> && git push --force-with-lease origin main`.
