# Swadistha POS — GitHub Demo

A compact cafe POS prototype for Swadistha.

## Demo features
- Orange / white / black theme with a small blue accent
- Swadistha white logotype on orange
- Dish/menu management
- Search and category filtering
- Billing cart with quantity controls
- Percentage or fixed discounts
- GST calculation
- KOT creation + browser demo print
- Customer bill customization
- Inventory tracking with low-stock status
- Monthly billing export as `.xlsx` when the SheetJS CDN is available, with CSV fallback
- TVS RP-3150 Star printer target documented for the desktop build
- Full-screen, no-page-scroll layout

## Preview locally
Open `index.html` in Chrome/Edge.

For GitHub Pages:
1. Create a GitHub repository.
2. Upload `index.html` and the `assets` folder.
3. Enable GitHub Pages from the repository's Pages settings.
4. Open the generated Pages URL.

## Important printer note
The browser demo intentionally uses the browser print dialog. A browser page cannot reliably send raw ESC/POS USB commands to a Windows thermal printer.

The production Windows build should be an Electron desktop app with an ESC/POS printer adapter. The TVS RP-3150 Star is an ESC/POS printer with an auto cutter, so the desktop build can send the cut command directly after the receipt/KOT.

## Next production stage
- Electron Windows app
- SQLite local database
- Direct RP-3150 USB printing
- ESC/POS logo rasterization
- Auto-cut after KOT and bill
- Printer test/status
- Excel `.xlsx` export
- Backup/restore
- Optional multi-user / LAN mode

## Branding assets
- `assets/swadistha-logo-white.png` — white Swadistha logotype for orange backgrounds
- `assets/swadistha-app-icon.jpg` — newly supplied orange Swadistha app icon
- Primary UI orange: `#FF6232`
