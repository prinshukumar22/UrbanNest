export const errorHandler = (statusCode, msg) => {
  const err = new Error(msg);
  err.statusCode = statusCode;
  return err;
};
