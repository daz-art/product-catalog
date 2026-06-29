#!/usr/bin/env python3
"""Generate WhatsApp mockup PNG icons using only the Python standard library.

Rasterizes the WhatsApp glyph (green background + white phone handset) by
flattening the SVG bezier path to polygons and scanline-filling with 3x
supersampling, then writes PNGs with a hand-rolled zlib/PNG encoder.
"""
import struct, zlib, math

# ---- WhatsApp glyph path (matches icon.svg), viewBox 512x512 ----
PATH = ("M256 96 c-88.4 0-160 71.6-160 160 0 28.1 7.4 55.5 21.4 79.6 L96 416 l83.2-21.8 "
        "A159.3 159.3 0 0 0 256 416 c88.4 0 160-71.6 160-160 S344.4 96 256 96 z "
        "m93.5 226.1 c-3.9 11-22.9 21.2-31.9 22.7-8.2 1.2-18.4 1.7-29.7-1.9-6.8-2.1-15.6-5-26.8-9.9 "
        "-47.2-20.4-78-67.8-80.3-71-2.3-3.1-19.2-25.6-19.2-48.8 s12.1-34.6 16.4-39.3 c4.3-4.7 9.4-5.9 12.5-5.9 "
        "c3.1 0 6.3 0 9 .1 2.9.1 6.7-1.1 10.5 8 3.9 9.4 13.3 32.6 14.5 35 1.2 2.3 2 5.1.4 8.2 "
        "-1.6 3.1-2.3 5.1-4.7 7.8-2.3 2.7-4.9 6-7 8.1-2.3 2.3-4.7 4.8-2 9.4 2.7 4.7 12 19.8 25.8 32 "
        "17.7 15.8 32.6 20.7 37.3 23 4.7 2.3 7.4 1.9 10.1-1.2 2.7-3.1 11.7-13.6 14.8-18.3 3.1-4.7 6.3-3.9 10.5-2.3 "
        "4.3 1.6 27.4 12.9 32.1 15.3 4.7 2.3 7.8 3.5 9 5.5 1.2 2 1.2 11.4-2.7 22.4 z")

def tokenize(d):
    toks, num = [], ""
    for ch in d:
        if ch.isalpha():
            if num: toks.append(num); num = ""
            toks.append(ch)
        elif ch in "-+":
            if num and num[-1] not in "eE": toks.append(num); num = ""
            num += ch
        elif ch in " ,\n\t":
            if num: toks.append(num); num = ""
        elif ch == ".":
            if "." in num and "e" not in num.lower(): toks.append(num); num = "."
            else: num += ch
        else:
            num += ch
    if num: toks.append(num)
    return toks

def cubic(cx, cy, x1, y1, x2, y2, x, y, steps):
    pts = []
    for s in range(1, steps + 1):
        t = s / steps; mt = 1 - t
        bx = mt**3*cx + 3*mt*mt*t*x1 + 3*mt*t*t*x2 + t**3*x
        by = mt**3*cy + 3*mt*mt*t*y1 + 3*mt*t*t*y2 + t**3*y
        pts.append((bx, by))
    return pts

def arc_points(x1, y1, rx, ry, phi_deg, large, sweep, x2, y2, steps=16):
    """Flatten an SVG elliptical arc to points (endpoint -> center param)."""
    if rx == 0 or ry == 0 or (x1 == x2 and y1 == y2):
        return [(x2, y2)]
    phi = math.radians(phi_deg)
    cosp, sinp = math.cos(phi), math.sin(phi)
    dx, dy = (x1 - x2) / 2.0, (y1 - y2) / 2.0
    x1p = cosp*dx + sinp*dy
    y1p = -sinp*dx + cosp*dy
    rx, ry = abs(rx), abs(ry)
    lam = x1p*x1p/(rx*rx) + y1p*y1p/(ry*ry)
    if lam > 1:
        s = math.sqrt(lam); rx *= s; ry *= s
    num_ = rx*rx*ry*ry - rx*rx*y1p*y1p - ry*ry*x1p*x1p
    den = rx*rx*y1p*y1p + ry*ry*x1p*x1p
    co = math.sqrt(max(0.0, num_/den)) if den else 0.0
    if large == sweep: co = -co
    cxp = co*rx*y1p/ry
    cyp = -co*ry*x1p/rx
    cx = cosp*cxp - sinp*cyp + (x1 + x2)/2.0
    cy = sinp*cxp + cosp*cyp + (y1 + y2)/2.0
    def ang(ux, uy, vx, vy):
        d = math.hypot(ux, uy)*math.hypot(vx, vy)
        c = max(-1.0, min(1.0, (ux*vx + uy*vy)/d)) if d else 1.0
        a = math.acos(c)
        if ux*vy - uy*vx < 0: a = -a
        return a
    th1 = ang(1, 0, (x1p-cxp)/rx, (y1p-cyp)/ry)
    dth = ang((x1p-cxp)/rx, (y1p-cyp)/ry, (-x1p-cxp)/rx, (-y1p-cyp)/ry)
    if not sweep and dth > 0: dth -= 2*math.pi
    if sweep and dth < 0: dth += 2*math.pi
    pts = []
    for s in range(1, steps+1):
        th = th1 + dth*s/steps
        px = cosp*rx*math.cos(th) - sinp*ry*math.sin(th) + cx
        py = sinp*rx*math.cos(th) + cosp*ry*math.sin(th) + cy
        pts.append((px, py))
    return pts

def flatten(d, steps=24):
    """Return list of subpaths, each a list of (x,y) points."""
    toks = tokenize(d)
    i = 0
    cx = cy = sx = sy = 0.0
    pc2x = pc2y = 0.0  # previous cubic 2nd control point (for smooth S/s)
    subs, cur = [], []
    cmd = None
    def num():
        nonlocal i
        v = float(toks[i]); i += 1; return v
    while i < len(toks):
        if toks[i].isalpha():
            cmd = toks[i]; i += 1
        c = cmd
        if c in "Mm":
            x = num(); y = num()
            if c == "m": x += cx; y += cy
            if cur: subs.append(cur)
            cur = [(x, y)]; cx, cy = x, y; sx, sy = x, y
            cmd = "l" if c == "m" else "L"
        elif c in "Ll":
            x = num(); y = num()
            if c == "l": x += cx; y += cy
            cur.append((x, y)); cx, cy = x, y
        elif c in "Hh":
            x = num()
            if c == "h": x += cx
            cur.append((x, cy)); cx = x
        elif c in "Vv":
            y = num()
            if c == "v": y += cy
            cur.append((cx, y)); cy = y
        elif c in "Cc":
            x1 = num(); y1 = num(); x2 = num(); y2 = num(); x = num(); y = num()
            if c == "c":
                x1 += cx; y1 += cy; x2 += cx; y2 += cy; x += cx; y += cy
            cur += cubic(cx, cy, x1, y1, x2, y2, x, y, steps)
            pc2x, pc2y = x2, y2; cx, cy = x, y
        elif c in "Ss":
            x2 = num(); y2 = num(); x = num(); y = num()
            if c == "s":
                x2 += cx; y2 += cy; x += cx; y += cy
            x1 = 2*cx - pc2x; y1 = 2*cy - pc2y  # reflect previous control point
            cur += cubic(cx, cy, x1, y1, x2, y2, x, y, steps)
            pc2x, pc2y = x2, y2; cx, cy = x, y
        elif c in "Aa":
            rx = num(); ry = num(); rot = num(); large = num(); sweep = num(); x = num(); y = num()
            if c == "a": x += cx; y += cy
            cur += arc_points(cx, cy, rx, ry, rot, large, sweep, x, y)
            cx, cy = x, y
        elif c in "Zz":
            cur.append((sx, sy)); subs.append(cur); cur = []; cx, cy = sx, sy
        else:
            i += 1
    if cur: subs.append(cur)
    return subs

def fill_mask(subs, W, H, ss=3):
    """Even-odd scanline fill with ss supersampling. Returns coverage 0..1 floats."""
    sw, sh = W*ss, H*ss
    cov = bytearray(sw*sh)
    polys = [[(x*ss, y*ss) for (x, y) in s] for s in subs]
    for y in range(sh):
        yc = y + 0.5
        xs = []
        for p in polys:
            n = len(p)
            for k in range(n):
                x1, y1 = p[k]; x2, y2 = p[(k+1) % n]
                if (y1 <= yc < y2) or (y2 <= yc < y1):
                    t = (yc - y1) / (y2 - y1)
                    xs.append(x1 + t*(x2 - x1))
        xs.sort()
        for k in range(0, len(xs)-1, 2):
            a = int(math.ceil(xs[k]-0.5)); b = int(math.floor(xs[k+1]-0.5))
            if b < 0 or a >= sw: continue
            a = max(a, 0); b = min(b, sw-1)
            row = y*sw
            for x in range(a, b+1):
                cov[row+x] = 1
    # downsample
    out = [0.0]*(W*H)
    inv = 1.0/(ss*ss)
    for yy in range(H):
        for xx in range(W):
            s = 0
            for dy in range(ss):
                base = (yy*ss+dy)*sw + xx*ss
                for dx in range(ss):
                    s += cov[base+dx]
            out[yy*W+xx] = s*inv
    return out

def lerp(a, b, t): return a + (b-a)*t

def render(size, maskable=False):
    scale = size/512.0
    subs = flatten(PATH)
    subs = [[(x*scale, y*scale) for (x, y) in s] for s in subs]
    mask = fill_mask(subs, size, size, ss=3)
    px = bytearray(size*size*4)
    # rounded-corner radius for non-maskable; maskable = full bleed square
    r = 0 if maskable else size*0.22
    for y in range(size):
        for x in range(size):
            # green vertical gradient
            t = y/size
            gr = int(lerp(0x25, 0x60, t)); gg = int(lerp(0xb0, 0xd6, t)); gb = int(lerp(0x38, 0x6a, t))
            alpha = 255
            if r > 0:
                # rounded square alpha
                dx = max(r-x, x-(size-r), 0.0)
                dy = max(r-y, y-(size-r), 0.0)
                dist = math.hypot(dx, dy)
                if dist > r: alpha = max(0, int(255*(1-(dist-r))))
            cov = mask[y*size+x]
            R = int(lerp(gr, 255, cov)); G = int(lerp(gg, 255, cov)); B = int(lerp(gb, 255, cov))
            o = (y*size+x)*4
            px[o]=R; px[o+1]=G; px[o+2]=B; px[o+3]=alpha
    return write_png(size, size, px)

def write_png(W, H, rgba):
    def chunk(typ, data):
        c = struct.pack(">I", len(data)) + typ + data
        return c + struct.pack(">I", zlib.crc32(typ+data) & 0xffffffff)
    raw = bytearray()
    for y in range(H):
        raw.append(0)
        raw += rgba[y*W*4:(y+1)*W*4]
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", W, H, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw), 9)
    return sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")

if __name__ == "__main__":
    for sz, name, mask in [(192,"icon-192.png",False),(512,"icon-512.png",False),
                           (180,"icon-180.png",False),(512,"icon-maskable-512.png",True)]:
        data = render(sz, mask)
        open(name, "wb").write(data)
        print("wrote", name, len(data), "bytes")
