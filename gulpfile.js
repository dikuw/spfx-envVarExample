'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const merge = require('webpack-merge');
const webpack = require('webpack');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

build.addSuppression(/Warning/gi);
build.initialize(require('gulp'));

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfig) => {
    // find the Define plugins
    let plugin, pluginDefine;
    for (var i = 0; i < generatedConfig.plugins.length; i++) {
      plugin = generatedConfig.plugins[i];
      if (plugin instanceof webpack.DefinePlugin) {
        pluginDefine = plugin;
      }
    }

    // determine if in debug / production build
    const isDebugMode = pluginDefine.definitions.DEBUG;

    // set azure appinsights string replacements
    pluginDefine.definitions.SPFX_ENVVAR = (isDebugMode)
      ? JSON.stringify('This is your new Task')
      : JSON.stringify('63YoMama-2e26-4Wrs-8Pnk-0fArmyBootsd');

    // return modified config => SPFx build pipeline
    return generatedConfig;
  }
});
