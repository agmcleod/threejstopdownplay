var GameScene = (function () {
  function GameScene () {
    var container = document.getElementById("screen");
    this.scene = new Physijs.Scene();

    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    this.renderer = renderer;

    container.appendChild(renderer.domElement);

    this.bindEvents();

    this.addObjects();
  }

  GameScene.prototype.addCube = function () {
    var size = Math.ceil(Math.random() * 3);
    var geo = new THREE.BoxGeometry(size, size, size);
    var mat = Physijs.createMaterial(
      new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff }),
      0.8,
      0
    );
    var cube = new Physijs.BoxMesh(geo, mat, 0);
    cube.castShadow = true;

    cube.position.x = -35 + Math.round(Math.random() * 70);
    cube.position.z = - 35 + Math.round(Math.random() * 70);
    cube.position.y = size / 2;
    this.scene.add(cube);
  }

  GameScene.prototype.addLighting = function () {
    this.cameraLight = new THREE.SpotLight(0xffffff);
    this.cameraLight.castShadow = true;
    this.cameraLight.position.set(0, 0, 0);
    this.spotlightTarget = new THREE.Object3D();
    this.spotlightTarget.position.set(0, 0, 0);
    this.cameraLight.target = this.spotlightTarget;
    this.camera.add(this.cameraLight);
    this.scene.add(this.spotlightTarget);
  };

  GameScene.prototype.addObjects = function () {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    this.camera.position.set(0, 20, 0);

    this.scene.add( new THREE.AmbientLight( 0x000000 ) );
    var planeGeom = new THREE.PlaneGeometry(70, 70, 32);
    var planeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, side: THREE.FrontSide });
    var plane = new Physijs.BoxMesh(planeGeom, planeMaterial, 0);
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

    this.player = new Player(this.scene);
    this.scene.add(this.camera);
  }

  GameScene.prototype.bindEvents = function () {
    var _this = this;
    window.addEventListener("resize", function () {
      _this.camera.aspect = window.innerWidth / window.innerHeight;
      _this.camera.updateProjectionMatrix();
      _this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    this.mouseControls = new MouseControls();
    this.mouseControls.bindTouch();
  };

  GameScene.prototype.render = function () {
    requestAnimationFrame(this.render.bind(this));

    this.player.update();

    var lookAtPos = this.player.mesh.position.clone();
    //this.camera.position.set(lookAtPos.x, this.camera.position.y, lookAtPos.z);
    lookAtPos.y = 0;
    //this.camera.lookAt(lookAtPos);
    this.spotlightTarget.position.set(lookAtPos.x, lookAtPos.y, lookAtPos.z);

    this.scene.simulate();

    this.renderer.render(this.scene, this.camera);
  }

  return GameScene;
})();