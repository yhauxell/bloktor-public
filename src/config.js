import _ from 'lodash';

export default class Config {
  static getFirebaseEnvVars() {
    return this.parseEnvVars('VUE_APP_FIREBASE_');
  }

  static parseEnvVars(value) {
    const env = Object.keys(process.env);
    const result = {};
    env.forEach((varr) => {
      const index = varr.indexOf(value);
      if (index == 0) {
        let named = varr.substr(17);
        named = _.camelCase(named);
        result[named] = process.env[varr];
      }
    });
    return result;
  }
}
