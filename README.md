# volto-page-from-template

Volto addon that adds a **Page from Template** option to the Volto Toolbar **Add content** menu, guiding editors through a two-step modal to enter SEO-validated metadata and clone blocks from any visible template page in `/templates`.

## Features

- **Enhanced Add Content Menu** (`src/customizations/volto/components/manage/Toolbar/Types.jsx`):
  - Displays **Page** and **Page from Template** as a 2-column featured tile row at the top of the Add menu (when `Document` is addable in the current context), followed by all other addable Plone content types in the standard list.
  - Supports light and dark mode (`prefers-color-scheme: dark`) with WCAG AA+ contrast and visible `:focus-visible` states.
- **Step 1 — Metadata & SEO Validation** (`src/components/TempleAddModal/TempleAddModal.jsx`, `src/helpers/seoValidation.js`):
  - Real-time character-length progress bars and helper text for:
    - **Title**: 20–50 characters optimal
    - **Description**: 120–160 characters optimal
- **Step 2 — Template Picker** (`src/components/TempleAddModal/TempleBrowser.jsx`):
  - Queries `/@search` for `Document` pages directly under `/templates` (`path.depth: 1`) visible to the current user.
  - Renders a 3-column card grid with `16:9` preview images and titles.
- **Page Creation & Block Cloning** (`src/actions/temple.js`):
  - Creates a new `Document` in the current folder with the entered Title and Description.
  - Fetches `blocks` and `blocks_layout` from the selected template page and patches them onto the newly created page.
  - Navigates directly to `/edit` on the newly created page.

## Installation

1. Add `"volto-page-from-template": "workspace:*"` to `frontend/package.json` dependencies.
2. Add `'volto-page-from-template'` to `addons` in `frontend/volto.config.js`.
3. Run `pnpm install` in `frontend/`.

## Usage

1. Create a `/templates` folder or page in your Plone site and add `Document` pages inside it (optionally with preview images).
2. Open the **+** (**Add content**) menu in the Volto Toolbar from any folder where `Document` is addable.
3. Click **Page from Template**, enter the Title and Description, and select a template.
