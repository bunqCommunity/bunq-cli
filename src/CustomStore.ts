import * as fs from "fs";

const prettify = input => {
    return JSON.stringify(input, null, "\t");
};

function Store(path) {
    this.path = path;
    try {
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, prettify({}));
        }
        this.Store = require(path);
    } catch (ex) {
        throw ex;
    }
}

Store.prototype.get = function(key) {
    if (!key) return clone(this.Store);
    return clone(this.Store[key]);
};

Store.prototype.set = function(key, value) {
    this.Store[key] = clone(value);
    this.save();
};

Store.prototype.del = function(key) {
    delete this.Store[key];
    this.save();
};

Store.prototype.save = function() {
    fs.writeFileSync(this.path, prettify(this.Store));
};

const clone = data => {
    if (data === undefined) return undefined;
    return JSON.parse(JSON.stringify(data));
};

export default (fileLocation: false | string = false) => {
    if (!fileLocation) {
        const store = {};
        return {
            get: key => store[key],
            set: (key, value) => (store[key] = value),
            remove: key => delete store[key]
        };
    }

    const store = new Store(fileLocation);
    return {
        get: key => store.get(key),
        set: (key, value) => store.set(key, value),
        remove: key => store.set(key, null)
    };
};
