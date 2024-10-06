export const storage = {
  set: function (name, value) {
    if (value !== undefined) {
      localStorage.setItem(name, JSON.stringify(value));
    }
  },
  get: function (name) {
    return JSON.parse(localStorage.getItem(name));
  },
  clear: function () {
    localStorage.clear();
  }
}
