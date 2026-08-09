// Generate correct 20-char mercado rows
const plain = 'W' + 'd'.repeat(18) + 'W';
const stall1 = 'W' + 'dd' + 'MM' + 'dddd' + 'MM' + 'dddd' + 'MM' + 'dd' + 'W';
const exit_r = 'E' + 'p'.repeat(8) + 'd'.repeat(10) + 'W';
const stall2 = 'W' + 'dd' + 'MM' + 'dddd' + 'MM' + 'd'.repeat(8) + 'W';
const wall = 'W'.repeat(20);

console.log('wall:   len=' + wall.length + '  "' + wall + '"');
console.log('plain:  len=' + plain.length + '  "' + plain + '"');
console.log('stall1: len=' + stall1.length + '  "' + stall1 + '"');
console.log('exit:   len=' + exit_r.length + '  "' + exit_r + '"');
console.log('stall2: len=' + stall2.length + '  "' + stall2 + '"');

console.log('\n--- Correct mercado map ---');
const rows = [wall, plain, stall1, stall1, plain, plain, exit_r, plain, stall2, stall2, plain, plain, plain, plain, wall];
rows.forEach((r,i) => console.log('    "' + r + '",  // row ' + i + ' len=' + r.length));
