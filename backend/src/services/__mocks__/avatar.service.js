export const generateAvatar = jest.fn(async ({ name, model }) => {
  return `uploads/picture/${model}/avatar-${name}.png`;
});
