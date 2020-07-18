module.exports = {
    logic: function ({ headers }, { data }) {
        // logic need not have any statements
    },
    request: {
        method: "GET",
        urlPath: ".*",
        headers: {
            "x-route": {
                equalTo: "items-list",
            }
        },
    },
    response: {
        status: 200,
        inlineData: {
            message: "Request matched from match helper"
        }
    },
};
