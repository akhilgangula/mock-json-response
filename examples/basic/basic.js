const dir1 = __dirname + '/functions';
const dir2 = __dirname + '/data';
console.log(dir1, dir2);

require('../../index')(dir1, dir2)