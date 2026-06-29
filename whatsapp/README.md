# WhatsApp — iOS App Mockup (PWA)

A 1:1, mobile-only mockup of the **native WhatsApp app for iPhone**, built as an
installable Progressive Web App. This recreates the *iOS app itself* — not
WhatsApp Web — so the layout, navigation and interactions mirror what you'd see
on an iPhone.

## iOS design details recreated

- **Bottom tab bar with 5 tabs** — Updates · Calls · Communities · Chats ·
  **Settings** (the iOS layout; Chats is selected by default), translucent with
  a blur, green active tint and an unread badge.
- **Large collapsing navigation titles** — big bold "Chats"/"Calls"/… titles
  that collapse into a compact centred title as you scroll, iOS-style.
- **iOS search fields**, **solid pill filter chips** (All / Unread / Favourites /
  Groups) that highlight green when selected — no disclosure chevrons on chat
  rows (matching the real app), green unread timestamps and green unread badges.
- **Chat detail** — centred avatar + name with online/last-seen status, back
  chevron with unread count, video & voice call buttons, end-to-end-encryption
  notice, date chips, rounded iOS message bubbles with tails, blue read
  receipts, doodle wallpaper, and an iOS composer (green ＋, rounded field with
  sticker icon, camera, and mic → send).
- **Settings screen** — iOS grouped lists with coloured icon tiles, profile row
  with QR, and an *Appearance* toggle.
- **Light & dark appearance** — auto-detects the system setting; toggle in
  Settings → *Switch Appearance*.

Typing a message sends it, shows the tick progression (sent → delivered → read)
and triggers an auto-reply.

## PWA features

- `manifest.json` — standalone display, portrait orientation, app icons
  (SVG + generated PNG 192/512/maskable/180), and app shortcuts.
- `sw.js` — offline-first service worker; works without a network once loaded.
- Installable to the Home Screen on iOS/Android; launches full-screen with no
  browser chrome, like the real app.

## Run it

Static site — serve the folder over HTTP (a service worker needs `http(s)`, not
`file://`):

```bash
cd whatsapp
python3 -m http.server 8099
# open http://localhost:8099 on a phone, or in a desktop browser's mobile
# device emulation. On desktop (≥500px) it renders inside an iPhone frame.
```

To install: open in Safari/Chrome on iPhone → Share → *Add to Home Screen*.

## Deep links (also power the manifest shortcuts)

- `?tab=calls` — open a tab (`updates`, `calls`, `communities`, `chats`, `settings`)
- `?screen=chat&id=amir` — open a specific chat
- `?action=new-chat` — new-chat shortcut
- `?fast` — skip the splash delay (handy for previews)

## Notes

Everything is self-contained — no external assets, fonts, or network calls.
Avatars and the app icon are generated (SVG / a pure-stdlib Python rasterizer in
`icons/gen_icons.py`). This is a UI mockup: it doesn't send real messages.
