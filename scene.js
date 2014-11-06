var Scene = (function () {
  function Scene () {
    var container = document.getElementById("screen");
    this.scene = new THREE.Scene();

    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    this.renderer = renderer;

    container.appendChild(renderer.domElement);

    this.bindEvents();

    this.addObjects();
    this.render();
  }

  Scene.prototype.addCube = function () {
    var size = Math.ceil(Math.random() * 3);
    var geo = new THREE.BoxGeometry(size, size, size);
    var mat = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
    var cube = new THREE.Mesh(geo, mat);
    cube.castShadow = true;

    cube.position.x = -35 + Math.round(Math.random() * 70);
    cube.position.z = - 35 + Math.round(Math.random() * 70);
    cube.position.y = 1;
    this.scene.add(cube);
  }

  Scene.prototype.addLighting = function () {
    this.cameraLight = new THREE.SpotLight(0xffffff);
    this.cameraLight.castShadow = true;
    this.cameraLight.position.set(0, 0, 0);
    this.spotlightTarget = new THREE.Object3D();
    this.spotlightTarget.position.set(0, 0, 0);
    this.cameraLight.target = this.spotlightTarget;
    this.camera.add(this.cameraLight);
    this.scene.add(this.spotlightTarget);
  };

  Scene.prototype.addObjects = function () {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    this.camera.position.set(0, 20, 0);
    this.scene.add(this.camera);

    this.scene.add( new THREE.AmbientLight( 0x000000 ) );
    var planeGeom = new THREE.PlaneGeometry(70, 70, 32);
    var planeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, side: THREE.FrontSide });
    var plane = new THREE.Mesh(planeGeom, planeMaterial);
    plane.rotation.x = Math.PI * -0.5;
    plane.receiveShadow  = true;
    this.scene.add(plane);
    this.camera.lookAt(this.scene.position);

    this.addLighting();

    var spotLightHelper = new THREE.SpotLightHelper(this.cameraLight, 50);
    this.scene.add(spotLightHelper);

    for (var i = 0; i < 40; i++) {
      this.addCube();
    }

    this.player = new Player(this.camera);
  }

  Scene.prototype.bindEvents = function () {
    var _this = this;
    window.addEventListener("resize", function () {
      _this.camera.aspect = window.innerWidth / window.innerHeight;
      _this.camera.updateProjectionMatrix();
      _this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    this.keyControls = new KeyControls();
    this.keyControls.bindKey("W");
    this.keyControls.bindKey("A");
    this.keyControls.bindKey("S");
    this.keyControls.bindKey("D");
  };

  Scene.prototype.render = function () {
    requestAnimationFrame(this.render.bind(this));
    
    var moved = false;
    if (this.keyControls.isPressed("W")) {
      this.camera.position.x -= 0.2;
      moved = true;
    }

    if (this.keyControls.isPressed("A")) {
      this.camera.position.z += 0.2;
      moved = true;
    }

    if (this.keyControls.isPressed("S")) {
      this.camera.position.x += 0.2;
      moved = true;
    }

    if (this.keyControls.isPressed("D")) {
      this.camera.position.z -= 0.2;
      moved = true;
    }

    if (moved) {
      var lookAtPos = this.camera.position.clone();
      lookAtPos.y = 0;
      this.camera.lookAt(lookAtPos);
      this.spotlightTarget.position.set(lookAtPos.x, lookAtPos.y, lookAtPos.z);
    }

    this.renderer.render(this.scene, this.camera);
  }

  return Scene;
})();