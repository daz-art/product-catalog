# WhatsApp — Mobile App Mockup (PWA)

A 1:1, mobile-only mockup of the **native WhatsApp mobile app** (Android 2024+
redesign), built as an installable Progressive Web App. This recreates the
*app itself* — not WhatsApp Web — so the layout, navigation and interactions
mirror what you'd see on a phone.

## What's included

- **Splash screen** — WhatsApp logo + "from Meta", matching the native launch screen.
- **Bottom tab navigation** — Chats · Updates · Communities · Calls, with the
  pill-style active indicator and unread badge.
- **Chats** — chat list with generated avatars, filter chips (All / Unread /
  Favourites / Groups), unread badges, pin & mute markers, sent/delivered/read
  ticks, and end-to-end-encryption footer.
- **Chat detail** — header with online/last-seen status, encryption notice,
  date chips, message bubbles with tails, blue read receipts, the doodle
  wallpaper, and a working composer. Type a message and it sends, shows the tick
  progression (sent → delivered → read) and gets an auto-reply.
- **Updates** — Status rings (with "My status" + add button) and Channels with
  verified badges and Follow buttons.
- **Communities** — community card with sub-groups, and "New community".
- **Calls** — recent calls with incoming/outgoing/missed indicators and voice/
  video icons.
- **Dark & light themes** — auto-detects system preference; toggle via the
  ⋮ menu → *Switch theme*.

## PWA features

- `manifest.json` with standalone display, portrait orientation, theme colors,
  app icons (SVG + generated PNG 192/512/maskable/180) and app shortcuts.
- `sw.js` service worker for offline-first caching — works without a network
  connection once loaded.
- Installable to the home screen on Android/iOS; launches full-screen with no
  browser chrome, like the real app.

## Run it

It's a static site — serve the folder over HTTP (a service worker requires
`http(s)`, not `file://`):

```bash
cd whatsapp
python3 -m http.server 8099
# open http://localhost:8099 on a phone, or in a desktop browser's
# mobile device emulation. On desktop (≥500px) it renders inside a phone frame.
```

To install: open in Chrome/Safari on mobile → *Add to Home Screen*.

## Deep links (also power the manifest shortcuts)

- `?tab=calls` — open a specific tab (`chats`, `updates`, `communities`, `calls`)
- `?screen=chat&id=amir` — open a specific chat
- `?action=new-chat` — new-chat shortcut
- `?fast` — skip the splash delay (handy for previews)

## Notes

Everything is self-contained — no external assets, fonts, or network calls.
Avatars and the app icon are generated (SVG / a pure-stdlib Python rasterizer in
`icons/gen_icons.py`). This is a UI mockup: it doesn't send real messages.
