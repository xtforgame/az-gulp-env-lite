import path from 'path';
import objPath from 'object-path';

export interface EnvConfig {
  postfix: string;
  env: any;
}

export interface GulpModule {
  addTasks: (gulpConfig : GulpConfig) => void;
}

export type GulpModuleMap = { [index:string] : GulpModule };

export class GulpConfig {
  config: any;
  parent: GulpConfig | null;
  name: string | null;
  paths: Array<string>;
  entry: any;

  constructor(config: any, parent: GulpConfig | null = null, name: string | null = null, paths: Array<string> = []){
    this.config = config;
    this.parent = parent;
    this.name = name;
    this.paths = paths;
    this.entry = objPath.get(this.config, this.paths);
  }

  getGulpPrefix(delimiter: string = ':'){
    if(!this.parent){
      let prefix = this.get(['prefix'], null);
      if(prefix){
        return prefix + delimiter;
      }
      return '';
    }
    return this.get(['prefix'], this.name) + delimiter;
  }

  addPrefix(names: string | Array<string>, delimiter: string | undefined = ':') : (string | Array<string>) {
    if(Array.isArray(names)){
      return names.map(name => <string>this.addPrefix(name, delimiter));
    }
    return this.getGulpPrefix(delimiter) + names;
  }

  getOptions(envName: string | Array<string>) : string | null{
    if(Array.isArray(envName)){
      for(let i = 0; i < envName.length; i++) {
        let result : string | null = this.getOptions(envName[i]);
        if(result){
          return result;
        }
      }
      return null;
    }
    return this.get(['options', envName], null);
  }

  getOptionsDev(envName?: string){
    return this.getOptions(['dev', 'default']);
  }

  getOptionsDist(envName?: string){
    return this.getOptions(['dist', 'default']);
  }

  getOptionsForDevDist() : [string | null, string | null]{
    let optionsDev = this.getOptionsDev();
    let optionsDist = this.getOptionsDist();

    return [
      optionsDev,
      optionsDist,
    ];
  }

  getOutputEnv(envName: string | Array<string>) : GulpConfig | null {
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

  getEnvConfigsForDevDist() : [EnvConfig, EnvConfig]{
    let outputDevEnv = this.getOutputDevEnv();
    let outputDistEnv = this.getOutputDistEnv();

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

  getSubmodule(submoduleName : string){
    let submoduleData = this.get(['submodules', submoduleName], null);
    if(submoduleData){
      let paths = this.paths.concat(['submodules', submoduleName]);
      return new GulpConfig(this.config, this, submoduleName, paths);
    }
    return null;
  }

  joinPathByKeys(_keys : Array<string>, ...otherDirs : Array<any>){
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

  coalesce(...args : Array<any>) : any {
    return objPath.coalesce(this.entry, ...args);
  }

  get(...args : Array<any>) : any {
    return objPath.get(this.entry, ...args);
  }
}
