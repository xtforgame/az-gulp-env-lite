import path from 'path';
import objPath from 'object-path';

export class GulpConfig {
  constructor(config, parent = null, name = null, paths = []){
    this.config = config;
    this.parent = parent;
    this.name = name;
    this.paths = paths;
    this.entry = objPath.get(this.config, this.paths);
  }

  getGulpPrefix(delimiter = ':'){
    if(!this.parent){
      let prefix = this.get(['prefix'], null);
      if(prefix){
        return prefix + delimiter;
      }
      return '';
    }
    return this.get(['prefix'], this.name) + delimiter;
  }

  addPrefix(names, delimiter = ':'){
    if(Array.isArray(names)){
      return names.map(name => this.addPrefix(name, delimiter));
    }
    return this.getGulpPrefix(delimiter) + names;
  }

  getOutputEnv(envName){
    if(Array.isArray(envName)){
      for(let i = 0; i < envName.length; i++) {
        let result = this.getOutputEnv(envName[i]);
        if(result){
          return result;
        }
      }
      return null;
    }
    let envData = this.get(['output', envName], null);
    if(envData){
      let paths = this.paths.concat(['output', envName]);
      return new GulpConfig(this.config, this, envName, paths);
    }
    return null;
  }

  getOutputDevEnv(){
    return this.getOutputEnv(['dev', 'default']);
  }

  getOutputDistEnv(){
    return this.getOutputEnv(['dist', 'default']);
  }

  getEnvConfigsForDevDist(){
    let outputDistEnv = this.getOutputDistEnv();
    let outputDevEnv = this.getOutputDistEnv();

    return [
      {
        postfix: ':dev',
        env: outputDevEnv,
      },
      {
        postfix: '',
        env: outputDistEnv,
      },
    ];
  }

  getSubmodule(submoduleName){
    let submoduleData = this.get(['submodules', submoduleName], null);
    if(submoduleData){
      let paths = this.paths.concat(['submodules', submoduleName]);
      return new GulpConfig(this.config, this, submoduleName, paths);
    }
    return null;
  }

  joinPathByKeys(_keys, ...otherDirs){
    let keys = this.paths.concat(_keys);
    let result = '';
    let iterator = this.config;
    if(iterator.dir){
      result = path.join(result, iterator.dir);
    }
    for(let i = 0; i < keys.length; i++) {
      iterator = iterator[keys[i]];
      if(typeof iterator === 'string' && i === keys.length - 1){
        result = path.join(result, iterator);
      }else if(iterator){
        if(iterator.dir){
          result = path.join(result, iterator.dir);
        }
      }else{
        return null;
      }
    }
    return path.join(result, ...otherDirs).replace(/\\/g, '/');
  }

  coalesce(...args){
    return objPath.coalesce(this.entry, ...args);
  }

  get(...args){
    return objPath.get(this.entry, ...args);
  }
}
