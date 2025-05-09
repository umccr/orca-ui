import * as Runs from '@/modules/runs';
import * as Lab from '@/modules/lab/routes';
import * as Files from '@/modules/files/routes';
import * as SSCheck from '@/modules/sscheck/routes';
import * as Warehouse from '@/modules/orcavault/routes';

const modulesRouters = [Lab.Router, Runs.Router, Files.Router, SSCheck.Router, Warehouse.Router];

export default modulesRouters;
