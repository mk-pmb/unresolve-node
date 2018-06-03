/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

// work-around for https://github.com/browserify/resolve/issues/163

var Promise = require('bluebird'),
  promiseFs = require('nofs'),
  resolveAsyncCb = require('resolve'),
  origResolvePr = Promise.promisify(resolveAsyncCb),
  testDir  = require('absdir')(module),
  opt = { basedir: testDir },
  homeDir = process.env.HOME;

if (homeDir) {
  opt.paths = (require.paths || []).concat([
    homeDir + '/.node_modules',
    homeDir + '/.node_libraries',
  ]);
}

function resolveAsyncPr(spec) {
  return origResolvePr(spec, opt).then(promiseFs.realpath);
}

module.exports = resolveAsyncPr;
