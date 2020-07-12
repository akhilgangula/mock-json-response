module.exports = {
    logic: function ({ headers }, data) {
        data.value = headers["x-mock-feature"];
    },
    request: {
        method: "GET",
        urlPath: "/mock/test",
        headers: {
            "x-mock-feature": {
                equalTo: "lfp-view-cart-error-01-CRT-4042",
            },
            "x-purchase-version": {
                equalTo: "lfp"
            }
        },
    },
    response: {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
        inlineData: {
            test: 'inline data'
        },
        bodyFileName: "first.json",
    },
};
