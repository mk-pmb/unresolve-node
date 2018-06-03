
<!--#echo json="package.json" key="name" underline="=" -->
unresolve
=========
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Guess an import identifier that might require.resolve() to the same file path
but starts with a package name.
<!--/#echo -->



API
---

This module exports one function:

### unresolve(path[, opt])

Expects `path` to be a traditional, mundane file system path of some file
inside a node module.
Returns a promise for a string that might be an import identifier that
starts with a package name and would `require.resolve()` to `path`.

`opt` is an optional options object that supports these keys:

* `srcFile`: If non-empty, `path` is expected to be a relative path
  and will be resolved relative to the parent directory of `opt.srcFile`.




Usage
-----

from [test/usage.js](test/usage.js):

<!--#include file="test/usage.js" outdent="  " code="javascript"
  start="  // #BEGIN# usage demo" stop="  // #ENDOF# usage demo" -->
<!--#verbatim lncnt="15" -->
```javascript
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
```
<!--/include-->



<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
