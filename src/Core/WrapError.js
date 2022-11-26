export const inSuccess = (data) => {
    return {
        success: true,
        error: null,
        data,
    };
}

export const inError = (code, message, details=null) => {
    return {
        success: false,
        data: null,
        error: {
            code,
            message,
            details,
        },
    };
}

export default {
    inSuccess,
    inError,
}