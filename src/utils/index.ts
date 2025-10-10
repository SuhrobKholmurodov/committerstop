export function generateToken() {
  return `committerstop-tj-verify-${Math.random().toString(36).slice(2, 10)}`;
}
