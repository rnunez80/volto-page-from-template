import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Dimmer, Image, Loader, Message } from 'semantic-ui-react';
import { searchContent } from '@plone/volto/actions/search/search';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';

const SUBREQUEST_KEY = 'templates-browser';
const DECO_SUBREQUEST_KEY = 'deco-browser';

/**
 * Extracts a preview image URL from Plone's image_scales or preview_image metadata.
 */
function getPreviewImageUrl(item) {
  const baseUrl = flattenToAppURL(item['@id']);
  const field = item.image_field || 'preview_image';
  const scales = item.image_scales?.[field]?.[0];

  if (scales?.scales?.preview?.download) {
    return `${baseUrl}/${scales.scales.preview.download}`;
  }
  if (scales?.download) {
    return `${baseUrl}/${scales.download}`;
  }
  return null;
}

const TempleBrowser = ({ onSelectTemple, isCreating }) => {
  const dispatch = useDispatch();

  const templatesState = useSelector(
    (state) => state.search?.subrequests?.[SUBREQUEST_KEY],
  );
  const decoState = useSelector(
    (state) => state.search?.subrequests?.[DECO_SUBREQUEST_KEY],
  );

  const templatesItems = templatesState?.items || [];
  const decoItems = decoState?.items || [];
  const seenIds = new Set();
  const items = [...templatesItems, ...decoItems].filter((item) => {
    const id = item?.['@id'];
    if (!id || seenIds.has(id)) return false;
    seenIds.add(id);
    return true;
  });

  const loading =
    (templatesState?.loading || decoState?.loading) && items.length === 0;
  const error =
    templatesState?.error && decoState?.error ? templatesState.error : null;

  useEffect(() => {
    const baseQuery = {
      'path.depth': 1,
      portal_type: 'Document',
      metadata_fields: ['image_field', 'image_scales'],
      b_size: 100,
      sort_on: 'getObjPositionInParent',
    };

    dispatch(
      searchContent(
        '',
        {
          ...baseQuery,
          'path.query': '/templates',
        },
        SUBREQUEST_KEY,
      ),
    );
    dispatch(
      searchContent(
        '',
        {
          ...baseQuery,
          'path.query': '/deco',
        },
        DECO_SUBREQUEST_KEY,
      ),
    );
  }, [dispatch]);

  if (loading) {
    return (
      <div className="temple-browser-loading">
        <Dimmer active inverted>
          <Loader>Loading templates from /templates and /deco…</Loader>
        </Dimmer>
      </div>
    );
  }

  if (error) {
    const errorDetail =
      error?.response?.body?.message ||
      error?.message ||
      (error?.status ? `HTTP ${error.status}` : null);
    return (
      <Message negative>
        <Message.Header>Unable to load templates</Message.Header>
        <p>
          Could not fetch pages from /templates or /deco.
          {errorDetail ? ` (${errorDetail})` : ''}
        </p>
      </Message>
    );
  }

  if (items.length === 0) {
    return (
      <Message info>
        <Message.Header>No templates found</Message.Header>
        <p>No pages were found inside /templates or /deco.</p>
      </Message>
    );
  }

  return (
    <div className="temple-browser-grid">
      <Card.Group itemsPerRow={3} stackable>
        {items.map((item) => {
          const previewUrl = getPreviewImageUrl(item);
          return (
            <Card
              key={item['@id']}
              link
              className="temple-card"
              onClick={() => !isCreating && onSelectTemple(item)}
            >
              <div className="temple-card-image-wrapper">
                {previewUrl ? (
                  <Image src={previewUrl} alt={item.title} wrapped ui={false} />
                ) : (
                  <div className="temple-card-placeholder">No Preview</div>
                )}
              </div>
              <Card.Content>
                <Card.Header>{item.title}</Card.Header>
                {item.description && (
                  <Card.Description>{item.description}</Card.Description>
                )}
              </Card.Content>
            </Card>
          );
        })}
      </Card.Group>
    </div>
  );
};

TempleBrowser.propTypes = {
  onSelectTemple: PropTypes.func.isRequired,
  isCreating: PropTypes.bool,
};

export default TempleBrowser;
