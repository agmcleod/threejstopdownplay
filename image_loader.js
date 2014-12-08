var ImageLoader = (function () {
  var images = {};
  function api (toLoad, callback) {
    this.callback = 0;

    var counter = 0;

    for (var i = toLoad.length - 1; i >= 0; i--) {
      var object = toLoad[i];

      var image = new Image();
      image.onload = function () {
        counter++;
        if (counter >= toLoad.length) {
          callback();
        }
      }
      image.src = object.src;
      images[object.name] = image;
    }
  }

  api.prototype.getImage = function (name) {
    return images[name];
  }

  return api;

})();