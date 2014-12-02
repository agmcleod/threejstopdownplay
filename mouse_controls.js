(function () {
  // list of standard pointer event type
  var pointerEventList = [
    "mousewheel",
    "pointermove",
    "pointerdown",
    "pointerup",
    "pointercancel",
    undefined,
    undefined
  ];

  // previous MS prefixed pointer event type
  var MSPointerEventList = [
    "mousewheel",
    "MSPointerMove",
    "MSPointerDown",
    "MSPointerUp",
    "MSPointerCancel",
    undefined,
    undefined
  ];

  // legacy mouse event type
  var mouseEventList = [
    "mousewheel",
    "mousemove",
    "mousedown",
    "mouseup",
    undefined,
    undefined,
    undefined
  ];

  // iOS style touch event type
  var touchEventList = [
    undefined,
    "touchmove",
    "touchstart",
    "touchend",
    "touchcancel",
    undefined,
    undefined
  ];

  var POINTER_MOVE = 1;
  var POINTER_DOWN = 2;
  var POINTER_UP = 3;
  var POINTER_CANCEL = 4;

  if (navigator.pointerEnabled) {
    activeEventList = pointerEventList;
  }
  else if (navigator.msPointerEnabled) { // check for backward compatibility with the 'MS' prefix
    activeEventList = MSPointerEventList;
  }
  else if (("createTouch" in document) || ("ontouchstart" in window) || (navigator.isCocoonJS) || navigator.maxTouchPoints > 0) {
    activeEventList = touchEventList;
  }
  else { // Regular Mouse events
    activeEventList = mouseEventList;
  }

  function MouseControls () {
    this.moveOrigin = { x: null, y: null };
    this.isDown = false;
    this.touches = [{x:0,y:0,down: false}, {x:0,y:0, down: false}];
  }

  MouseControls.prototype.bindTouch = function () {
    var _this = this;
    window.addEventListener(activeEventList[POINTER_DOWN], function (e) {
      e.preventDefault();
      _this.isDown = true;
      if (e.touches && e.touches[0].x < window.innerWidth / 2) {
        var x = e.touches[0].clientX;
        var y = e.touches[0].clientY;
        _this.moveOrigin.x = x;
        _this.moveOrigin.y = y;
      }

      if (e.touches) {
        if (_this.touches[0]) {
          _this.touches[0].down = true;
        }
        if (_this.touches[1]) {
          _this.touches[1].down = true;
        }
      }
    });

    window.addEventListener(activeEventList[POINTER_MOVE], function (e) {
      if (e.touches) {
        var t1 = e.touches[0];
        var t2 = e.touches[1];
        if (t2) {
          var leftTouch, rightTouch;
          if (t1.clientX < window.innerWidth / 2) {
            leftTouch = t1;
          }
          else {
            leftTouch = t2;
          }

          if (t2.clientX > window.innerWidth / 2) {
            rightTouch = t2;
          }
          else {
            rightTouch = t1;
          }

          _this.touches[0].x = leftTouch.clientX;
          _this.touches[0].y = leftTouch.clientY;
          _this.touches[1].x = rightTouch.clientX;
          _this.touches[1].y = rightTouch.clientY;
        }
        else {
          _this.touches[0].x = t1.clientX;
          _this.touches[0].y = t1.clientY;
        }
      }
      else {
        _this.touches[0].x = e.clientX;
        _this.touches[0].y = e.clientY;
      }
    });

    window.addEventListener(activeEventList[POINTER_UP], function (e) {
      e.preventDefault();
      if (!e.touches || !e.touches[0]) {
        _this.isDown = false;
        _this.touches[0].down = false;
        _this.touches[1].down = false;
      }

      if (e.touches) {
        if (!_this.touches[0]) {
          _this.touches[0].down = false;
        }
        if (!_this.touches[1]) {
          _this.touches[1].down = false;
        }
      }
    });
  }

  MouseControls.prototype.coordsAsVector = function (x, y, camera, target) {
    var vector = new THREE.Vector3();
    vector.set(
      ( x / window.innerWidth ) * 2 - 1,
      - ( y / window.innerHeight ) * 2 + 1,
      0.5
    );

    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = - camera.position.y / dir.y;
    return target.set(camera.position.x, camera.position.y, camera.position.z).add(dir.multiplyScalar(distance));
  }

  MouseControls.prototype.mouseDown = function () {
    return this.isDown;
  }

  window.MouseControls = MouseControls;
})();
