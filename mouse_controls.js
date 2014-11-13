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
    this.screenCoords = { x: null, y: null };
    this.isDown = false;
  }

  MouseControls.prototype.bindTouch = function () {
    var _this = this;
    window.addEventListener(activeEventList[POINTER_DOWN], function (e) {
      e.preventDefault();
      _this.isDown = true;
    });

    window.addEventListener(activeEventList[POINTER_MOVE], function (e) {
      if (e.touches) {
        var t = e.touches[0];
        _this.screenCoords.x = t.clientX;
        _this.screenCoords.y = t.clientY;
      }
      else {
        _this.screenCoords.x = e.clientX;
        _this.screenCoords.y = e.clientY;
      }
    });

    window.addEventListener(activeEventList[POINTER_UP], function (e) {
      e.preventDefault();
      _this.isDown = false;
    });
  }

  MouseControls.prototype.mouseDown = function () {
    return this.isDown;
  }

  window.MouseControls = MouseControls;
})();
