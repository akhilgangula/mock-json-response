class Header {
    constructor(header, logicalOp, value) {
        this.header = header;
        this.logicalOp = logicalOp;
        this.value = value;
    }
    match(matchTo) {
        switch (this.logicalOp) {
            case "equalTo":
                return this.value === matchTo;
            case "matches":
                return RegExp(this.value).test(matchTo);
                case "contains":
                    return this.value.includes(matchTo);
            default:
                console.log(this.logicalOp, 'is not defined');
                return false;
        }
    }
}

module.exports = Header
