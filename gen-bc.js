const bc = require('bcrypt');
(async function () {
  const f = await bc.hash('l', 10);
  const s = await bc.hash('w', 10);
  console.log(f);
  console.log(s);
})();
