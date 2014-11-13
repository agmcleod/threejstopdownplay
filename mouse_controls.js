function MouseControls () {
  this.screenCoords = { x: null, y: null };
  this.isDown = false;
}

MouseControls.prototype.bindTouch = function () {
  var _this = this;
  window.addEventListener("mousedown", function (e) {
    e.preventDefault();
    _this.isDown = true;
  });

  window.addEventListener("mousemove", function (e) {
    _this.screenCoords.x = e.clientX;
    _this.screenCoords.y = e.clientY;
  });

  window.addEventListener("mouseup", function (e) {
    e.preventDefault();
    _this.isDown = false;
  });
}

MouseControls.prototype.mouseDown = function () {
  return this.isDown;
}