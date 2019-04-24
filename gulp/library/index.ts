import clean from './clean';
import build from './build';
import watch from './watch';
import { GulpConfig, GulpModuleMap } from '../gulp-config';

const children : GulpModuleMap = {
  clean,
  build,
  watch,
};

export default  {
  childList: [
    'clean',
    'build',
    'watch',
  ],
  children,
  addTasks(gulpConfig : GulpConfig){
    this.childList.map(key => this.children[key].addTasks && this.children[key].addTasks(gulpConfig));
  },
};
