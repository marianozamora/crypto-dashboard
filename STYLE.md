# STYLE.md — cryptostream Design System

## Vision
Dark, data-dense, professional trading dashboard.
Inspired by terminal UIs and financial platforms.
NOT a generic SaaS dashboard — this should feel like a tool
that traders actually use.

## Color Palette

### Backgrounds (dark layers)
bg-[#0a0b0f]      → page background (deepest)
bg-[#111318]      → surface (cards, panels)
bg-[#1a1d27]      → surface elevated (hover, dropdowns)
bg-[#21253a]      → surface card (active states)

### Accent colors
#00d4aa   → green  (positive, connected, up)
#ff4d6d   → red    (negative, disconnected, down)
#ffd166   → yellow (warning, connecting, neutral)
#4da6ff   → blue   (primary, charts, links)
#a78bfa   → purple (AI commentary, special)

### Text hierarchy
text-white          → primary values (prices)
text-white/60       → labels, headers
text-white/30       → secondary info (timestamps)
text-white/10       → dividers, subtle borders

## Typography

### Font families
font-sans  → Inter — UI labels, descriptions
font-mono  → JetBrains Mono — ALL prices, timestamps, numbers

### Font sizes
text-3xl font-bold font-mono    → main price (PriceTag lg)
text-xl font-semibold font-mono → secondary price (PriceTag md)
text-sm font-mono               → timestamps, averages
text-xs uppercase tracking-wider → section labels

## Components

### Cards
background: bg-[#111318]
border: border border-white/5
border radius: rounded-2xl
padding: p-5
NO box shadow — border only
hover: border-white/10 transition-colors duration-200

### Price values
always font-mono
positive change → text-[#00d4aa]
negative change → text-[#ff4d6d]
neutral/loading → text-white/40

### Charts (Recharts)
background: transparent
grid lines: stroke rgba(255,255,255,0.04)
line color: #4da6ff stroke-width 2
NO dots on line (dot={false})
NO animation (isAnimationActive={false})
tooltip: bg-[#1a1d27] border border-white/10 rounded-lg p-3
X/Y axis tick: fill rgba(255,255,255,0.25) fontSize 10
Y axis: right side (orientation="right")
height: 120px inside card

### Badge (connection status)
connecting  → dot bg-[#ffd166] animate-pulse + text-[#ffd166]
connected   → dot bg-[#00d4aa] solid + text-[#00d4aa]
disconnected → dot bg-[#ff4d6d] solid + text-[#ff4d6d]
dot size: w-1.5 h-1.5 rounded-full

### Stat rows
layout: flex justify-between items-center
label: text-white/40 text-xs uppercase tracking-wide
value: font-mono text-sm text-white
divider: border-t border-white/5 py-2

## Layout

### Dashboard grid
3 columns desktop: grid grid-cols-3 gap-4
1 column mobile: grid-cols-1
page padding: px-6 py-8
max width: max-w-7xl mx-auto

### Header
height: h-14
border bottom: border-b border-white/5
background: bg-[#0a0b0f]
logo: monospace font, ◈ prefix in text-[#4da6ff]

### Card internal layout
┌─────────────────────────┐
│ LABEL          [badge]  │  text-xs uppercase tracking-wider text-white/40
│                         │
│ $2,341.56               │  text-3xl font-bold font-mono text-white
│ 14:32:01                │  text-xs font-mono text-white/30
│─────────────────────────│  border-t border-white/5
│ [chart 120px high]      │  recharts
│─────────────────────────│  border-t border-white/5
│ 1h Avg    $2,310.00     │  stat row
│ vs Avg      +1.35%      │  stat row colored
└─────────────────────────┘

## AI Commentary Widget
full width below grid
border: border border-[#a78bfa]/20
left accent: border-l-2 border-[#a78bfa] pl-4
icon: ◈ text-[#a78bfa] before title
text: text-white/70 text-sm leading-relaxed italic
timestamp: text-white/20 text-xs font-mono
loading: skeleton shimmer + "Generating commentary..."

## What to avoid
❌ White or light backgrounds
❌ Colored card backgrounds
❌ rounded corners > rounded-2xl
❌ Box shadows
❌ Sans-serif font for numbers
❌ Dots on chart lines
❌ Chart animations
❌ Gradient backgrounds on cards
❌ More than 2 accent colors per card
❌ Bold text for labels
