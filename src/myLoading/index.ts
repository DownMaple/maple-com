import withInstall from '../utils/withInstall'
import myLoading from './myLoading.vue'
import {VMyLoading as vMyLoading} from './VMyLoading.ts';

const MyLoading = withInstall(myLoading)

export {vMyLoading}

export default MyLoading
