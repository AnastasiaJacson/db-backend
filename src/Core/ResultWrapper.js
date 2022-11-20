const ResultSuccess = (data) => {
    return {
        success: true,
        error: null,
        data,
    };
}

const ResultError = (code, message) => {
    return {
        success: true,
        data: null,
        error: {
            code,
            message,
        },
    };
}

module.exports = {
    ResultSuccess,
    ResultError,
    ResultWrapper: {
        success: ResultSuccess,
        error: ResultError,
    }
}