const fs = require("fs");

function Store(path) {
    this.path = path;
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    this.Store = require(path);
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
    fs.writeFileSync(this.path, JSON.stringify(this.Store, null, "\t"));
};

function clone(data) {
    if (data === undefined) return undefined;
    return JSON.parse(JSON.stringify(data));
}

module.exports = (fileLocation = false) => {
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
