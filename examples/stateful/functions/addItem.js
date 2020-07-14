module.exports = {
    logic: function ({ headers }, data) {
        // logic need not have any statements
    },
    request: {
        scenario: "shopping list",
        state: "init",
        targetState: "state_2",
        method: "POST",
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
            message: "Item Added"
        }
    },
};
