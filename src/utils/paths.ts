// The same source works on an account site or under a Pages repository path.
export function localPath(path = '') {
  const root = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return root + '/' + path.replace(/^\/+/, '');
}
