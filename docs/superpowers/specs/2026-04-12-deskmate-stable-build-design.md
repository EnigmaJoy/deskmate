# Deskmate — Stable Build Design

**Date:** 2026-04-12  
**Branch:** dev  
**Scope:** Router, Settings page, orientation support, crypto fixes, WMO completion

---

## Context

Deskmate is a React/TS/Tailwind/Zustand dashboard served from an ESP32 CrowPanel 5" (800×480) SD card.  
MQTT and real sensor data are **out of scope** for this build — sensors remain hardcoded with TODO.

---

## 1. Routing

**Approach:** State-based routing in `App.tsx` — no react-router-dom dependency.

```ts
const [page, setPage] = useState<'dashboard' | 'settings'>('dashboard')
```

- `navigate` callback passed as prop only to `StatusWidget` (needs gear icon).
- `Settings` receives `navigate` to render the back button.
- No URL changes, no history — appropriate for an embedded single-display app.

---

## 2. Store additions (`useDeskmate.ts`)

Add to existing store:

```ts
orientation: 'landscape' | 'portrait'   // default: 'landscape'
setOrientation: (o: Orientation) => void
```

All existing state (`locale`, `brightness`, `volume`, `location`, `distanceThreshold`) unchanged.

---

## 3. Dashboard — orientation-aware layout

`Dashboard.tsx` reads `orientation` from store. Renders two distinct grid configurations:

**Landscape (800×480) — unchanged:**
```
┌───────────────────────┬───────────┐
│   Sensors (col-span-2)│  Weather  │
├───────────────────────┼───────────┤
│   Crypto  (col-span-2)│  Status   │
└───────────────────────┴───────────┘
```
Grid: `3 columns × 2 rows`, fixed `800×480`.

**Portrait (480×800) — new:**
```
┌───────────────────┐
│      Sensors      │
├───────────────────┤
│      Weather      │
├───────────────────┤
│      Crypto       │
├───────────────────┤
│      Status       │
└───────────────────┘
```
Grid: single column, fixed `480×800`. Each widget `col-span-1`, no span overrides needed.

Widget components receive no new props — layout is purely via CSS grid context.

---

## 4. StatusWidget — gear icon

Add a gear SVG icon (inline, no external dependency) as an absolute-positioned element top-right of the widget. Tap/click calls `navigate('settings')`.

MQTT indicator dot remains hardcoded green (MQTT out of scope).

---

## 5. Settings page

Single scrollable column (fits within portrait and landscape heights). Four sections:

### 5.1 Language
Three pill buttons: `IT | EN | ZH`. Active pill highlighted (white bg, dark text). Calls `setLocale`.

### 5.2 Orientation
Two pill buttons: `↔ Landscape | ↕ Portrait`. Active highlighted. Calls `setOrientation`.

### 5.3 Distance threshold
Slider input, range 10–300 cm, step 5. Live numeric display alongside. Calls `setDistanceThreshold`.

### 5.4 Weather location
Grid of pill buttons — predefined cities:
`Padova | Milano | Roma | London | Berlin | Tokyo`

Each pill stores `{ name, lat, lon }`. Active pill highlighted. Calls `setLocation`.  
Coords:
- Padova: 45.4064, 11.8768
- Milano: 45.4654, 9.1859
- Roma: 41.9028, 12.4964
- London: 51.5074, -0.1278
- Berlin: 52.5200, 13.4050
- Tokyo: 35.6762, 139.6503

### 5.5 Navigation
`← Dashboard` text button top-left (or bottom). Calls `navigate('dashboard')`.

Settings layout: fixed `800×480` in landscape, `480×800` in portrait (reads same `orientation` from store). Uses `overflow-y: auto` as safety net — content should fit without scroll in both orientations, but scrolling is allowed if needed.

---

## 6. Crypto — loading state fix

**Problem:** `data` initializes to `COINS` (price=0), so the `if (!data)` guard never triggers. Widget shows `$0.00` before WebSocket connects.

**Fix:** Initialize `data` as `null`. Add `loading` state or rely on `data === null` check.

```ts
const [data, setData] = useState<CoinData[] | null>(null)
```

Widget already handles `if (!data)` → shows loading. No interface change needed.

**Display before connection:** `—` for price and change (handled by existing loading state render).

---

## 7. Crypto — memory leak fix

**Problem:** `ws.onclose` schedules `setTimeout(connect, 3000)`. On unmount, `wsRef.current?.close()` fires `onclose`, which schedules a reconnect that updates unmounted component state.

**Fix:** Track timer in a ref, clear on cleanup.

```ts
const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

ws.onclose = () => {
    reconnectTimerRef.current = setTimeout(connect, 3000)
}

// cleanup:
return () => {
    reconnectTimerRef.current && clearTimeout(reconnectTimerRef.current)
    wsRef.current?.close()
}
```

Note: `ws.onclose` must be nulled before closing to avoid scheduling a reconnect during cleanup. Set `ws.onclose = null` before `ws.close()`.

---

## 8. WMO codes — completion

Complete coverage for all WMO codes returned by Open-Meteo, in all three locales (it/en/zh).

Missing codes to add:
`55, 56, 57, 65, 66, 67, 73, 74, 75, 77, 81, 82, 85, 86, 96, 99`

All three locale blocks in `i18n.ts` updated in parallel.

---

## Files changed

| File | Change |
|------|--------|
| `src/App.tsx` | State-based router, passes `navigate` prop |
| `src/store/useDeskmate.ts` | Add `orientation` + `setOrientation` |
| `src/pages/Dashboard.tsx` | Orientation-aware grid layout |
| `src/pages/Settings.tsx` | Full implementation (currently empty) |
| `src/components/StatusWidget.tsx` | Add gear icon + `navigate` prop |
| `src/hooks/useCrypto.ts` | `null` init, memory leak fix |
| `src/lib/i18n.ts` | Complete WMO codes in all 3 locales |

**No new files. No new dependencies.**
