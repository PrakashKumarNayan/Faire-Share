const asyncHandler = (requestHandler) => async (req, res, next) => {
    try {
        return await requestHandler(req, res, next);
    } catch (error) {
        console.error("ASYNC HANDLER ERROR:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

export { asyncHandler };