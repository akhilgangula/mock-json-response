module.exports = {
    logic: function ({ headers }, { data }) {
        // logic need not have any statements
    },
    request: {
        method: "GET",
        urlPath: "/mock/list",
        headers: {
            "x-route": {
                equalTo: "items-list",
            }
        },
    },
    response: {
        status: 200,
        inlineData: {
            message: "Request matched from equal helper"
        }
    },
};
