import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Dimmer,
  Form,
  Loader,
  Message,
  Modal,
  Progress,
  Step,
} from 'semantic-ui-react';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import backSVG from '@plone/volto/icons/back.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import { closeTempleModal, createPageFromTemple } from '../../actions/temple';
import { evaluateSeoLength } from '../../helpers/seoValidation';
import TempleBrowser from './TempleBrowser';
import './TempleAddModal.css';

const TempleAddModal = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { open, targetPath } = useSelector((state) => state.templeModal || {});

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  // Reset form state whenever the modal opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setTitle('');
      setDescription('');
      setIsCreating(false);
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const titleSeo = evaluateSeoLength(title, 'title');
  const descSeo = evaluateSeoLength(description, 'description');
  const canProceed = titleSeo.isValid && descSeo.isValid;

  const handleClose = () => {
    if (!isCreating) {
      dispatch(closeTempleModal());
    }
  };

  const handleSelectTemple = async (templeItem) => {
    setIsCreating(true);
    setError(null);
    try {
      const newPageUrl = await createPageFromTemple(dispatch, {
        targetPath,
        title,
        description,
        sourceTemplePath: templeItem['@id'],
      });
      dispatch(closeTempleModal());
      history.push(`${newPageUrl}/edit`);
    } catch (err) {
      setError(
        err?.message ||
          'Failed to create page from template. Please try again.',
      );
      setIsCreating(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="large"
      className="temple-add-modal"
    >
      <Modal.Header>Create Page from Template</Modal.Header>

      <Modal.Content scrolling>
        <Step.Group fluid size="small" className="temple-modal-steps">
          <Step active={step === 1} completed={step > 1}>
            <Step.Content>
              <Step.Title>1. Metadata &amp; SEO</Step.Title>
              <Step.Description>Enter title and description</Step.Description>
            </Step.Content>
          </Step>
          <Step active={step === 2}>
            <Step.Content>
              <Step.Title>2. Choose Template</Step.Title>
              <Step.Description>
                Select a template from /templates
              </Step.Description>
            </Step.Content>
          </Step>
        </Step.Group>

        {error && (
          <Message negative>
            <Message.Header>Error</Message.Header>
            <p>{error}</p>
          </Message>
        )}

        {step === 1 && (
          <Form>
            <Form.Field required>
              <label htmlFor="temple-page-title">Title</label>
              <input
                id="temple-page-title"
                type="text"
                placeholder="Enter page title (20–50 characters optimal)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Progress
                percent={titleSeo.percent}
                color={titleSeo.color}
                size="tiny"
                className="seo-progress-bar"
              />
              <small className={`seo-helper-text seo-${titleSeo.status}`}>
                {titleSeo.message}
              </small>
            </Form.Field>

            <Form.Field required>
              <label htmlFor="temple-page-description">Description</label>
              <textarea
                id="temple-page-description"
                rows={3}
                placeholder="Enter meta description (120–160 characters optimal)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Progress
                percent={descSeo.percent}
                color={descSeo.color}
                size="tiny"
                className="seo-progress-bar"
              />
              <small className={`seo-helper-text seo-${descSeo.status}`}>
                {descSeo.message}
              </small>
            </Form.Field>
          </Form>
        )}

        {step === 2 && (
          <div className="temple-browser-container">
            {isCreating && (
              <Dimmer active inverted>
                <Loader>Creating page and cloning blocks…</Loader>
              </Dimmer>
            )}
            <TempleBrowser
              onSelectTemple={handleSelectTemple}
              isCreating={isCreating}
            />
          </div>
        )}
      </Modal.Content>

      <Modal.Actions className="temple-modal-actions">
        {step === 2 && (
          <button
            type="button"
            className="temple-circle-btn temple-circle-btn-secondary"
            aria-label="Back to metadata"
            title="Back"
            disabled={isCreating}
            onClick={() => setStep(1)}
          >
            <Icon name={backSVG} size="24px" />
          </button>
        )}

        {step === 1 && (
          <button
            type="button"
            className="temple-circle-btn temple-circle-btn-primary"
            aria-label="Next: Choose Template"
            title="Next: Choose Template"
            disabled={!canProceed}
            onClick={() => setStep(2)}
          >
            <Icon name={aheadSVG} size="24px" />
          </button>
        )}

        <button
          type="button"
          className="temple-circle-btn temple-circle-btn-cancel"
          aria-label="Cancel"
          title="Cancel"
          disabled={isCreating}
          onClick={handleClose}
        >
          <Icon name={clearSVG} size="24px" />
        </button>
      </Modal.Actions>
    </Modal>
  );
};

export default TempleAddModal;
