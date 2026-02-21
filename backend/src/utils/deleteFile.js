import fs from "fs";

export const deleteFileIfExists = (filePath) => {
  if (!filePath) return;

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(filePath, () => {});
    }
  });
};
