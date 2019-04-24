import { GulpConfig } from '../gulp-config';
declare function addTasks(gulpConfig: GulpConfig): void;
declare const gulpModules: {
    addTasks: typeof addTasks;
};
export default gulpModules;
