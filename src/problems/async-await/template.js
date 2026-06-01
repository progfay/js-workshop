// 各ユーザーの投稿を非同期に返す関数。変更しないでください。
function getPosts(user) {
  return new Promise((resolve) => {
    setTimeout(() => resolve([`${user}: post1`, `${user}: post2`]), 1000);
  });
}

// 各ユーザーの投稿を順番に取得して 1 つの配列にまとめて返す async 関数 getAllPosts を実装してください。
async function getAllPosts(users) {
  // ここに実装してください
}