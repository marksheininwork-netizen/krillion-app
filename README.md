# Krillion iOS app

This XcodeGen project packages the playable Krillion PWA in the app bundle. The game and its support, terms, and privacy pages are available offline after installation.

## Build locally

Requirements: macOS, Xcode, and XcodeGen.

1. Run `swift scripts/make-icon.swift Krillion`.
2. Run `xcodegen generate`.
3. Open `Krillion.xcodeproj` in Xcode.
4. Select the Apple Developer team for signing. Keep the existing bundle ID `com.mariasheinin.krillion`.
5. Run on a simulator or a registered device, then create an archive for App Store Connect.

The GitHub Actions workflow is manually triggered and makes an **unsigned test IPA**. It is useful for inspecting build output but cannot be installed or uploaded to App Store Connect as a production build.

The App Store metadata copy and open questions are in `APP-STORE-DRAFT.md`. The listing has not been submitted.
