# Krillion iOS Web Wrapper Starter

SwiftUI + WKWebView iOS game project for Krillion, served by the Cloudflare Worker.

- App Store Connect bundle ID: `com.mariasheinin.krillion`
- Content: seven-question typed-answer rarity diving game
- Website URL: `https://krillion-app.marksheininwork.workers.dev`
- Deployment: iOS 16.0+; marketing version 1.0.0 (build 1)

## Build on a Mac
1. Install Xcode and XcodeGen (`brew install xcodegen`).
2. Run `swift scripts/make-icon.swift Krillion` to generate the placeholder icon.
3. Run `xcodegen generate` and open `Krillion.xcodeproj`.
4. Choose the matching Apple Developer team in Signing & Capabilities.
5. Build and smoke-check the game at the configured Worker URL before preparing a store build.
6. To create an **App Store-uploadable** IPA, archive in Xcode and export using an Apple distribution signing identity and provisioning profile for `com.mariasheinin.krillion`.

The GitHub Actions workflow runs only on manual dispatch and produces a clearly marked **UNSIGNED test IPA**, not an App Store uploadable file. It uses a GitHub macOS runner; charges or minutes may apply depending on account plan and repository visibility.

**Not ready for App Review:** A placeholder without meaningful functionality may be rejected under Apple's minimum functionality rules. Full game content, privacy declarations, metadata, accessibility checks and valid signing are required first.


## Data sources
- Geography country and area names follow the United Nations Statistics Division M49 list: https://unstats.un.org/unsd/methodology/m49/.
- The country-answer validator uses exact ISO country/area aliases and does not use a model to approve unknown answers.
- Deployment generates a 5,000-entry major-cities answer list from the GeoNames cities5000 extract. Names are exact-match; ASCII spellings are also accepted when GeoNames provides them.
- GeoNames data is CC BY 4.0; attribution: GeoNames (https://www.geonames.org/). The generated city list is sourced from https://download.geonames.org/export/dump/cities5000.zip.
