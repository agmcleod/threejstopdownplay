var Scene = (function () {
  function Scene () {
    var container = document.getElementById("screen");
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    this.camera.position.set(0, 20, 0);

    this.scene = new THREE.Scene();

    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    this.renderer = renderer;

    this.renderer.shadowCameraNear = 3;
    this.renderer.shadowCameraFar = this.camera.far;
    this.renderer.shadowCameraFov = 50;

    this.renderer.shadowMapBias = 0.0039;
    this.renderer.shadowMapDarkness = 0.5;
    this.renderer.shadowMapWidth = 1024;
    this.renderer.shadowMapHeight = 1024;

    container.appendChild(renderer.domElement);

    this.scene.add(this.camera);

    var _this = this;
    window.addEventListener("resize", function () {
      _this.camera.aspect = window.innerWidth / window.innerHeight;
      _this.camera.updateProjectionMatrix();
      _this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    window.addEventListener("keydown", function (e) {
      var moved = false;
      switch ( event.keyCode ) {
        case 87: // W
          e.preventDefault();
          _this.camera.position.x -= 0.2;
          moved = true;
          break;
        case 65: // A
          e.preventDefault();
          _this.camera.position.z += 0.2;
          moved = true;
          break;
        case 83: // S
          e.preventDefault();
          _this.camera.position.x += 0.2;
          moved = true;
          break;
        case 68: // D
          e.preventDefault();
          _this.camera.position.z -= 0.2;
          moved = true;
          break;
        default:
          return true;
      }

      if (moved) {
        var lookAtPos = _this.camera.position.clone();
        lookAtPos.y = 0;
        _this.camera.lookAt(lookAtPos);
        _this.playerLight.position.x = lookAtPos.x;
        _this.playerLight.position.z = lookAtPos.z;
        _this.spotlightTarget.position.set(lookAtPos.x, lookAtPos.y, lookAtPos.z);
      }
    }, false);

    this.addObjects();
    this.render();
  }

  Scene.prototype.addCube = function () {
    var size = Math.ceil(Math.random() * 3);
    var geo = new THREE.BoxGeometry(size, size, size);
    var mat = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    var cube = new THREE.Mesh(geo, mat);
    cube.castShadow = true;

    cube.position.x = -35 + Math.round(Math.random() * 70);
    cube.position.z = - 35 + Math.round(Math.random() * 70);
    cube.position.y = 1;
    this.scene.add(cube);
  }

  Scene.prototype.addObjects = function () {
    this.scene.add( new THREE.AmbientLight( 0x000000 ) );
    var planeGeom = new THREE.PlaneGeometry(70, 70, 32);
    var planeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, side: THREE.FrontSide });
    var plane = new THREE.Mesh(planeGeom, planeMaterial);
    plane.rotation.x = Math.PI * -0.5;
    plane.receiveShadow  = true;
    this.scene.add(plane);
    this.camera.lookAt(this.scene.position);

    this.playerLight = new THREE.SpotLight(0xffffff);
    this.playerLight.castShadow = true;
    this.playerLight.position.set(0, 40, 0);
    this.spotlightTarget = new THREE.Object3D();
    this.spotlightTarget.position.set(0, 0, 0);
    this.playerLight.target = this.spotlightTarget;
    this.playerLight.shadowCameraVisible = true;
    this.scene.add(this.playerLight);


    var spotLightHelper = new THREE.SpotLightHelper(this.playerLight, 50);
    this.scene.add(spotLightHelper);

    for (var i = 0; i < 40; i++) {
      this.addCube();
    }
  }

  Scene.prototype.render = function () {
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  return Scene;
})();