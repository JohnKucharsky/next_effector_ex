export const createOid = () => {
  return (
    ((new Date().getTime() / 1000) | 0).toString(16) +
    "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, () => ((Math.random() * 16) | 0).toString())
      .toLowerCase()
  );
};
