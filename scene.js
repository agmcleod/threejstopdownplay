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
    container.appendChild(renderer.domElement);

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
          _this.playerLight.position.x -= 0.2;
          _this.camera.position.x -= 0.2;
          moved = true;
          break;
        case 65: // A
          e.preventDefault();
          _this.playerLight.position.z += 0.2;
          _this.camera.position.z += 0.2;
          moved = true;
          break;
        case 83: // S
          e.preventDefault();
          _this.playerLight.position.x += 0.2;
          _this.camera.position.x += 0.2;
          moved = true;
          break;
        case 68: // D
          e.preventDefault();
          _this.playerLight.position.z -= 0.2;
          _this.camera.position.z -= 0.2;
          moved = true;
          break;
        default:
          return true;
      }

      if (moved) {
        /* var lookAtPos = _this.playerLight.position.clone();
        lookAtPos.y = 0;
        _this.playerLight.target = _this.camera; */
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
    //this.scene.add( new THREE.AmbientLight( 0x444444 ) );
    var planeGeom = new THREE.PlaneGeometry(70, 70, 32);
    var planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.FrontSide });
    var plane = new THREE.Mesh(planeGeom, planeMaterial);
    plane.rotation.x = Math.PI * -0.5;
    plane.receiveShadow  = true;
    this.scene.add(plane);

    this.playerLight = new THREE.SpotLight(0xffffff);
    this.playerLight.castShadow = true;
    this.playerLight.shadowCameraVisible = true;
    this.camera.add(this.playerLight.target);
    this.playerLight.position.set(0, 1, 0);
    this.playerLight.position = this.camera.position;

    for (var i = 0; i < 40; i++) {
      this.addCube();
    }
  }

  Scene.prototype.render = function () {
    requestAnimationFrame(this.render.bind(this));
    this.camera.lookAt(this.playerLight.position);
    this.renderer.render(this.scene, this.camera);
  }

  return Scene;
})();