var __extends = this.__extends || function (d, b) {
  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  function __() { this.constructor = d; }
  __.prototype = b.prototype;
  d.prototype = new __();
};
(function (BABYLON) {
  var TopDownCamera = (function (_super) {
    __extends(TopDownCamera, _super);
    function TopDownCamera(name, position, scene) {
      _super.call(this, name, position, scene);
      this.radius = 12;
      this.rotationOffset = 0;
      this.heightOffset = 0;
      this.cameraAcceleration = 0.05;
      this.maxCameraSpeed = 20;
    }
    TopDownCamera.prototype.getRadians = function (degrees) {
      return degrees * Math.PI / 180;
    };

    TopDownCamera.prototype.follow = function (cameraTarget) {
      if (!cameraTarget)
        return;
      this.position.x = cameraTarget.position.x;
      this.position.z = cameraTarget.position.z;
      this.rotation.z = -(Math.PI / 4);
    };

    TopDownCamera.prototype._update = function () {
      _super.prototype._update.call(this);
      this.follow(this.target);
    };
    return TopDownCamera;
  })(BABYLON.TargetCamera);
  BABYLON.TopDownCamera = TopDownCamera;
})(BABYLON || (BABYLON = {}));