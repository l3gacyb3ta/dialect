function print(k) {
  console.log(k);
}

var print, dial_TOPLEVEL;

var dial_TMP;

print(function (dial_R1) {
  dial_TOPLEVEL(dial_R1);
}, "test");

print(function dial_CC(dial_R1) {
  GUARD(arguments, dial_CC);
  dial_TOPLEVEL(dial_R1);
}, "test");
