import TempleAddModal from './components/TempleAddModal/TempleAddModal';
import templeModal from './reducers/templeModal';

const applyConfig = (config) => {
  // Register reducer to track modal open state & current folder path
  config.addonReducers.templeModal = templeModal;

  // Mount the modal globally so Toolbar popover closing does not unmount it
  config.settings.appExtras = [
    ...(config.settings.appExtras || []),
    {
      match: '',
      component: TempleAddModal,
    },
  ];

  return config;
};

export default applyConfig;
