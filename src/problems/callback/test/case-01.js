// callback が呼ばれる
{
  let called = false;
  await new Promise((resolve) => {
    delay(() => {
      called = true;
      resolve();
    });
  });
  if (!called) {
    throw new Error("delay に渡した callback が呼ばれていません");
  }
}