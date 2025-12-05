import * as Runs from '@/modules/runs';
import * as Lab from '@/modules/lab/routes';
import * as Files from '@/modules/files/routes';
import * as SSCheck from '@/modules/sscheck/routes';
import * as Warehouse from '@/modules/orcavault/routes';
import * as Case from '@/modules/case/routes';

const modulesRouters = [
  Lab.Router,
  Runs.Router,
  Files.Router,
  SSCheck.Router,
  Warehouse.Router,
  Case.Router,
];

export default modulesRouters;
