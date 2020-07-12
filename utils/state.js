class State {
    constructor(stateName,stubName) {
        this.stubNames = [];
        this.stateName = stateName;
        this.stubNames.push(stubName);
        this.presentState = 'init';
    }

    addStub(stubName) {
        this.stubNames.push(stubName);
    }
}