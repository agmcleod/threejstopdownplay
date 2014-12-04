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
  }

  MouseControls.prototype.bindTouch = function () {
    var _this = this;
    window.addEventListener(activeEventList[POINTER_DOWN], function (e) {
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
    });

    window.addEventListener(activeEventList[POINTER_MOVE], function (e) {
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
    });

    window.addEventListener(activeEventList[POINTER_UP], function (e) {
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
