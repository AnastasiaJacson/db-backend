export const success = data => ({
    ok: true,
    error: null,
    data
});

export const fail = error => ({
    ok: false,
    error,
    data: null
});
