import pTape from 'p-tape';
import absdir from 'absdir';

import resolveAsyncPr from './resolve.wa-163';
import manif from '../package.json';
import unresolve from '../';

function test(name, how) { return pTape('ES6: ' + name, how); }

const selfUrl = import.meta.url;
const pkgRelPath = absdir(import.meta, '..');


test('basic self-tests', async (t) => {
  t.plan(1);
  t.equal('file://' + pkgRelPath('test/es6.mjs'), selfUrl);
});


test('find unresolve', async (t) => {
  t.plan(1);
  const pkgMainSpec = manif.name;
  const pkgMainPath = await resolveAsyncPr(pkgMainSpec);
  const id = await unresolve(pkgMainPath);
  t.equal(id, manif.name + '/' + manif.main);
});
