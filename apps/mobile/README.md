# @pixelmist/mobile — iOS / Android app

Expo (React Native) shell. Components come from `@pixelmist/native`, which mirrors
the `@pixelmist/react` API but renders with RN primitives and resolves the same
token themes at runtime via `resolveTheme()`.

## Run

```bash
cd apps/mobile
npm install        # not part of the root workspace install
npx expo start     # then press a (android) / i (ios) / scan the QR with Expo Go
```

Note: this app is intentionally outside the root npm workspaces (Expo manages its
own dependency graph); install it separately as shown above.
