export const generateInviteCode = () => {
  const minLength = 7;
  const maxLength = 11;

  const length = Math.floor(
    Math.random() * (maxLength - minLength) + minLength
  );

  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};
