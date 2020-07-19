const State = require('./state')
class Store{
    constructor() {
        this.stubs={};
        this.functionDirectory = "";
        this.dataDirectory = "";
        this.scenarioMap = {};
        this.routes = {};
    }

    addStubs(name, stub) {
        //adding stubs in memory for easier access
        this.stubs[name] = stub;
    }
}

module.exports = new Store();
