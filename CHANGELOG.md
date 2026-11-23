# Changelog

## 1.1.0 (2026-11-23)

### Added
- **Templates from `/deco`:** `TempleBrowser` now runs a second `searchContent` subrequest against `/deco` (in addition to `/templates`) and merges + deduplicates the results by `@id`, so pages can be created from any visible `Document` template inside `/templates` or `/deco`.
- Updated the modal step description and the loading / error / empty states to reference both `/templates` and `/deco`.

## 1.0.0 (2026-11-18)

### Added

- Initial release of `volto-page-from-template`.
- Added Redux modal state (`src/reducers/templeModal.js`, `src/actions/temple.js`) and `appExtras` registration (`src/index.js`).
- Shadowed `@plone/volto/components/manage/Toolbar/Types.jsx` with a 2-column featured tile row for **Page** and **Page from Template**, light/dark mode support, and ADA-compliant focus/hover contrast.
- Added `TempleAddModal` with Pastanaga-consistent styling, two-step workflow, and real-time SEO length validation (Title: 20–50 chars, Description: 120–160 chars).
- Added `TempleBrowser` to list visible `Document` templates from `/templates` and clone their `blocks` and `blocks_layout` onto newly created pages.
