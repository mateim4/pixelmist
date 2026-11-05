# @pixelmist/desktop — Linux / Windows / macOS app

Tauri v2 shell hosting the web build (`apps/web`), so desktop shares 100% of the
UI code with the browser: same components (`@pixelmist/react`), same tokens CSS.

## Run

```bash
# from the repo root, after npm install
npm run dev --prefix apps/desktop        # starts vite (via beforeDevCommand) + cargo tauri dev
npm run build --prefix apps/desktop      # production bundles: .deb/.AppImage/.msi/.dmg per platform
```

## Platform notes

- **Linux**: needs webkit2gtk dev packages (`libwebkit2gtk-4.1-dev`, `libgtk-3-dev`, ...).
- **Windows/macOS**: `cargo tauri build` produces MSI/NSIS and .app/.dmg via `bundle.targets: "all"`.
- IPC bridge for native capabilities (fs, shell, notifications) goes through
  `tauri::generate_handler!` in `src-tauri/src/main.rs` + capabilities JSON —
  extend when the harness needs native powers.
