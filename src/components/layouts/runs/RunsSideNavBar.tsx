import { ModuleNavbar } from '@/components/navigation/navbar';
import { runsModuleNavigation } from '@/utils/navigation';

const RunsSideNavBar = () => {
  return (
    <ModuleNavbar navigation={runsModuleNavigation} preferenceStorageKey='runs-module-navbar' />
  );
};

export default RunsSideNavBar;
