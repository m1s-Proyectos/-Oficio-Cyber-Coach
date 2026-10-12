# src/features

One folder per user-facing surface:

- `home/` — landing page and scenario catalog.
- `simulation/` — single reusable scenario player.
- `results/` — end-of-run summary and recommendations.

Only pages, hooks and view-models tied to that surface belong here. The engine lives in `src/engine`, scenario scripts in `src/content`, and local progress in `localStorage`.
