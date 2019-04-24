export interface EnvConfig {
    postfix: string;
    env: any;
}
export interface GulpModule {
    addTasks: (gulpConfig: GulpConfig) => void;
}
export declare type GulpModuleMap = {
    [index: string]: GulpModule;
};
export declare class GulpConfig {
    config: any;
    parent: GulpConfig | null;
    name: string | null;
    paths: Array<string>;
    entry: any;
    constructor(config: any, parent?: GulpConfig | null, name?: string | null, paths?: Array<string>);
    getGulpPrefix(delimiter?: string): string;
    addPrefix(names: string | Array<string>, delimiter?: string | undefined): (string | Array<string>);
    getOptions(envName: string | Array<string>): string | null;
    getOptionsDev(envName?: string): string | null;
    getOptionsDist(envName?: string): string | null;
    getOptionsForDevDist(): [string | null, string | null];
    getOutputEnv(envName: string | Array<string>): GulpConfig | null;
    getOutputDevEnv(): GulpConfig | null;
    getOutputDistEnv(): GulpConfig | null;
    getEnvConfigsForDevDist(): [EnvConfig, EnvConfig];
    getSubmodule(submoduleName: string): GulpConfig | null;
    joinPathByKeys(_keys: Array<string>, ...otherDirs: Array<any>): string | null;
    coalesce(...args: Array<any>): any;
    get(...args: Array<any>): any;
}
