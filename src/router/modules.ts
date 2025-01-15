import * as Runs from '@/modules/runs';
import * as Lab from '@/modules/lab/routes';
import * as Files from '@/modules/files/routes';
import * as SSCheck from '@/modules/sscheck/routes';

const modulesRouters = [Lab.Router, Runs.Router, Files.Router, SSCheck.Router];

export default modulesRouters;
