/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var Promise = require('bluebird'),
  pathLib = require('path'),
  findUp = require('find-up'),
  promisedFs = require('nofs');


function unresolve(path, opt) {
  if (!opt) { opt = false; }
  var srcFile = opt.srcFile, target;
  if (srcFile) {
    srcFile = String(srcFile.filename
      || srcFile.url
      || srcFile).replace(/^file:\/+/, '/');
    path = pathLib.dirname(srcFile) + '/' + path;
  }
  target = { norm: pathLib.normalize(path) };
  return promisedFs.realpath(target.norm).then(function (abs) {
    target.abs = abs;
    return findUp('package.json', { cwd: target.abs });
  }).then(function (manifAbs) {
    target.manifAbs = manifAbs;
    target.pkgDir = pathLib.dirname(manifAbs);
    var sub = pathLib.relative(target.pkgDir, target.abs);
    target.pkgSub = sub;
    return promisedFs.readFile(manifAbs, 'UTF-8');
  }).then(function (manifData) {
    try {
      return JSON.parse(manifData);
    } catch (jsonErr) {
      throw new Error('Failed to JSON.parse ' + target.manifAbs + ': '
        + String(jsonErr.message || jsonErr));
    }
  }).then(function (manifData) {
    var pkgName = manifData.name, main, sub = target.pkgSub;
    if (!pkgName) { throw new Error('No package name in ' + target.manifAbs); }
    main = String(manifData.main || 'index.js').replace(/^\.\//, '');
    if (opt.unmain) {
      if (sub === main) { sub = ''; }
      if (sub === (main + '.js')) { sub = ''; }
    }
    if (!sub) { return pkgName; }
    return pathLib.normalize(pkgName + '/' + sub);
  });
}















module.exports = unresolve;
