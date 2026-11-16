# RoleLeaf Demo

Direct-download demos for **Android** and **desktop Chrome**. No official app-store installation is required.

- Android: download the APK, open it and confirm installation. Allow this browser to install unknown apps only when prompted.
- Chrome: extract the ZIP, open `chrome://extensions`, enable Developer mode and load the inner `tipsy-exporter` folder. Keep that folder in place.

The download page provides English and Chinese instructions, version information and SHA-256 checksums. macOS is not distributed here. This repository contains the demo download site and packages; the full application source repository remains private while its license is being decided.

Demo versions: Chrome **0.5.7**, Android **0.5.7-demo.22**. Exported content stays on your device; source websites and their access rules still apply. Missing fields and incomplete history are reported in each exported ZIP.

## Maintainers

GitHub Pages publishes the `docs/` directory from `main`. Before pushing a new release, run `deployment/prepare-pages.py --site docs` with `DEMO_PAGES_URL` set to the actual Pages address to verify both packages and generate the QR. The optional Actions example is stored outside `.github/workflows` and is not active.

The Android demo must retain its application ID and signing identity for updates; never put signing material in this repository. Upload only reviewed Android/Chrome demo artifacts. No macOS files, private exports or credentials belong here.
