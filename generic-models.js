const success = data => ({
    ok: true,
    error: null,
    data
});

const fail = error => ({
    ok: false,
    error,
    data: null
});

exports.success = success;
exports.fail = fail;
