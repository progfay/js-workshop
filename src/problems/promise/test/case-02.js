// それ以外は reject される
{
  let err;
  try {
    await getData("foo");
  } catch (e) {
    err = e;
  }
  if (!err) {
    throw new Error('getData("foo") は reject されるべきですが、解決してしまいました');
  }
  if (err.message !== "unknown key: foo") {
    throw new Error(`reject の message は "unknown key: foo" を期待しましたが ${JSON.stringify(err.message)} でした`);
  }
}