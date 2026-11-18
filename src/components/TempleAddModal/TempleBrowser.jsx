import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Dimmer, Image, Loader, Message } from 'semantic-ui-react';
import { searchContent } from '@plone/volto/actions/search/search';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';

const SUBREQUEST_KEY = 'templates-browser';

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

  const searchState = useSelector(
    (state) => state.search?.subrequests?.[SUBREQUEST_KEY],
  );
  const items = searchState?.items || [];
  const loading = searchState?.loading;
  const error = searchState?.error;

  useEffect(() => {
    dispatch(
      searchContent(
        '',
        {
          'path.query': '/templates',
          'path.depth': 1,
          portal_type: 'Document',
          metadata_fields: ['image_field', 'image_scales'],
          b_size: 100,
          sort_on: 'getObjPositionInParent',
        },
        SUBREQUEST_KEY,
      ),
    );
  }, [dispatch]);

  if (loading) {
    return (
      <div className="temple-browser-loading">
        <Dimmer active inverted>
          <Loader>Loading templates from /templates…</Loader>
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
          Could not fetch pages from /templates.
          {errorDetail ? ` (${errorDetail})` : ''}
        </p>
      </Message>
    );
  }

  if (items.length === 0) {
    return (
      <Message info>
        <Message.Header>No templates found</Message.Header>
        <p>No pages were found inside /templates.</p>
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
