/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';
var pTape = require('p-tape'), Promise = require('bluebird'),
  manif = require('../package.json'),
  pkgRelPath = require('absdir')(module, '..'),
  pkgImplPath = require.resolve(manif.name),
  unresolve = require('../');

function test(name, how) { return pTape('Legacy: ' + name, how); }


test('basic self-tests', function (t) {
  t.plan(1);
  t.equal(pkgRelPath(manif.main), pkgImplPath);
});


test('find unresolve', function (t) {
  t.plan(1);
  return Promise.try(function () {
    return unresolve(pkgImplPath);
  }).then(function (id) {
    t.equal(id, manif.name + '/' + manif.main);
  });
});
