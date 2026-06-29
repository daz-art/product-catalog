/* ============================================================
   WhatsApp iOS app mockup — app logic
   ============================================================ */
(function () {
  "use strict";
  const app = document.getElementById("app");
  const $ = (id) => document.getElementById(id);

  /* ===================== ICON LIBRARY ===================== */
  const I = {
    "@search": '<svg viewBox="0 0 24 24" width="17" height="17"><path fill="currentColor" d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/></svg>',
    "@cam": '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 9a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm0 5.5A2 2 0 1 1 12 10a2 2 0 0 1 0 4.5zM20 6h-3.2l-1.2-1.6c-.4-.5-1-.9-1.7-.9H10c-.7 0-1.3.4-1.7.9L7.2 6H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>',
    "@compose": '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v6h-2V6.4l-9.3 9.3-.7.3-2.3.7.7-2.3.3-.7L17 4H7v14h10v-5h2v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h13zm1.7 1.3a1.5 1.5 0 0 1 0 2.1l-1 1-2.1-2.1 1-1a1.5 1.5 0 0 1 2.1 0z"/></svg>',
    "@newcall": '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 15.5c-1.2 0-2.4-.2-3.5-.6a1 1 0 0 0-1 .2l-2.2 2.2a15 15 0 0 1-6.6-6.6l2.2-2.2a1 1 0 0 0 .2-1A11 11 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z"/><path fill="currentColor" d="M18 2h2v3h3v2h-3v3h-2V7h-3V5h3z"/></svg>',
    "@chev": '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>',
    "@chev-l": '<svg viewBox="0 0 24 24" width="26" height="26"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 5l-7 7 7 7"/></svg>',
    "@lock": '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 1a4 4 0 0 0-4 4v3H6.5A1.5 1.5 0 0 0 5 9.5v9A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 17.5 8H16V5a4 4 0 0 0-4-4zm0 2a2 2 0 0 1 2 2v3h-4V5a2 2 0 0 1 2-2z"/></svg>',
    "@star": '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 2 9.2 8.6 2 9.2l5.5 4.7L5.8 21 12 17.3 18.2 21l-1.7-7.1L22 9.2l-7.2-.6z"/></svg>',
    "@people": '<svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M16.5 8a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm-9 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-2 0-5 1-5 3v2h5v-1c0-1.2.5-2.3 1.4-3.2A6.6 6.6 0 0 0 7.5 10zm9 0c-.5 0-1 0-1.4.1A4.7 4.7 0 0 1 16.5 13v8h5v-8c0-2-3-3-5-3zm-4.5.5c-2.3 0-7 1.2-7 3.5V21h14v-7c0-2.3-4.7-3.5-7-3.5z"/></svg>',
    "@video": '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17 10.5V7c0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1v-3.5l4 4v-11l-4 4z"/></svg>',
    "@voice": '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M20 15.5c-1.2 0-2.4-.2-3.5-.6a1 1 0 0 0-1 .2l-2.2 2.2a15 15 0 0 1-6.6-6.6l2.2-2.2a1 1 0 0 0 .2-1A11 11 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z"/></svg>',
    "@plus": '<svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z"/></svg>',
    "@sticker": '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 11a8 8 0 1 0-8 8 8 8 0 0 0 8-8zm-8 6a6 6 0 1 1 6-6 6 6 0 0 1-6 6zm-2.5-7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM11 15a3.5 3.5 0 0 0 3.3-2.3H7.7A3.5 3.5 0 0 0 11 15z"/></svg>',
    "@mic": '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11h-2z"/></svg>',
    "@send-up": '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 4 5 11h4v8h6v-8h4z"/></svg>',
    /* tab bar icons (line + fill variants) */
    "@t-updates": ico(
      '<circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" d="M5 5.5A9 9 0 0 0 5 18.5M19 5.5a9 9 0 0 1 0 13M8.4 8.6a5 5 0 0 0 0 6.8M15.6 8.6a5 5 0 0 1 0 6.8"/>',
      '<circle cx="12" cy="12" r="4" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M5 5.5A9 9 0 0 0 5 18.5M19 5.5a9 9 0 0 1 0 13M8.4 8.6a5 5 0 0 0 0 6.8M15.6 8.6a5 5 0 0 1 0 6.8"/>'),
    "@t-calls": ico(
      '<path fill="none" stroke="currentColor" stroke-width="1.7" d="M20 15.5c-1.2 0-2.4-.2-3.5-.6a1 1 0 0 0-1 .2l-2.2 2.2a15 15 0 0 1-6.6-6.6l2.2-2.2a1 1 0 0 0 .2-1A11 11 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z"/>',
      '<path fill="currentColor" d="M20 15.5c-1.2 0-2.4-.2-3.5-.6a1 1 0 0 0-1 .2l-2.2 2.2a15 15 0 0 1-6.6-6.6l2.2-2.2a1 1 0 0 0 .2-1A11 11 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z"/>'),
    "@t-comm": ico(
      '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M16.5 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm-9 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM12 11c-2.3 0-7 1.2-7 3.5V20h14v-5.5c0-2.3-4.7-3.5-7-3.5z"/>',
      '<path fill="currentColor" d="M16.5 8a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm-9 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3zM12 10.5c-2.3 0-7 1.2-7 3.5V20h14v-6c0-2.3-4.7-3.5-7-3.5z"/>'),
    "@t-chats": ico(
      '<path fill="none" stroke="currentColor" stroke-width="1.7" d="M12 3.2c-5 0-9 3.5-9 7.8 0 2.4 1.2 4.5 3.2 6L5 21l4.5-1.6c.8.2 1.6.3 2.5.3 5 0 9-3.5 9-7.7s-4-7.8-9-7.8z"/>',
      '<path fill="currentColor" d="M12 3c-5 0-9 3.5-9 7.8 0 2.4 1.2 4.5 3.2 6L5 21l4.5-1.6c.8.2 1.6.3 2.5.3 5 0 9-3.5 9-7.7S17 3 12 3z"/>'),
    "@t-settings": ico(
      '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" d="M19.4 13a7.7 7.7 0 0 0 .1-2l2-1.5-2-3.4-2.3 1a7.6 7.6 0 0 0-1.7-1l-.3-2.4h-4l-.3 2.4a7.6 7.6 0 0 0-1.7 1l-2.3-1-2 3.4 2 1.5a7.7 7.7 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7.6 7.6 0 0 0 1.7 1l.3 2.4h4l.3-2.4a7.6 7.6 0 0 0 1.7-1l2.3 1 2-3.4z"/>',
      '<path fill="currentColor" d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/><path fill="currentColor" d="M19.4 13a7.7 7.7 0 0 0 .1-2l2-1.5-2-3.4-2.3 1a7.6 7.6 0 0 0-1.7-1l-.3-2.4h-4l-.3 2.4a7.6 7.6 0 0 0-1.7 1l-2.3-1-2 3.4 2 1.5a7.7 7.7 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7.6 7.6 0 0 0 1.7 1l.3 2.4h4l.3-2.4a7.6 7.6 0 0 0 1.7-1l2.3 1 2-3.4zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>'),
  };
  function ico(line, fill) {
    return '<span class="tab-ico-svg"><svg class="ico-line" viewBox="0 0 24 24" width="28" height="28">' + line +
      '</svg><svg class="ico-fill" viewBox="0 0 24 24" width="28" height="28">' + fill + "</svg></span>";
  }
  function injectIcons() {
    let html = app.innerHTML;
    // Replace longer tokens first so prefixes (e.g. @chev) don't clobber @chev-l.
    Object.keys(I).sort((a, b) => b.length - a.length).forEach((k) => { html = html.split(k).join(I[k]); });
    app.innerHTML = html;
  }

  /* ===================== AVATAR HELPERS ===================== */
  const AV = [["#FF8A65","#FF7043"],["#4FC3F7","#039BE5"],["#AED581","#7CB342"],["#BA68C8","#8E24AA"],
    ["#F06292","#E91E63"],["#FFD54F","#FFA000"],["#4DB6AC","#00897B"],["#9575CD","#5E35B1"],
    ["#A1887F","#6D4C41"],["#64B5F6","#1E88E5"],["#E57373","#E53935"],["#81C784","#43A047"]];
  function initials(n){const p=n.replace(/[^\w\s]/g,"").trim().split(/\s+/);return((p[0]||"")[0]||"")+((p[1]||"")[0]||"");}
  function hash(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h;}
  let avUid = 0; // unique gradient id per instance (duplicate ids break in hidden subtrees)
  function avatarSVG(name,seed){const c=AV[(seed??hash(name))%AV.length];const id="grad"+(avUid++);return '<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+c[0]+'"/><stop offset="1" stop-color="'+c[1]+'"/></linearGradient></defs><circle cx="25" cy="25" r="25" fill="url(#'+id+')"/><text x="25" y="32" font-size="19" font-family="sans-serif" font-weight="600" fill="#fff" text-anchor="middle">'+initials(name).toUpperCase()+"</text></svg>";}
  function groupAvatarSVG(seed){const c=AV[seed%AV.length];return '<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="25" fill="'+c[0]+'"/><path fill="#fff" d="M32 24a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-13 0a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2.5c-3 0-7 1.5-7 4.5V34h14v-3c0-3-4-4.5-7-4.5zm13 0c-.4 0-.9 0-1.3.1A5.7 5.7 0 0 1 33 31v3h6v-3c0-3-4-4.5-7-4.5z"/></svg>';}

  function tickSVG(state){
    if(state==="sent")return '<span class="tick tick-sent"><svg viewBox="0 0 18 18"><path fill="currentColor" d="M14.6 4.3 6.5 12.4 3.4 9.3l-1 1 4.1 4.1 9.1-9.1z"/></svg></span>';
    const cls=state==="read"?"tick-read":"tick-sent";
    return '<span class="tick '+cls+'"><svg viewBox="0 0 20 18"><path fill="currentColor" d="M17.6 4.3 9.5 12.4l-1.6-1.6 8.1-8.1zM11.6 4.3 3.5 12.4 1.4 9.3l-1 1 3.1 3.1 9.1-9.1zm4 0L7.5 12.4l-.9-.9-1 1 1.9 1.9 9.1-9.1z"/></svg></span>';
  }
  function verifiedTick(){return '<svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M12 1 9.5 3 6.2 2.6 5 5.7 1.9 7l.6 3.3L1 12l1.5 1.7-.6 3.3L4 18.3l1.2 3.1 3.3-.4L11 23l2.5-2 3.3.4 1.2-3.1 3.1-1.3-.6-3.3L23 12l-1.5-1.7.6-3.3L18 5.7l-1.2-3.1L13.5 3 12 1zm-1.2 14L7 11.2l1.4-1.4 2.4 2.4 4.8-4.8 1.4 1.4-6.2 6.2z"/></svg>';}
  function mutedIco(){return '<span class="muted-ico"><svg viewBox="0 0 24 24" width="17" height="17"><path fill="currentColor" d="M12 3a4 4 0 0 0-4 4v1.2l8 8V7a4 4 0 0 0-4-4zM4 4 2.7 5.3l4.3 4.3V11a5 5 0 0 0 4 4.9V18H8v2h8v-2h-3v-2.1a5 5 0 0 0 1.6-.5l4.1 4.1L20 18 4 4z"/></svg></span>';}
  function pinIco(){return '<span class="pin-ico"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16 4v2l-1 1v4l2 2v2h-4v5l-1 1-1-1v-5H7v-2l2-2V7L8 6V4h8z"/></svg></span>';}
  function listChev(){return '<span class="list-chev"><svg viewBox="0 0 24 24" width="18" height="18"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg></span>';}
  function arrIn(){return '<span class="arr arr-in"><svg viewBox="0 0 24 24" width="15" height="15"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 7 8 18M8 18V9M8 18h9"/></svg></span>';}
  function arrOut(){return '<span class="arr arr-out"><svg viewBox="0 0 24 24" width="15" height="15"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M8 17 18 7M18 7v9M18 7H9"/></svg></span>';}
  function callIco(kind){return kind==="video"?'<span class="call-info-ico">'+I["@video"]+'</span>':'<span class="call-info-ico">'+I["@voice"]+'</span>';}

  /* ===================== DATA ===================== */
  const chats = [
    { id:"fam", name:"Family 🏡", group:true, seed:2, time:"12:24", unread:3, pinned:true, members:["Mum","Dad","Sara","You"],
      preview:{sender:"Mum",text:"Don't forget dinner at 8! 🍝"}, sub:"Mum, Dad, Sara, you",
      messages:[{d:"Yesterday"},{from:"Dad",text:"Who's coming this weekend?"},{from:"Sara",text:"I'll be there 🙌"},{d:"Today"},{from:"Mum",text:"Made your favourite. See you all soon ❤️"},{from:"me",text:"Can't wait! Leaving work now",st:"read",t:"12:10"},{from:"Mum",text:"Don't forget dinner at 8! 🍝",t:"12:24"}] },
    { id:"amir", name:"Amir Hassan", seed:9, time:"11:58", unread:1, online:true, preview:{text:"Sounds good, let's do it 👍"}, sub:"online",
      messages:[{d:"Today"},{from:"me",text:"Hey! Are we still on for the demo tomorrow?",st:"read",t:"11:40"},{from:"them",text:"Yeah absolutely. 10am works?",t:"11:55"},{from:"me",text:"Perfect. I'll send the invite.",st:"read",t:"11:56"},{from:"them",text:"Sounds good, let's do it 👍",t:"11:58"}] },
    { id:"leila", name:"Leila ✨", seed:4, time:"10:31", unread:0, preview:{fromMe:true,text:"Haha that's amazing 😂"}, st:"read", sub:"last seen today at 10:33",
      messages:[{d:"Today"},{from:"them",text:"You will NOT believe what happened at the office today"},{from:"me",text:"Tell me everything 👀",st:"read",t:"10:28"},{from:"them",text:"So the printer literally caught fire 🔥 during the all-hands"},{from:"me",text:"Haha that's amazing 😂",st:"read",t:"10:31"}] },
    { id:"work", name:"Design Team", group:true, seed:1, time:"09:47", unread:0, muted:true, members:["Yuki","Tom","Priya","You"], preview:{sender:"Yuki",text:"Pushed the new mockups to Figma"}, sub:"Yuki, Tom, Priya, you",
      messages:[{d:"Today"},{from:"Tom",text:"Morning team ☀️"},{from:"Priya",text:"Standup in 10?"},{from:"Yuki",text:"Pushed the new mockups to Figma"},{from:"me",text:"Looking now 🔍",st:"delivered",t:"09:48"}] },
    { id:"omar", name:"Omar 🚀", seed:7, time:"Yesterday", unread:0, preview:{fromMe:true,text:"📷 Photo"}, st:"delivered", sub:"last seen yesterday at 22:14",
      messages:[{d:"Yesterday"},{from:"them",text:"Did you see the launch went live?"},{from:"me",text:"Yes!! Congrats man 🎉",st:"delivered",t:"21:30"},{from:"me",text:"📷 Photo",st:"delivered",t:"21:31"}] },
    { id:"nour", name:"Nour", seed:5, time:"Yesterday", unread:0, preview:{text:"Thank you so much 🙏"}, sub:"last seen yesterday at 19:02",
      messages:[{d:"Yesterday"},{from:"me",text:"Sent over the documents you needed",st:"read",t:"18:50"},{from:"them",text:"Got them, perfect"},{from:"them",text:"Thank you so much 🙏"}] },
    { id:"delivery", name:"Quick Delivery", seed:10, time:"Yesterday", unread:0, verified:true, preview:{text:"Your order is on the way! 🛵"}, sub:"Business account",
      messages:[{d:"Yesterday"},{from:"them",text:"Your order #4821 has been confirmed ✅"},{from:"them",text:"Your order is on the way! 🛵"}] },
    { id:"uni", name:"Uni Friends 🎓", group:true, seed:3, time:"Tuesday", unread:0, members:["Jake","Mia","Sam","You"], preview:{sender:"Jake",text:"Reunion next month? Who's in"}, sub:"Jake, Mia, Sam, you",
      messages:[{d:"Tuesday"},{from:"Mia",text:"Miss you all 🥺"},{from:"Jake",text:"Reunion next month? Who's in"}] },
    { id:"sara2", name:"Sara Ahmed", seed:11, time:"Tuesday", unread:0, preview:{fromMe:true,text:"See you then!"}, st:"read", sub:"last seen recently",
      messages:[{d:"Tuesday"},{from:"them",text:"Coffee on Friday?"},{from:"me",text:"See you then!",st:"read",t:"14:02"}] },
    { id:"gym", name:"Gym Buddies 💪", group:true, seed:6, time:"Monday", unread:0, members:["Kev","Dan","You"], preview:{sender:"Kev",text:"6am session tomorrow 🏋️"}, sub:"Kev, Dan, you",
      messages:[{d:"Monday"},{from:"Kev",text:"6am session tomorrow 🏋️"}] },
  ];
  const statuses=[{name:"Leila ✨",seed:4,sub:"12 minutes ago",has:true},{name:"Amir Hassan",seed:9,sub:"35 minutes ago",has:true},{name:"Omar 🚀",seed:7,sub:"Today, 9:14",has:true},{name:"Nour",seed:5,sub:"Today, 8:02",has:true}];
  const channels=[{name:"WhatsApp",seed:8,sub:"Welcome to channels! 👋",verified:true},{name:"Tech Daily",seed:1,sub:"🚀 The 5 biggest releases this week",verified:true},{name:"World News",seed:11,sub:"Breaking: markets hit record high",verified:true}];
  const communities=[{name:"Neighbourhood 🏘️",seed:3,groups:[{name:"Announcements",seed:3,time:"10:15",preview:{sender:"Admin",text:"Street party this Saturday!"},group:true},{name:"General Chat",seed:6,time:"09:50",preview:{sender:"Tina",text:"Anyone have a ladder I can borrow?"},group:true}]}];
  const calls=[{name:"Amir Hassan",seed:9,dir:"out",kind:"video",time:"Today, 11:20",missed:false},{name:"Leila ✨",seed:4,dir:"in",kind:"voice",time:"Today, 09:05",missed:false},{name:"Omar 🚀",seed:7,dir:"in",kind:"voice",time:"Yesterday, 20:41",missed:true},{name:"Family 🏡",seed:2,dir:"out",kind:"video",time:"Yesterday, 19:00",missed:false,group:true},{name:"Nour",seed:5,dir:"out",kind:"voice",time:"Tuesday, 16:22",missed:false},{name:"Sara Ahmed",seed:11,dir:"in",kind:"video",time:"Monday, 13:10",missed:true}];

  const settingsGroups = [
    [{ic:"@star",bg:"#FFC234",label:"Starred Messages"},{ic:"link",bg:"#34C759",label:"Linked Devices"}],
    [{ic:"key",bg:"#5856D6",label:"Account"},{ic:"@lock",bg:"#007AFF",label:"Privacy"},{ic:"avatar",bg:"#5AC8FA",label:"Avatar"},{ic:"chat",bg:"#34C759",label:"Lists"},{ic:"chats",bg:"#34C759",label:"Chats"},{ic:"bell",bg:"#FF3B30",label:"Notifications"},{ic:"storage",bg:"#34C759",label:"Storage and Data"}],
    [{ic:"globe",bg:"#007AFF",label:"App Language",right:"English"},{ic:"help",bg:"#00A884",label:"Help"},{ic:"heart",bg:"#FF2D55",label:"Invite a Friend"}],
  ];
  const SET_ICONS = {
    "@star": I["@star"], "@lock": '<svg viewBox="0 0 24 24" width="17" height="17"><path fill="#fff" d="M12 1a4 4 0 0 0-4 4v3H6.5A1.5 1.5 0 0 0 5 9.5v9A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 17.5 8H16V5a4 4 0 0 0-4-4zm0 2a2 2 0 0 1 2 2v3h-4V5a2 2 0 0 1 2-2z"/></svg>',
    link:'<svg viewBox="0 0 24 24" width="18" height="18"><path fill="#fff" d="M3.9 12a3.1 3.1 0 0 1 3.1-3.1h4V7h-4a5 5 0 0 0 0 10h4v-1.9h-4A3.1 3.1 0 0 1 3.9 12zM8 13h8v-2H8v2zm5-6v1.9h4a3.1 3.1 0 0 1 0 6.2h-4V17h4a5 5 0 0 0 0-10h-4z"/></svg>',
    key:'<svg viewBox="0 0 24 24" width="18" height="18"><path fill="#fff" d="M14 6a4 4 0 1 0-3.8 4l-.2.2V12H8v2H6v2H4v2.5L3.5 19H8l1-1v-2h2l1-1v-1.8l.2-.2A4 4 0 0 0 14 6zm1.5 1.5a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5z"/></svg>',
    avatar:'<svg viewBox="0 0 24 24" width="19" height="19"><path fill="#fff" d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3 0-8 1.5-8 4.5V20h16v-1.5c0-3-5-4.5-8-4.5z"/></svg>',
    chat:'<svg viewBox="0 0 24 24" width="18" height="18"><path fill="#fff" d="M4 4h16v11H7l-3 3z"/></svg>',
    chats:'<svg viewBox="0 0 24 24" width="18" height="18"><path fill="#fff" d="M4 4h16v11H7l-3 3z"/></svg>',
    bell:'<svg viewBox="0 0 24 24" width="18" height="18"><path fill="#fff" d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5a6 6 0 0 0-5-5.9V4a1 1 0 0 0-2 0v1.1A6 6 0 0 0 6 11v5l-2 2v1h16v-1z"/></svg>',
    storage:'<svg viewBox="0 0 24 24" width="18" height="18"><path fill="#fff" d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7zM13 3v6h6a6 6 0 0 0-6-6z"/></svg>',
    globe:'<svg viewBox="0 0 24 24" width="18" height="18"><path fill="#fff" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-2.6a14 14 0 0 0-1.2-3.2A8 8 0 0 1 18.9 8zM12 4c.8 1 1.5 2.4 1.9 4h-3.8C10.5 6.4 11.2 5 12 4zM4.3 14a8 8 0 0 1 0-4h3a16 16 0 0 0 0 4zm.8 2h2.6a14 14 0 0 0 1.2 3.2A8 8 0 0 1 5.1 16zM7.7 8H5.1a8 8 0 0 1 3.8-3.2A14 14 0 0 0 7.7 8zM12 20c-.8-1-1.5-2.4-1.9-4h3.8c-.4 1.6-1.1 3-1.9 4zm2.3-6H9.7a14 14 0 0 1 0-4h4.6a14 14 0 0 1 0 4zm.6 5.2a14 14 0 0 0 1.2-3.2h2.6a8 8 0 0 1-3.8 3.2zm2-5.2a16 16 0 0 0 0-4h3a8 8 0 0 1 0 4z"/></svg>',
    help:'<svg viewBox="0 0 24 24" width="18" height="18"><path fill="#fff" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 17h-2v-2h2v2zm1.8-7.3-.9.9c-.7.7-.9 1.2-.9 2.4h-2v-.5c0-1.2.5-2.2 1.2-2.9l1.2-1.2a2 2 0 1 0-3.4-1.4H8a4 4 0 1 1 6.8 2.7z"/></svg>',
    heart:'<svg viewBox="0 0 24 24" width="18" height="18"><path fill="#fff" d="M12 21 4.5 13.5a5 5 0 0 1 7-7.1l.5.5.5-.5a5 5 0 0 1 7 7.1z"/></svg>',
  };

  /* ===================== RENDERERS ===================== */
  function renderChats(){
    const ul=$("chat-list"); ul.innerHTML="";
    chats.forEach((c)=>{
      const li=document.createElement("li"); li.className="chat-row";
      li.addEventListener("click",()=>openChat(c.id));
      const av=document.createElement("div"); av.className="avatar"; av.innerHTML=c.group?groupAvatarSVG(c.seed):avatarSVG(c.name,c.seed);
      let prev=""; if(c.preview.fromMe)prev+=tickSVG(c.st||"sent"); else if(c.preview.sender)prev+='<b style="color:var(--text-2);font-weight:400">'+esc(c.preview.sender)+": </b>"; prev+=esc(c.preview.text);
      const main=document.createElement("div"); main.className="chat-main";
      main.innerHTML='<div class="chat-text"><div class="chat-top"><span class="chat-name">'+esc(c.name)+(c.verified?' <span class="verified">'+verifiedTick()+"</span>":"")+'</span><span class="chat-time'+(c.unread?" unread":"")+'">'+esc(c.time)+'</span></div><div class="chat-bottom"><span class="chat-preview">'+prev+'</span><span class="chat-trailing">'+(c.muted?mutedIco():"")+(c.pinned?pinIco():"")+(c.unread?'<span class="unread-badge">'+c.unread+"</span>":"")+"</span></div></div>";
      li.appendChild(av); li.appendChild(main); ul.appendChild(li);
    });
  }
  function renderStatuses(){
    const ul=$("status-list"); ul.innerHTML="";
    const mine=document.createElement("li"); mine.className="status-row";
    mine.addEventListener("click",()=>toast("Add to My status"));
    mine.innerHTML='<div class="status-ring mine"><div class="avatar">'+avatarSVG("You",0)+'<span class="status-add">+</span></div></div><div class="status-info"><div class="status-name">My status</div><div class="status-sub">Add to my status</div></div>';
    ul.appendChild(mine);
    statuses.forEach((s)=>{const li=document.createElement("li"); li.className="status-row"; li.addEventListener("click",()=>toast("Viewing "+s.name+"'s status")); li.innerHTML='<div class="status-ring '+(s.has?"has":"")+'"><div class="avatar">'+avatarSVG(s.name,s.seed)+'</div></div><div class="status-info"><div class="status-name">'+esc(s.name)+'</div><div class="status-sub">'+esc(s.sub)+"</div></div>"; ul.appendChild(li);});
  }
  function renderChannels(){
    const ul=$("channel-list"); ul.innerHTML="";
    channels.forEach((ch)=>{const li=document.createElement("li"); li.className="channel-row"; li.addEventListener("click",()=>toast("Opening "+ch.name)); li.innerHTML='<div class="avatar">'+avatarSVG(ch.name,ch.seed)+'</div><div class="channel-info"><div class="channel-name">'+esc(ch.name)+(ch.verified?' <span class="verified">'+verifiedTick()+"</span>":"")+'</div><div class="channel-sub">'+esc(ch.sub)+'</div></div><button class="follow-btn">Follow</button>'; ul.appendChild(li);});
  }
  function renderCommunities(){
    const ul=$("community-list"); ul.innerHTML="";
    communities.forEach((com)=>{
      const card=document.createElement("li"); card.className="community-card";
      let html='<div class="community-head"><div class="community-icon" style="background:'+AV[com.seed%AV.length][0]+'">'+esc(initials(com.name).toUpperCase())+'</div><div class="community-title">'+esc(com.name)+"</div></div>";
      com.groups.forEach((g)=>{html+='<div class="chat-row"><div class="avatar">'+groupAvatarSVG(g.seed)+'</div><div class="chat-main"><div class="chat-text"><div class="chat-top"><span class="chat-name">'+esc(g.name)+'</span><span class="chat-time">'+esc(g.time)+'</span></div><div class="chat-bottom"><span class="chat-preview"><b style="font-weight:400">'+esc(g.preview.sender)+": </b>"+esc(g.preview.text)+"</span></div></div></div></div>";});
      card.innerHTML=html; card.querySelectorAll(".chat-row").forEach((r)=>r.addEventListener("click",()=>toast("Opening group"))); ul.appendChild(card);
    });
  }
  function renderCalls(){
    const ul=$("call-list"); ul.innerHTML="";
    calls.forEach((c)=>{const li=document.createElement("li"); li.className="call-row"; li.addEventListener("click",()=>toast((c.kind==="video"?"Video":"Voice")+" calling "+c.name+"…")); const arrow=c.missed?'<span class="arr arr-missed">'+(c.dir==="in"?arrIn():arrOut()).replace('arr-in','arr-missed').replace('arr-out','arr-missed')+"</span>":(c.dir==="in"?arrIn():arrOut()); li.innerHTML='<div class="avatar">'+(c.group?groupAvatarSVG(c.seed):avatarSVG(c.name,c.seed))+'</div><div class="call-info"><div class="call-text"><div class="call-name'+(c.missed?" missed":"")+'">'+esc(c.name)+'</div><div class="call-meta">'+arrow+" "+esc(c.time)+'</div></div>'+callIco(c.kind)+"</div>"; ul.appendChild(li);});
  }
  function renderSettings(){
    const body=$("settings-body"); body.innerHTML="";
    const prof=document.createElement("div"); prof.className="set-profile";
    prof.addEventListener("click",()=>toast("Profile"));
    prof.innerHTML='<div class="avatar">'+avatarSVG("You",0)+'</div><div class="set-profile-text"><div class="set-profile-name">You</div><div class="set-profile-sub">Hey there! I am using WhatsApp.</div></div><div class="set-profile-actions">'+'<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M3 3h6v2H5v4H3V3zm12 0h6v6h-2V5h-4V3zM3 15h2v4h4v2H3v-6zm16 0h2v6h-6v-2h4v-4zM7 7h4v4H7V7zm6 0h4v4h-4V7zm-6 6h4v4H7v-4zm6 0h4v4h-4v-4z"/></svg>'+listChev().replace('list-chev','')+"</div>";
    body.appendChild(prof);
    settingsGroups.forEach((grp)=>{
      const g=document.createElement("div"); g.className="set-group";
      grp.forEach((row)=>{
        const r=document.createElement("div"); r.className="set-row";
        r.addEventListener("click",()=>{ if(row.label==="Help") toast("WhatsApp iOS mockup — PWA demo"); else toast(row.label); });
        const glyph=SET_ICONS[row.ic]||"";
        r.innerHTML='<div class="set-icon" style="background:'+row.bg+'">'+glyph+'</div><div class="set-row-main"><span class="set-label">'+esc(row.label)+'</span><span class="set-row-right">'+(row.right?esc(row.right):"")+listChev().replace('class="list-chev"','class="list-chev" style="color:var(--text-3)"')+"</span></div>";
        g.appendChild(r);
      });
      body.appendChild(g);
    });
    // theme toggle row
    const tg=document.createElement("div"); tg.className="set-group";
    const tr=document.createElement("div"); tr.className="set-row"; tr.addEventListener("click",toggleTheme);
    tr.innerHTML='<div class="set-icon" style="background:#1c1c1e"><svg viewBox="0 0 24 24" width="18" height="18"><path fill="#fff" d="M12 3a9 9 0 1 0 9 9c0-.5 0-.9-.1-1.4A7 7 0 0 1 12 3z"/></svg></div><div class="set-row-main"><span class="set-label">Switch Appearance</span><span class="set-row-right">'+listChev()+"</span></div>";
    tg.appendChild(tr); body.appendChild(tg);
  }

  /* ===================== CHAT DETAIL ===================== */
  let currentChat=null;
  function openChat(id){
    const c=chats.find((x)=>x.id===id); if(!c)return; currentChat=c;
    const totalUnread=chats.reduce((n,x)=>n+(x.unread?1:0),0);
    $("back-count").textContent=totalUnread>0?totalUnread:"";
    c.unread=0; renderChats(); updateBadge();
    $("chat-header-avatar").innerHTML=c.group?groupAvatarSVG(c.seed):avatarSVG(c.name,c.seed);
    $("chat-header-name").textContent=c.name;
    $("chat-header-sub").textContent=c.online?"online":(c.sub||"");
    renderMessages(); showScreen("chat");
  }
  function renderMessages(){
    const wrap=$("messages"); wrap.innerHTML=""; const c=currentChat; let prevFrom=null;
    c.messages.forEach((m)=>{
      if(m.d){const chip=document.createElement("div"); chip.className="date-chip"; chip.textContent=m.d; wrap.appendChild(chip); prevFrom=null; return;}
      const out=m.from==="me"; const b=document.createElement("div"); b.className="bubble "+(out?"out":"in");
      const same=prevFrom===m.from; if(same)b.classList.add("stack"); if(!out&&c.group)b.classList.add("grp");
      let html=""; if(!out&&c.group&&!same){const col=AV[hash(m.from)%AV.length][1]; html+='<span class="sender" style="color:'+col+'">'+esc(m.from)+"</span>";}
      html+='<span class="txt">'+esc(m.text)+'</span><span class="meta">'+(m.t||c.time)+(out?" "+tickSVG(m.st||"sent"):"")+"</span>";
      b.innerHTML=html; wrap.appendChild(b); prevFrom=m.from;
    });
    requestAnimationFrame(()=>{const cb=$("chat-body"); cb.scrollTop=cb.scrollHeight;});
  }
  function sendMessage(){
    const input=$("msg-input"); const text=input.value.trim(); if(!text||!currentChat)return;
    const t=clockNow(); currentChat.messages.push({from:"me",text:text,st:"sent",t:t}); input.value=""; updateSendIcon(); renderMessages();
    const msg=currentChat.messages[currentChat.messages.length-1];
    setTimeout(()=>{msg.st="delivered"; renderMessages();},700);
    setTimeout(()=>{msg.st="read"; renderMessages();},1600);
    setTimeout(()=>maybeReply(currentChat),2600);
    currentChat.preview={fromMe:true,text:text}; currentChat.time=t; currentChat.st="sent";
  }
  const REPLIES=["Got it 👍","Haha nice 😄","Sounds good!","Let me check and get back to you","On my way 🚗","Perfect, thanks!","👍","Sure thing","Tell me more 👀","❤️"];
  function maybeReply(c){
    if(c!==currentChat)return;
    const who=c.group?c.members.find((m)=>m!=="You"):"them";
    const reply=REPLIES[hash(c.id+c.messages.length)%REPLIES.length];
    c.messages.push({from:who,text:reply,t:clockNow()});
    c.preview=c.group?{sender:who,text:reply}:{text:reply}; renderMessages(); renderChats();
  }

  /* ===================== NAV ===================== */
  function showScreen(name){
    ["splash","main","chat"].forEach((s)=>{$("screen-"+s).hidden=s!==name;});
    app.dataset.screen=name;
    if(name==="chat"){$("screen-chat").classList.add("enter-right"); setTimeout(()=>$("screen-chat").classList.remove("enter-right"),280);}
  }
  function backToMain(){const el=$("screen-chat"); el.classList.add("exit-right"); setTimeout(()=>{el.classList.remove("exit-right"); showScreen("main"); currentChat=null;},220);}
  function switchTab(tab){
    document.querySelectorAll(".tab").forEach((b)=>b.classList.toggle("tab-active",b.dataset.tab===tab));
    document.querySelectorAll(".ios-page").forEach((p)=>{p.hidden=p.dataset.panel!==tab; if(p.dataset.panel===tab)p.scrollTop=0;});
  }

  /* ===================== UTIL ===================== */
  function esc(s){return String(s).replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function clockNow(){const d=new Date();let h=d.getHours(),m=d.getMinutes();return(h<10?"0"+h:h)+":"+(m<10?"0"+m:m);}
  let toastTimer;
  function toast(msg){const t=$("toast"); t.textContent=msg; t.hidden=false; clearTimeout(toastTimer); toastTimer=setTimeout(()=>(t.hidden=true),1700);}
  function updateBadge(){const total=chats.reduce((n,c)=>n+(c.unread?1:0),0); const b=$("tab-badge-chats"); if(total>0){b.textContent=total; b.hidden=false;} else b.hidden=true;}
  function updateSendIcon(){const has=$("msg-input").value.trim().length>0; $("send-mic").hidden=has; $("send-arrow").hidden=!has; const btn=$("send-btn"); btn.classList.toggle("is-mic",!has); btn.setAttribute("aria-label",has?"Send":"Voice message"); $("comp-camera").style.display=has?"none":"";}
  function toggleTheme(){const dark=app.dataset.theme==="dark"; app.dataset.theme=dark?"light":"dark"; try{localStorage.setItem("wa-theme",app.dataset.theme);}catch(e){} toast(dark?"Light appearance":"Dark appearance");}

  /* collapse large title on scroll */
  function bindScrollCollapse(){
    document.querySelectorAll(".ios-page").forEach((page)=>{
      const nav=page.querySelector(".ios-nav"); if(!nav)return;
      page.addEventListener("scroll",()=>{nav.classList.toggle("scrolled",page.scrollTop>26);},{passive:true});
    });
  }

  /* ===================== EVENTS ===================== */
  function bind(){
    document.querySelectorAll(".tab").forEach((b)=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));
    $("chat-back").addEventListener("click",backToMain);
    $("send-btn").addEventListener("click",()=>{ if($("msg-input").value.trim())sendMessage(); else toast("Hold to record voice message 🎤"); });
    $("msg-input").addEventListener("input",updateSendIcon);
    $("msg-input").addEventListener("keydown",(e)=>{if(e.key==="Enter")sendMessage();});
    $("comp-plus").addEventListener("click",()=>toast("Attach: Photos · Camera · Document · Location"));
    $("comp-camera").addEventListener("click",()=>toast("Camera"));
    const compose=$("btn-compose"); if(compose)compose.addEventListener("click",()=>toast("New chat"));
    $("chat-header-info").addEventListener("click",()=>currentChat&&toast(currentChat.name+" · contact info"));
    const si=$("search-input"); if(si)si.addEventListener("input",filterChats);
    document.querySelectorAll("#chip-row .chip:not(.chip-add)").forEach((chip)=>chip.addEventListener("click",()=>{document.querySelectorAll("#chip-row .chip").forEach((c)=>c.classList.remove("chip-active")); chip.classList.add("chip-active"); applyFilter(chip.textContent.trim());}));
    bindScrollCollapse();
  }
  function filterChats(){const q=$("search-input").value.toLowerCase(); document.querySelectorAll("#chat-list .chat-row").forEach((row,i)=>{const n=chats[i].name.toLowerCase(); const p=(chats[i].preview.text||"").toLowerCase(); row.style.display=n.includes(q)||p.includes(q)?"":"none";});}
  function applyFilter(kind){document.querySelectorAll("#chat-list .chat-row").forEach((row,i)=>{const c=chats[i]; let show=true; if(kind==="Unread")show=c.unread>0; else if(kind==="Groups")show=!!c.group; else if(kind==="Favourites")show=["leila","amir","fam"].includes(c.id); row.style.display=show?"":"none";});}

  /* ===================== INIT ===================== */
  function init(){
    try{const s=localStorage.getItem("wa-theme"); if(s)app.dataset.theme=s; else if(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches)app.dataset.theme="dark"; else app.dataset.theme="light";}catch(e){app.dataset.theme="light";}
    injectIcons();
    renderChats(); renderStatuses(); renderChannels(); renderCommunities(); renderCalls(); renderSettings();
    updateBadge(); updateSendIcon(); bind();

    const params=new URLSearchParams(location.search);
    const wantTab=params.get("tab"); const wantScreen=params.get("screen"); const wantId=params.get("id");
    const splashDelay=params.get("fast")!==null?0:1400;
    const go=()=>{ showScreen("main"); if(wantTab&&["updates","calls","communities","chats","settings"].includes(wantTab))switchTab(wantTab); if(params.get("action")==="new-chat")toast("New chat"); if(wantScreen==="chat"&&wantId)openChat(wantId); };
    setTimeout(go,splashDelay);

    if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init); else init();
})();
