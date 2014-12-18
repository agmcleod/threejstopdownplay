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

  var _this;

  function resolveTouchesToIntent (touches, leftTouch, rightTouch) {
    var t1 = touches[0];
    var t2 = touches[1];
    if (t1 && t2) {
      if (t1.clientX < window.innerWidth / 2) {
        leftTouch = t1;
        rightTouch = t2;
      }
      else {
        leftTouch = t2;
        rightTouch = t1;
      }
    }
    else if (t1) {
      if (t1.clientX < window.innerWidth / 2) {
        leftTouch = t1;
        rightTouch = null;
      }
      else {
        leftTouch = null;
        rightTouch = t1;
      }
    }

    return {
      leftTouch: leftTouch,
      rightTouch: rightTouch
    };
  }

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
    this.touches = [{x:0,y:0,down: false}, {down: false}];
    _this = this;
  }

  function downEvent (e) {
    e.preventDefault();
    _this.isDown = true;
    if (e.touches) {
      var res = resolveTouchesToIntent(e.touches);
      if (res.leftTouch && e.touches.length === 1) {
        _this.moveOrigin.x = res.leftTouch.clientX;
        _this.moveOrigin.y = res.leftTouch.clientY;
        _this.touches[0].down = true;
      }

      if (res.rightTouch) {
        _this.touches[1].down = true;
      }
    }
  }

  function moveEvent (e) {
    if (e.touches) {
      var res = resolveTouchesToIntent(e.touches);
      if (res.leftTouch) {
        _this.touches[0].x = res.leftTouch.clientX;
        _this.touches[0].y = res.leftTouch.clientY;
      }
    }
    else {
      _this.touches[0].x = e.clientX;
      _this.touches[0].y = e.clientY;
    }
  }

  function upEvent (e) {
    e.preventDefault();
    if (!e.touches || e.touches.length === 0) {
      _this.isDown = false;
      _this.touches[0].down = false;
      _this.touches[1].down = false;
    }

    if (e.touches) {
      var leftTouch, rightTouch;
      var res = resolveTouchesToIntent(e.touches);
      if (!res.leftTouch) {
        _this.touches[0].down = false;
      }
      if (!res.rightTouch) {
        _this.touches[1].down = false;
      }
    }
  }

  MouseControls.prototype.bindTouch = function () {
    window.addEventListener(activeEventList[POINTER_DOWN], downEvent);
    window.addEventListener(activeEventList[POINTER_MOVE], moveEvent);
    window.addEventListener(activeEventList[POINTER_UP], upEvent);
  }

  MouseControls.prototype.coordsAsVector = function (x, y, camera, target) {
    var vector = new BABYLON.Vector3(x, y, 0.5);
    BABYLON.Vector3.Unproject(
      vector,
      window.innerWidth,
      window.innerHeight,
      BABYLON.Matrix.Identity(),
      window.scene.scene.getViewMatrix(),
      window.scene.camera.getProjectionMatrix()
    );
    var dir = vector.subtract(camera.position).normalize();
    var distance = - camera.position.y / dir.y;
    target.copyFromFloats(camera.position.x, camera.position.y, camera.position.z)
    return target.add(dir.multiplyByFloats(distance, distance, distance));;
  }

  MouseControls.prototype.mouseDown = function () {
    return this.isDown;
  }

  MouseControls.prototype.unbind = function () {
    window.removeEventListener(activeEventList[POINTER_DOWN], downEvent);
    window.removeEventListener(activeEventList[POINTER_MOVE], moveEvent);
    window.removeEventListener(activeEventList[POINTER_UP], upEvent);
  }

  window.MouseControls = MouseControls;
})();
