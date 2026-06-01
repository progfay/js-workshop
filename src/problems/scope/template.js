let result;

const a = 1;
const b = 2;
const c = 3;

(function firstFunction() {
  const b = 5;
  const c = 6;

  (function secondFunction() {
    const b = 8;
    // ここに 1 行追加して、result に "a: 1, b: 8, c: 6" を代入してください

    (function thirdFunction() {
      const a = 7;
      const c = 9;

      (function fourthFunction() {
        const a = 1;
        const c = 8;
      })();
    })();
  })();
})();