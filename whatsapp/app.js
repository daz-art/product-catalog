/* ============================================================
   WhatsApp mobile PWA mockup — app logic
   ============================================================ */
(function () {
  "use strict";

  const app = document.getElementById("app");
  const $ = (id) => document.getElementById(id);

  /* ---------- Avatar helpers (generated SVG, no external assets) ---------- */
  const AV_COLORS = [
    ["#FF8A65", "#FF7043"], ["#4FC3F7", "#039BE5"], ["#AED581", "#7CB342"],
    ["#BA68C8", "#8E24AA"], ["#F06292", "#E91E63"], ["#FFD54F", "#FFA000"],
    ["#4DB6AC", "#00897B"], ["#9575CD", "#5E35B1"], ["#A1887F", "#6D4C41"],
    ["#64B5F6", "#1E88E5"], ["#E57373", "#E53935"], ["#81C784", "#43A047"],
  ];
  function initials(name) {
    const p = name.replace(/[^\w\s]/g, "").trim().split(/\s+/);
    return ((p[0] || "")[0] || "") + ((p[1] || "")[0] || "");
  }
  function avatarSVG(name, seed) {
    const c = AV_COLORS[(seed ?? hash(name)) % AV_COLORS.length];
    const t = initials(name).toUpperCase();
    return (
      '<svg viewBox="0 0 49 49" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="g' + seed + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/>' +
      "</linearGradient></defs>" +
      '<circle cx="24.5" cy="24.5" r="24.5" fill="url(#g' + seed + ')"/>' +
      '<text x="24.5" y="31" font-size="19" font-family="sans-serif" font-weight="600" fill="#fff" text-anchor="middle">' + t + "</text>" +
      "</svg>"
    );
  }
  function groupAvatarSVG(seed) {
    const c = AV_COLORS[seed % AV_COLORS.length];
    return (
      '<svg viewBox="0 0 49 49" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="24.5" cy="24.5" r="24.5" fill="' + c[0] + '"/>' +
      '<path fill="#fff" d="M31 23a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-13 0a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2.5c-3 0-7 1.5-7 4.5V33h14v-3c0-3-4-4.5-7-4.5zm13 0c-.4 0-.9 0-1.3.1A5.7 5.7 0 0 1 32 30v3h6v-3c0-3-4-4.5-7-4.5z"/>' +
      "</svg>"
    );
  }
  function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

  /* ---------- Tick (read receipt) SVG ---------- */
  function tickSVG(state) {
    // state: 'sent' (single), 'delivered' (double grey), 'read' (double blue)
    if (state === "sent")
      return '<span class="tick tick-sent"><svg viewBox="0 0 18 18"><path fill="currentColor" d="M14.6 4.3 6.5 12.4 3.4 9.3l-1 1 4.1 4.1 9.1-9.1z"/></svg></span>';
    const cls = state === "read" ? "tick-read" : "tick-sent";
    return '<span class="tick ' + cls + '"><svg viewBox="0 0 20 18"><path fill="currentColor" d="M17.6 4.3 9.5 12.4l-1.6-1.6 8.1-8.1zM11.6 4.3 3.5 12.4 1.4 9.3l-1 1 3.1 3.1 9.1-9.1zm4 0L7.5 12.4l-.9-.9-1 1 1.9 1.9 9.1-9.1z"/></svg></span>';
  }

  /* ===================== DATA ===================== */
  const NOW = "2026-06-29";

  const chats = [
    {
      id: "fam", name: "Family 🏡", group: true, seed: 2, time: "12:24", unread: 3, pinned: true,
      members: ["Mum", "Dad", "Sara", "You"],
      preview: { sender: "Mum", text: "Don't forget dinner at 8! 🍝" },
      sub: "Mum, Dad, Sara, you",
      messages: [
        { d: "Yesterday" },
        { from: "Dad", text: "Who's coming this weekend?" },
        { from: "Sara", text: "I'll be there 🙌" },
        { d: "Today" },
        { from: "Mum", text: "Made your favourite. See you all soon ❤️" },
        { from: "me", text: "Can't wait! Leaving work now", st: "read", t: "12:10" },
        { from: "Mum", text: "Don't forget dinner at 8! 🍝", t: "12:24" },
      ],
    },
    {
      id: "amir", name: "Amir Hassan", seed: 9, time: "11:58", unread: 1, online: true,
      preview: { text: "Sounds good, let's do it 👍" },
      sub: "online",
      messages: [
        { d: "Today" },
        { from: "me", text: "Hey! Are we still on for the demo tomorrow?", st: "read", t: "11:40" },
        { from: "them", text: "Yeah absolutely. 10am works?", t: "11:55" },
        { from: "me", text: "Perfect. I'll send the invite.", st: "read", t: "11:56" },
        { from: "them", text: "Sounds good, let's do it 👍", t: "11:58" },
      ],
    },
    {
      id: "leila", name: "Leila ✨", seed: 4, time: "10:31", unread: 0, lastFromMe: true, st: "read",
      preview: { fromMe: true, text: "Haha that's amazing 😂" },
      sub: "last seen today at 10:33",
      messages: [
        { d: "Today" },
        { from: "them", text: "You will NOT believe what happened at the office today" },
        { from: "me", text: "Tell me everything 👀", st: "read", t: "10:28" },
        { from: "them", text: "So the printer literally caught fire 🔥 during the all-hands" },
        { from: "me", text: "Haha that's amazing 😂", st: "read", t: "10:31" },
      ],
    },
    {
      id: "work", name: "Design Team", group: true, seed: 1, time: "09:47", unread: 0, muted: true,
      members: ["Yuki", "Tom", "Priya", "You"],
      preview: { sender: "Yuki", text: "Pushed the new mockups to Figma" },
      sub: "Yuki, Tom, Priya, you",
      messages: [
        { d: "Today" },
        { from: "Tom", text: "Morning team ☀️" },
        { from: "Priya", text: "Standup in 10?" },
        { from: "Yuki", text: "Pushed the new mockups to Figma" },
        { from: "me", text: "Looking now 🔍", st: "delivered", t: "09:48" },
      ],
    },
    {
      id: "omar", name: "Omar 🚀", seed: 7, time: "Yesterday", unread: 0, lastFromMe: true, st: "delivered",
      preview: { fromMe: true, text: "📷 Photo" },
      sub: "last seen yesterday at 22:14",
      messages: [
        { d: "Yesterday" },
        { from: "them", text: "Did you see the launch went live?" },
        { from: "me", text: "Yes!! Congrats man 🎉", st: "delivered", t: "21:30" },
        { from: "me", text: "📷 Photo", st: "delivered", t: "21:31" },
      ],
    },
    {
      id: "nour", name: "Nour", seed: 5, time: "Yesterday", unread: 0,
      preview: { text: "Thank you so much 🙏" },
      sub: "last seen yesterday at 19:02",
      messages: [
        { d: "Yesterday" },
        { from: "me", text: "Sent over the documents you needed", st: "read", t: "18:50" },
        { from: "them", text: "Got them, perfect" },
        { from: "them", text: "Thank you so much 🙏" },
      ],
    },
    {
      id: "delivery", name: "Quick Delivery", seed: 10, time: "Yesterday", unread: 0, verified: true,
      preview: { text: "Your order is on the way! 🛵" },
      sub: "Business account",
      messages: [
        { d: "Yesterday" },
        { from: "them", text: "Your order #4821 has been confirmed ✅" },
        { from: "them", text: "Your order is on the way! 🛵" },
      ],
    },
    {
      id: "uni", name: "Uni Friends 🎓", group: true, seed: 3, time: "Tuesday", unread: 0,
      members: ["Jake", "Mia", "Sam", "You"],
      preview: { sender: "Jake", text: "Reunion next month? Who's in" },
      sub: "Jake, Mia, Sam, you",
      messages: [
        { d: "Tuesday" },
        { from: "Mia", text: "Miss you all 🥺" },
        { from: "Jake", text: "Reunion next month? Who's in" },
      ],
    },
    {
      id: "sara2", name: "Sara Ahmed", seed: 11, time: "Tuesday", unread: 0, lastFromMe: true, st: "read",
      preview: { fromMe: true, text: "See you then!" },
      sub: "last seen recently",
      messages: [
        { d: "Tuesday" },
        { from: "them", text: "Coffee on Friday?" },
        { from: "me", text: "See you then!", st: "read", t: "14:02" },
      ],
    },
    {
      id: "gym", name: "Gym Buddies 💪", group: true, seed: 6, time: "Monday", unread: 0,
      members: ["Kev", "Dan", "You"],
      preview: { sender: "Kev", text: "6am session tomorrow 🏋️" },
      sub: "Kev, Dan, you",
      messages: [
        { d: "Monday" },
        { from: "Kev", text: "6am session tomorrow 🏋️" },
      ],
    },
  ];

  const statuses = [
    { name: "Leila ✨", seed: 4, sub: "12 minutes ago", has: true },
    { name: "Amir Hassan", seed: 9, sub: "35 minutes ago", has: true },
    { name: "Omar 🚀", seed: 7, sub: "Today, 9:14", has: true },
    { name: "Nour", seed: 5, sub: "Today, 8:02", has: true },
  ];

  const channels = [
    { name: "WhatsApp", seed: 8, sub: "Welcome to channels! 👋", verified: true, follow: true },
    { name: "Tech Daily", seed: 1, sub: "🚀 The 5 biggest releases this week", verified: true, follow: true },
    { name: "World News", seed: 11, sub: "Breaking: markets hit record high", verified: true, follow: true },
  ];

  const communities = [
    {
      name: "Neighbourhood 🏘️", seed: 3,
      groups: [
        { name: "Announcements", seed: 3, time: "10:15", preview: { sender: "Admin", text: "Street party this Saturday!" }, group: true },
        { name: "General Chat", seed: 6, time: "09:50", preview: { sender: "Tina", text: "Anyone have a ladder I can borrow?" }, group: true },
      ],
    },
  ];

  const calls = [
    { name: "Amir Hassan", seed: 9, dir: "out", kind: "video", time: "Today, 11:20", missed: false },
    { name: "Leila ✨", seed: 4, dir: "in", kind: "voice", time: "Today, 09:05", missed: false },
    { name: "Omar 🚀", seed: 7, dir: "in", kind: "voice", time: "Yesterday, 20:41", missed: true },
    { name: "Family 🏡", seed: 2, dir: "out", kind: "video", time: "Yesterday, 19:00", missed: false, group: true },
    { name: "Nour", seed: 5, dir: "out", kind: "voice", time: "Tuesday, 16:22", missed: false },
    { name: "Sara Ahmed", seed: 11, dir: "in", kind: "video", time: "Monday, 13:10", missed: true },
  ];

  /* ===================== RENDERERS ===================== */
  function avatarEl(item) {
    const div = document.createElement("div");
    div.className = "avatar";
    div.innerHTML = item.group ? groupAvatarSVG(item.seed) : avatarSVG(item.name, item.seed);
    return div;
  }

  function renderChats() {
    const ul = $("chat-list");
    ul.innerHTML = "";
    chats.forEach((c) => {
      const li = document.createElement("li");
      li.className = "chat-row";
      li.addEventListener("click", () => openChat(c.id));

      const av = avatarEl(c);

      const main = document.createElement("div");
      main.className = "chat-main";

      let preview = "";
      if (c.preview.fromMe) preview += tickSVG(c.st || "sent");
      else if (c.preview.sender) preview += '<b style="color:var(--text-2);font-weight:500">' + esc(c.preview.sender) + ":</b> ";
      preview += esc(c.preview.text);

      main.innerHTML =
        '<div class="chat-top">' +
        '<span class="chat-name">' + esc(c.name) + (c.verified ? ' <span class="verified">' + verifiedTick() + "</span>" : "") + "</span>" +
        '<span class="chat-time' + (c.unread ? " unread-time" : "") + '">' + esc(c.time) + "</span>" +
        "</div>" +
        '<div class="chat-bottom">' +
        '<span class="chat-preview">' + preview + "</span>" +
        '<span style="display:flex;align-items:center;gap:6px;flex-shrink:0">' +
        (c.muted ? mutedIco() : "") +
        (c.pinned ? pinIco() : "") +
        (c.unread ? '<span class="unread-badge">' + c.unread + "</span>" : "") +
        "</span>" +
        "</div>";

      li.appendChild(av);
      li.appendChild(main);
      ul.appendChild(li);
    });
  }

  function renderStatuses() {
    const ul = $("status-list");
    ul.innerHTML = "";
    // my status
    const mine = document.createElement("li");
    mine.className = "status-row";
    mine.addEventListener("click", () => toast("Tap to add status update"));
    mine.innerHTML =
      '<div class="status-ring mine"><div class="avatar">' + avatarSVG("You", 0) +
      '<span class="status-add">+</span></div></div>' +
      '<div class="status-info"><div class="status-name">My status</div><div class="status-sub">Tap to add status update</div></div>';
    ul.appendChild(mine);

    statuses.forEach((s) => {
      const li = document.createElement("li");
      li.className = "status-row";
      li.addEventListener("click", () => toast("Viewing " + s.name + "'s status"));
      li.innerHTML =
        '<div class="status-ring ' + (s.has ? "has" : "") + '"><div class="avatar">' + avatarSVG(s.name, s.seed) + "</div></div>" +
        '<div class="status-info"><div class="status-name">' + esc(s.name) + '</div><div class="status-sub">' + esc(s.sub) + "</div></div>";
      ul.appendChild(li);
    });
  }

  function renderChannels() {
    const ul = $("channel-list");
    ul.innerHTML = "";
    channels.forEach((ch) => {
      const li = document.createElement("li");
      li.className = "channel-row";
      li.addEventListener("click", () => toast("Opening " + ch.name + " channel"));
      li.innerHTML =
        '<div class="avatar">' + avatarSVG(ch.name, ch.seed) + "</div>" +
        '<div class="channel-info"><div class="channel-name">' + esc(ch.name) +
        (ch.verified ? ' <span class="verified">' + verifiedTick() + "</span>" : "") + "</div>" +
        '<div class="channel-sub">' + esc(ch.sub) + "</div></div>" +
        '<button class="follow-btn">Following</button>';
      ul.appendChild(li);
    });
  }

  function renderCommunities() {
    const ul = $("community-list");
    ul.innerHTML = "";
    communities.forEach((com) => {
      const card = document.createElement("li");
      card.className = "community-card";
      const head =
        '<div class="community-head"><div class="community-icon" style="background:' +
        AV_COLORS[com.seed % AV_COLORS.length][0] + ';display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;font-size:20px">' +
        esc(initials(com.name).toUpperCase()) + '</div><div class="community-title">' + esc(com.name) + "</div></div>";
      let rows = '<div class="community-sub-rows">';
      com.groups.forEach((g) => {
        rows +=
          '<div class="chat-row"><div class="avatar">' + groupAvatarSVG(g.seed) + "</div>" +
          '<div class="chat-main"><div class="chat-top"><span class="chat-name">' + esc(g.name) +
          '</span><span class="chat-time">' + esc(g.time) + "</span></div>" +
          '<div class="chat-bottom"><span class="chat-preview"><b style="font-weight:500">' +
          esc(g.preview.sender) + ":</b> " + esc(g.preview.text) + "</span></div></div></div>";
      });
      rows += "</div>";
      card.innerHTML = head + rows;
      card.querySelectorAll(".chat-row").forEach((r) => r.addEventListener("click", () => toast("Opening group")));
      ul.appendChild(card);
    });
  }

  function renderCalls() {
    const ul = $("call-list");
    ul.innerHTML = "";
    calls.forEach((c) => {
      const li = document.createElement("li");
      li.className = "call-row";
      li.addEventListener("click", () => toast((c.kind === "video" ? "Video" : "Voice") + " calling " + c.name + "…"));
      const arrow = c.missed
        ? '<span class="arrow-missed">' + arrowMissed(c.dir) + "</span>"
        : '<span class="arrow-' + c.dir + '">' + (c.dir === "in" ? arrowIn() : arrowOut()) + "</span>";
      const callIco = c.kind === "video" ? videoIco() : voiceIco();
      li.innerHTML =
        '<div class="avatar">' + (c.group ? groupAvatarSVG(c.seed) : avatarSVG(c.name, c.seed)) + "</div>" +
        '<div class="call-info"><div class="call-name' + (c.missed ? " missed" : "") + '">' + esc(c.name) + "</div>" +
        '<div class="call-meta">' + arrow + " " + esc(c.time) + "</div></div>" +
        '<div class="call-action">' + callIco + "</div>";
      ul.appendChild(li);
    });
  }

  /* ===================== CHAT DETAIL ===================== */
  let currentChat = null;

  function openChat(id) {
    const c = chats.find((x) => x.id === id);
    if (!c) return;
    currentChat = c;
    c.unread = 0;
    renderChats();
    updateChatsBadge();

    $("chat-header-avatar").innerHTML = c.group ? groupAvatarSVG(c.seed) : avatarSVG(c.name, c.seed);
    $("chat-header-name").textContent = c.name;
    $("chat-header-sub").textContent = c.online ? "online" : c.sub || "";

    renderMessages();
    showScreen("chat");
  }

  function renderMessages() {
    const wrap = $("messages");
    wrap.innerHTML = "";
    const c = currentChat;
    let prevFrom = null;
    c.messages.forEach((m) => {
      if (m.d) {
        const chip = document.createElement("div");
        chip.className = "date-chip";
        chip.textContent = m.d;
        wrap.appendChild(chip);
        prevFrom = null;
        return;
      }
      if (m.sys) {
        const s = document.createElement("div");
        s.className = "system-msg";
        s.textContent = m.text;
        wrap.appendChild(s);
        prevFrom = null;
        return;
      }
      const out = m.from === "me";
      const b = document.createElement("div");
      b.className = "bubble " + (out ? "out" : "in");
      const samePrev = prevFrom === m.from;
      if (samePrev) b.classList.add("stack");
      if (!out && c.group) b.classList.add("grp");

      let html = "";
      if (!out && c.group && !samePrev) {
        const col = AV_COLORS[hash(m.from) % AV_COLORS.length][1];
        html += '<span class="sender" style="color:' + col + '">' + esc(m.from) + "</span>";
      }
      html += '<span class="txt">' + esc(m.text) + "</span>";
      html += '<span class="meta">' + (m.t || c.time) + (out ? " " + tickSVG(m.st || "sent") : "") + "</span>";
      b.innerHTML = html;
      wrap.appendChild(b);
      prevFrom = m.from;
    });
    requestAnimationFrame(() => { const cb = $("chat-body"); cb.scrollTop = cb.scrollHeight; });
  }

  function sendMessage() {
    const input = $("msg-input");
    const text = input.value.trim();
    if (!text || !currentChat) return;
    const t = clockNow();
    currentChat.messages.push({ from: "me", text: text, st: "sent", t: t });
    input.value = "";
    updateSendIcon();
    renderMessages();

    // simulate delivery + read + reply
    const msg = currentChat.messages[currentChat.messages.length - 1];
    setTimeout(() => { msg.st = "delivered"; renderMessages(); }, 700);
    setTimeout(() => { msg.st = "read"; renderMessages(); }, 1600);
    setTimeout(() => maybeReply(currentChat), 2600);

    // update list preview
    currentChat.preview = { fromMe: true, text: text };
    currentChat.time = t;
    currentChat.st = "sent";
  }

  const REPLIES = [
    "Got it 👍", "Haha nice 😄", "Sounds good!", "Let me check and get back to you",
    "On my way 🚗", "Perfect, thanks!", "👍", "Sure thing", "Tell me more 👀", "❤️",
  ];
  function maybeReply(c) {
    if (c !== currentChat) return;
    const who = c.group ? c.members.find((m) => m !== "You") : "them";
    const reply = REPLIES[hash(c.id + c.messages.length) % REPLIES.length];
    c.messages.push({ from: who, text: reply, t: clockNow() });
    c.preview = c.group ? { sender: who, text: reply } : { text: reply };
    renderMessages();
    renderChats();
  }

  /* ===================== NAVIGATION ===================== */
  function showScreen(name) {
    ["splash", "main", "chat"].forEach((s) => { $("screen-" + s).hidden = s !== name; });
    app.dataset.screen = name;
    if (name === "chat") { $("screen-chat").classList.add("enter-right"); setTimeout(() => $("screen-chat").classList.remove("enter-right"), 240); }
  }

  function backToMain() {
    const el = $("screen-chat");
    el.classList.add("exit-right");
    setTimeout(() => { el.classList.remove("exit-right"); showScreen("main"); currentChat = null; }, 200);
  }

  function switchTab(tab) {
    document.querySelectorAll(".nav-item").forEach((b) => b.classList.toggle("nav-active", b.dataset.tab === tab));
    document.querySelectorAll(".panel").forEach((p) => (p.hidden = p.dataset.panel !== tab));
    $("panels").scrollTop = 0;
    // FAB icon per tab
    const fabIcon = $("fab-icon");
    const icons = {
      chats: '<path fill="currentColor" d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"/>',
      updates: '<path fill="currentColor" d="M17 10.5a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4v-4a1 1 0 0 1 2 0v4z"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="0"/>',
      communities: '<path fill="currentColor" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 10c-3 0-7 1.5-7 4.5V21h14v-2.5c0-3-4-4.5-7-4.5z"/>',
      calls: '<path fill="currentColor" d="M20 15.5c-1.2 0-2.4-.2-3.5-.6a1 1 0 0 0-1 .2l-2.2 2.2a15 15 0 0 1-6.6-6.6l2.2-2.2a1 1 0 0 0 .2-1A11 11 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z"/>',
    };
    fabIcon.innerHTML = icons[tab] || icons.chats;
    const titles = { chats: "WhatsApp", updates: "Updates", communities: "Communities", calls: "Calls" };
    $("appbar").querySelector(".appbar-title").textContent = titles[tab];
  }

  /* ===================== ICON HELPERS ===================== */
  function mutedIco() { return '<span class="muted-ico"><svg viewBox="0 0 24 24" width="17" height="17"><path fill="currentColor" d="M12 3a4 4 0 0 0-4 4v1.2l8 8V7a4 4 0 0 0-4-4zM4 4 2.7 5.3l4.3 4.3V11a5 5 0 0 0 4 4.9V18H8v2h8v-2h-3v-2.1a5 5 0 0 0 1.6-.5l4.1 4.1L20 18 4 4z"/></svg></span>'; }
  function pinIco() { return '<span class="pin-ico"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16 4v2l-1 1v4l2 2v2h-4v5l-1 1-1-1v-5H7v-2l2-2V7L8 6V4h8z"/></svg></span>'; }
  function verifiedTick() { return '<svg viewBox="0 0 24 24" width="15" height="15" style="vertical-align:-2px"><path fill="currentColor" d="M12 1 9.5 3 6.2 2.6 5 5.7 1.9 7l.6 3.3L1 12l1.5 1.7-.6 3.3L4 18.3l1.2 3.1 3.3-.4L11 23l2.5-2 3.3.4 1.2-3.1 3.1-1.3-.6-3.3L23 12l-1.5-1.7.6-3.3L18 5.7l-1.2-3.1L13.5 3 12 1zm-1.2 14L7 11.2l1.4-1.4 2.4 2.4 4.8-4.8 1.4 1.4-6.2 6.2z"/></svg>'; }
  function arrowIn() { return '<svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M19 7 8 18M8 18V9M8 18h9" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
  function arrowOut() { return '<svg viewBox="0 0 24 24" width="15" height="15"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M8 17 18 7M18 7v9M18 7H9"/></svg>'; }
  function arrowMissed(dir) { return dir === "in" ? arrowIn() : arrowOut(); }
  function videoIco() { return '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M17 10.5V7c0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1v-3.5l4 4v-11l-4 4z"/></svg>'; }
  function voiceIco() { return '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M20 15.5c-1.2 0-2.4-.2-3.5-.6a1 1 0 0 0-1 .2l-2.2 2.2a15 15 0 0 1-6.6-6.6l2.2-2.2a1 1 0 0 0 .2-1A11 11 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z"/></svg>'; }

  /* ===================== UTIL ===================== */
  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function clockNow() {
    const d = new Date();
    let h = d.getHours(), m = d.getMinutes();
    return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
  }
  let toastTimer;
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.hidden = true), 1800);
  }
  function updateChatsBadge() {
    const total = chats.reduce((n, c) => n + (c.unread ? 1 : 0), 0);
    const badge = $("nav-badge-chats");
    if (total > 0) { badge.textContent = total; badge.hidden = false; } else badge.hidden = true;
  }
  function updateSendIcon() {
    const has = $("msg-input").value.trim().length > 0;
    $("send-icon-mic").hidden = has;
    $("send-icon-arrow").hidden = !has;
    $("send-btn").setAttribute("aria-label", has ? "Send" : "Send voice message");
  }

  /* ===================== EVENTS ===================== */
  function bind() {
    document.querySelectorAll(".nav-item").forEach((b) => b.addEventListener("click", () => switchTab(b.dataset.tab)));
    $("chat-back").addEventListener("click", backToMain);
    $("fab").addEventListener("click", () => {
      const tab = document.querySelector(".nav-active").dataset.tab;
      toast(tab === "chats" ? "New chat" : tab === "calls" ? "New call" : tab === "updates" ? "Add status" : "New community");
    });

    $("send-btn").addEventListener("click", () => {
      if ($("msg-input").value.trim()) sendMessage();
      else toast("Hold to record voice message 🎤");
    });
    $("msg-input").addEventListener("input", updateSendIcon);
    $("msg-input").addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });

    // search
    $("btn-search").addEventListener("click", () => { $("searchbar").hidden = false; $("search-input").focus(); });
    $("btn-search-back").addEventListener("click", () => { $("searchbar").hidden = true; $("search-input").value = ""; renderChats(); });
    $("search-input").addEventListener("input", filterChats);

    // menu
    $("btn-menu").addEventListener("click", () => { $("menu-sheet").hidden = false; $("sheet-overlay").hidden = false; });
    $("sheet-overlay").addEventListener("click", closeSheet);
    document.querySelectorAll(".menu-row").forEach((r) => r.addEventListener("click", () => {
      const a = r.dataset.action;
      closeSheet();
      if (a === "dark") toggleTheme();
      else if (a === "about") toast("WhatsApp UI mockup — PWA demo");
      else toast(r.textContent);
    }));

    // chat header opens profile
    $("chat-header-info").addEventListener("click", () => currentChat && toast(currentChat.name + " · contact info"));

    // chip filters
    document.querySelectorAll("#chip-row .chip:not(.chip-add)").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#chip-row .chip").forEach((c) => c.classList.remove("chip-active"));
        chip.classList.add("chip-active");
        applyFilter(chip.textContent.trim());
      });
    });
  }

  function closeSheet() { $("menu-sheet").hidden = true; $("sheet-overlay").hidden = true; }

  function filterChats() {
    const q = $("search-input").value.toLowerCase();
    document.querySelectorAll("#chat-list .chat-row").forEach((row, i) => {
      const name = chats[i].name.toLowerCase();
      const prev = (chats[i].preview.text || "").toLowerCase();
      row.style.display = name.includes(q) || prev.includes(q) ? "" : "none";
    });
  }
  function applyFilter(kind) {
    document.querySelectorAll("#chat-list .chat-row").forEach((row, i) => {
      const c = chats[i];
      let show = true;
      if (kind === "Unread") show = c.unread > 0;
      else if (kind === "Groups") show = !!c.group;
      else if (kind === "Favourites") show = ["leila", "amir", "fam"].includes(c.id);
      row.style.display = show ? "" : "none";
    });
  }

  function toggleTheme() {
    const dark = app.dataset.theme === "dark";
    app.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("wa-theme", app.dataset.theme); } catch (e) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    toast(dark ? "Light theme" : "Dark theme");
  }

  /* ===================== INIT ===================== */
  function init() {
    try {
      const saved = localStorage.getItem("wa-theme");
      if (saved) app.dataset.theme = saved;
      else if (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) app.dataset.theme = "dark";
      else app.dataset.theme = "light";
    } catch (e) { app.dataset.theme = "light"; }

    renderChats();
    renderStatuses();
    renderChannels();
    renderCommunities();
    renderCalls();
    updateChatsBadge();
    updateSendIcon();
    bind();

    // Deep links (also power the manifest shortcuts & ?screen= preview)
    const params = new URLSearchParams(location.search);
    const wantTab = params.get("tab");
    const wantScreen = params.get("screen");
    const wantId = params.get("id");
    const splashDelay = params.get("fast") !== null ? 0 : 1400;

    const goInitial = () => {
      showScreen("main");
      if (wantTab && ["chats", "updates", "communities", "calls"].includes(wantTab)) switchTab(wantTab);
      if (params.get("action") === "new-chat") toast("New chat");
      if (wantScreen === "chat" && wantId) openChat(wantId);
    };
    setTimeout(goInitial, splashDelay);

    // register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
