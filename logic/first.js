const logic = ({ headers }, data) => {
  data.value = headers["x-mock-feature"];
};
const route = {
  request: {
    method: "GET",
    urlPath: "/mock/test",
    headers: {
      "x-mock-feature": {
        matches: "lfp-view-cart-error.*",
      },
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
exports.logic = logic;
exports.route = route;
