var ImageScreen = (function () {

  var api = function (imageName) {
    this.image = loader.getImage(imageName);
    this.originalWidth = this.image.width;
    this.originalHeight = this.image.height;

    this.x = 1074;
    this.y = 22;
    this.width = 173;
    this.height = 99;
  }

  api.prototype.imageCallback = function (e) {
    var widthRatio = this.image.width / this.originalWidth;
    var heightRatio = this.image.height / this.originalHeight;
    var x = e.clientX, y = e.clientY;
    var left = widthRatio * this.x, top = heightRatio * this.y;
    var right = this.width * widthRatio + left;
    var bottom = this.height * heightRatio + top;
    if (x >= left && x <= right && y >= top && y <= bottom) {
      this.removeSelf();
      this.callback();
    }
  }

  api.prototype.removeSelf = function () {
    this.image.removeEventListener('click', this.imageCallback.bind(this));
    window.removeEventListener("resize", this.resize.bind(this));
    this.image.parentNode.removeChild(this.image);
  }

  api.prototype.resize = function () {
    this.image.style.width = window.innerWidth + "px";
    this.image.style.height = window.innerHeight + "px";
  }

  api.prototype.stageImage = function (callback) {
    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();
    document.body.appendChild(this.image);
    this.callback = callback;
    this.image.addEventListener('click', this.imageCallback.bind(this));
  }

  return api;

})();