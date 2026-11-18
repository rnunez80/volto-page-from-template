import React from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import filter from 'lodash/filter';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { FormattedMessage } from 'react-intl';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import langmap from '@plone/volto/helpers/LanguageMap/LanguageMap';
import { toBackendLang } from '@plone/volto/helpers/Utils/Utils';
import addDocumentSVG from '@plone/volto/icons/add-document.svg';
import calendarSVG from '@plone/volto/icons/calendar.svg';
import fileSVG from '@plone/volto/icons/file.svg';
import folderSVG from '@plone/volto/icons/folder.svg';
import imageSVG from '@plone/volto/icons/image.svg';
import linkSVG from '@plone/volto/icons/link.svg';
import newsSVG from '@plone/volto/icons/news.svg';
import pageSVG from '@plone/volto/icons/page.svg';
import { openTempleModal } from 'volto-page-from-template/actions/temple';
import './Types.css';

const FEATURED_TYPES = ['Document'];

const TYPE_ICONS = {
  Document: pageSVG,
  File: fileSVG,
  Event: calendarSVG,
  Image: imageSVG,
  Link: linkSVG,
  'News Item': newsSVG,
  Folder: folderSVG,
};

const getTypeId = (item) => item['@id']?.split('@types/')[1] || '';

const Types = ({ types, pathname, content, currentLanguage }) => {
  const dispatch = useDispatch();
  const availableLanguages = useSelector(
    (state) => state.site?.data?.['plone.available_languages'] || [],
  );

  // Strip trailing /contents or / to get the target folder path
  const currentPath = pathname.replace(/\/contents$/, '').replace(/\/$/, '');
  const addableTypes = filter(types);

  const canAddPage = addableTypes.some(
    (item) => getTypeId(item) === 'Document',
  );

  // Split types into featured top tiles (File, Page) and secondary list rows
  const featuredTypes = addableTypes.filter((item) =>
    FEATURED_TYPES.includes(getTypeId(item)),
  );
  const secondaryTypes = addableTypes.filter(
    (item) => !FEATURED_TYPES.includes(getTypeId(item)),
  );

  return addableTypes.length > 0 || content?.['@components']?.translations ? (
    <div className="menu-more pastanaga-menu add-content-menu">
      {addableTypes.length > 0 && (
        <>
          <header className="add-content-header">
            <FormattedMessage id="Add content" defaultMessage="Add content" />
          </header>

          {(canAddPage || featuredTypes.length > 0) && (
            <div className="add-types-featured-grid">
              {featuredTypes.map((item) => {
                const typeId = getTypeId(item);
                const addRoute = `${currentPath}/add?type=${typeId}`;
                const icon = TYPE_ICONS[typeId] || pageSVG;
                return (
                  <Link
                    key={item['@id']}
                    to={addRoute}
                    id={`toolbar-add-${typeId.toLowerCase().replace(' ', '-')}`}
                    className="add-type-tile"
                  >
                    <Icon name={icon} size="32px" className="add-type-icon" />
                    <span className="add-type-label">
                      <FormattedMessage id={item.title} />
                    </span>
                  </Link>
                );
              })}

              {canAddPage && (
                <button
                  type="button"
                  id="toolbar-add-page-from-template"
                  className="add-type-tile add-type-tile-temple"
                  onClick={() => dispatch(openTempleModal(currentPath || '/'))}
                >
                  <Icon
                    name={addDocumentSVG}
                    size="32px"
                    className="add-type-icon"
                  />
                  <span className="add-type-label">
                    <FormattedMessage
                      id="Page from Template"
                      defaultMessage="Page from Template"
                    />
                  </span>
                </button>
              )}
            </div>
          )}

          {secondaryTypes.length > 0 && (
            <ul className="add-types-list">
              {secondaryTypes.map((item) => {
                const typeId = getTypeId(item);
                const addRoute = `${currentPath}/add?type=${typeId}`;
                const icon = TYPE_ICONS[typeId] || pageSVG;
                return (
                  <li key={item['@id']} className="add-types-list-item">
                    <Link
                      to={addRoute}
                      id={`toolbar-add-${typeId.toLowerCase().replace(' ', '-')}`}
                      className="add-types-list-link"
                    >
                      <Icon
                        name={icon}
                        size="18px"
                        className="add-types-list-icon"
                      />
                      <span className="add-types-list-label">
                        <FormattedMessage id={item.title} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {content?.['@components']?.translations &&
        (() => {
          const translationsLeft = filter(
            availableLanguages,
            (lang) =>
              !(
                content?.['@components']?.translations &&
                find(content?.['@components']?.translations?.items, {
                  language: lang,
                })
              ) && toBackendLang(currentLanguage) !== lang,
          );

          return (
            !isEmpty(translationsLeft) && (
              <>
                <header>
                  <FormattedMessage
                    id="Add Translation…"
                    defaultMessage="Add Translation…"
                  />
                </header>
                <div className="pastanaga-menu-list">
                  <ul>
                    {map(translationsLeft, (lang) => (
                      <li key={lang}>
                        <Link
                          to={{
                            pathname: `${pathname}/create-translation`,
                            state: {
                              type: content['@type'],
                              translationOf: flattenToAppURL(content['@id']),
                              language: lang,
                            },
                          }}
                          className="item"
                        >
                          <FormattedMessage
                            id="Translate to {lang}"
                            defaultMessage="Translate to {lang}"
                            values={{
                              lang: (
                                langmap[lang]?.nativeName || lang
                              ).toLowerCase(),
                            }}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )
          );
        })()}
    </div>
  ) : (
    <span />
  );
};

Types.propTypes = {
  pathname: PropTypes.string.isRequired,
  types: PropTypes.arrayOf(
    PropTypes.shape({
      '@id': PropTypes.string,
      addable: PropTypes.bool,
      title: PropTypes.string,
    }),
  ).isRequired,
};

export default connect(
  (state) => ({
    types: filter(state.types.types, 'addable'),
    currentLanguage: state.intl.locale,
  }),
  {},
)(Types);
