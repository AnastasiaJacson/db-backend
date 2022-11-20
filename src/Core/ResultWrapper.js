export const ResultSuccess = (data) => {
    return {
        success: true,
        error: null,
        data,
    };
}

export const ResultError = (code, message) => {
    return {
        success: false,
        data: null,
        error: {
            code,
            message,
        },
    };
}

export default {
    success: ResultSuccess,
    error: ResultError,
}