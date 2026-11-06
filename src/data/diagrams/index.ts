import type { Diagram } from '../../lib/topology';
import { siteDiagram } from '../../lib/site-diagram';
import landingzone from './landingzone.json';
import oidc from './oidc.json';
import ccm from './ccm.json';

export const diagrams: Record<string, Diagram> = {
  landingzone: landingzone as Diagram,
  oidc: oidc as Diagram,
  ccm: ccm as Diagram,
  site: siteDiagram,
};
