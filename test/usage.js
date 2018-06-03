/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';
var unresolve = require('../'), Promise = require('bluebird'),
  test = require('p-tape'), assert = require('assert'),
  dirname = require('path').dirname;

test('readmde demo', function readmeDemo(t, q) {
  q = [];
  t.plan(1);
  function thenEqual(pr, ex) {
    var n, origStack = (new Error()).stack.split(/\n/).slice(2);
    function cmp(ac) { assert.strictEqual(ac, ex); }
    n = q.push(Promise.resolve(pr).then(cmp).then(null, function addStack(err) {
      if (err.code === 'ERR_ASSERTION') {
        err.stack = err.code + ': ' + err.message;
      }
      err.stack += ['',
        '---(original stack for thenEqual #' + n + ')---',
        ].concat(origStack).join('\n');
      throw err;
    }));
  }

  // #BEGIN# usage demo
  var self = require('../package.json').name, other = 'bluebird',
    othMain = require.resolve(other),
    othReadme = require.resolve(other + '/README.md'),
    othDir = dirname(othReadme) + '/',
    othSub = othMain.slice(othDir.length);

  thenEqual(unresolve(othMain),   other + '/' + othSub);
  thenEqual(unresolve(othReadme), other + '/README.md');
  thenEqual(unresolve(othDir),    other);

  thenEqual(unresolve(module.filename), self + '/test/usage.js');
  thenEqual(unresolve(dirname(module.filename)), self + '/test');
  thenEqual(unresolve('../', { srcFile: module.filename }), self);
  // #ENDOF# usage demo
  return Promise.all(q).then(function () { t.equal(q.length, 6); });
});
