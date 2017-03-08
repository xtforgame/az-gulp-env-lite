import serve from './serve';
import build from './build';
import clean from './clean';
import watch from './watch';

var gulpModules = null;

function addTasks(gulpConfig){
  let children = gulpModules.children;
  Object.keys(children).map(key => children[key].addTasks && children[key].addTasks(gulpConfig));
}

gulpModules = {
  children: {
    serve,
    build,
    clean,
    watch,
  },
  addTasks,
};

export default gulpModules;
