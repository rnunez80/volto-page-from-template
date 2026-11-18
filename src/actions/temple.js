import {
  createContent,
  getContent,
  updateContent,
} from '@plone/volto/actions/content/content';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';

export const OPEN_TEMPLE_MODAL = 'OPEN_TEMPLE_MODAL';
export const CLOSE_TEMPLE_MODAL = 'CLOSE_TEMPLE_MODAL';

export const openTempleModal = (targetPath) => ({
  type: OPEN_TEMPLE_MODAL,
  targetPath,
});

export const closeTempleModal = () => ({
  type: CLOSE_TEMPLE_MODAL,
});

/**
 * Step 3 workflow:
 * 1. Create a new Document in `targetPath` with Title & Description.
 * 2. Fetch full source temple page to retrieve `blocks` and `blocks_layout`.
 * 3. PATCH the newly created page with the cloned blocks.
 * Returns the app-relative URL of the newly created page.
 */
export async function createPageFromTemple(
  dispatch,
  { targetPath, title, description, sourceTemplePath },
) {
  // 1. Create the new standard Page (Document) in the current folder
  const created = await dispatch(
    createContent(targetPath, {
      '@type': 'Document',
      title: title.trim(),
      description: description.trim(),
    }),
  );

  const newPageUrl = flattenToAppURL(created['@id']);

  // 2. Fetch full block data from the selected source temple page
  const sourceAppUrl = flattenToAppURL(sourceTemplePath);
  const sourceContent = await dispatch(
    getContent(sourceAppUrl, null, 'temple-source'),
  );

  const blocks = sourceContent?.blocks || {};
  const blocks_layout = sourceContent?.blocks_layout || { items: [] };

  // 3. Copy & save blocks into the newly created page
  await dispatch(
    updateContent(newPageUrl, {
      blocks,
      blocks_layout,
    }),
  );

  return newPageUrl;
}
