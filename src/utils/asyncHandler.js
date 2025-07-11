const asyncHandler = (func) => async (req, res, next) => {
  try {
    const result = await func(req, res, next);
    return result;
  } catch (error) {
    const statusCode =
      typeof error.statusCode === "number" ? error.statusCode : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
export { asyncHandler };
