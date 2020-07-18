const dir1 = __dirname + '/functions';
const dir2 = __dirname + '/data';

require('../../index')(dir1, dir2)

//There will be always a conflict when you try to match request with headers/URL in regex
//Solution: try to match has specific as possible