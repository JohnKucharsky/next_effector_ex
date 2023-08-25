export function wait(timeout = Math.random() * 1500) {
  return new Promise((res) => setTimeout(res, timeout));
}
