# Windows build roadmap

The current GitHub demo is intentionally browser-based so the UI and workflow can be reviewed first.

The production Windows build should use Electron (or an equivalent desktop shell) with:
- SQLite local database
- Direct ESC/POS output to the TVS RP-3150 Star
- Receipt and KOT templates
- Auto-cut command after printing
- `.xlsx` monthly export
- Windows installer / `.exe`
- Local backup and restore

Do not use browser `window.print()` as the final printer implementation; it is only a demo fallback.
