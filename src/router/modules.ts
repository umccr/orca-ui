import * as Runs from '@/modules/runs';
import * as Lab from '@/modules/lab/routes';
import * as Files from '@/modules/files/routes';

const modulesRouters = [Lab.Router, Runs.Router, Files.Router];

export default modulesRouters;
