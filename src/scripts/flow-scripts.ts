import { selectedFlow } from '../scripts/stores';


export const goBack = () => selectedFlow.set(null);
