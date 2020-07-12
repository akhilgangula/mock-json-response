module.exports = {
    logic: function ({ headers }, data) {
        // logic need not have any statements
    },
    request: {
        scenario: "shopping list",
        state: "init",
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
        bodyFileName: "items_before_adding.json",
    },
};
