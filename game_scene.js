var GameScene = (function () {

  function getRandomCoordinate () {
    return  -30 + Math.round(Math.random() * 60);
  }

  function GameScene () {
    var container = document.getElementById("screen");
    this.scene = new Physijs.Scene();

    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    this.renderer = renderer;

    container.appendChild(renderer.domElement);

    this.lasers = [];

    this.bindEvents();

    this.addObjects();
    this.addWalls();
    var ua = window.navigator.userAgent;
    // iOS Device ?
    var iOS = ua.match(/iPhone|iPad|iPod/i) || false;
    // Android Device ?
    var android = ua.match(/Android/i) || false;
    var android2 = ua.match(/Android 2/i) || false;
    // Windows Device ?
    var wp = ua.match(/Windows Phone/i) || false;
    // Kindle device ?
    var BlackBerry = ua.match(/BlackBerry/i) || false;
    // Kindle device ?
    var Kindle = ua.match(/Kindle|Silk.*Mobile Safari/i) || false;
    this.isMobile = ua.match(/Mobi/i) ||
      iOS ||
      android ||
      wp ||
      BlackBerry ||
      Kindle ||
      iOS || false;
  }

  GameScene.prototype.addCube = function (cubeTrackArray) {
    var size = Math.ceil(Math.random() * 3);
    var geo = new THREE.BoxGeometry(size, size, size);
    var mat = Physijs.createMaterial(
      new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff }),
      0.8,
      0
    );
    var cube = new Physijs.BoxMesh(geo, mat, 0);
    cube.castShadow = true;

    var attempts = 0;

    var validCoords = false;

    while (!validCoords) {
      var validCoords = true;

      for (var i = cubeTrackArray.length - 1; i >= 0; i--) {
        var otherCube = cubeTrackArray[i];
        var diff = (size + otherCube.size * 0.2);
        if (Math.abs(cube.position.x - otherCube.x) < diff || Math.abs(cube.position.z - otherCube.z) < diff) {
          validCoords = false;
          break;
        }
      }

      cube.position.x = getRandomCoordinate();
      cube.position.z = getRandomCoordinate();
      attempts++;

      if (attempts > 10) {
        return;
      }
    }


    cube.position.y = size / 2;
    this.scene.add(cube);
    cubeTrackArray.push({ x: cube.position.x, z: cube.position.z, size: size });
  };

  GameScene.prototype.addEnemy = function (cubeTrackArray) {
    var attempts = 0;

    var validCoords = false;

    var x, z;

    while (!validCoords) {
      var validCoords = true;

      x = getRandomCoordinate();
      z = getRandomCoordinate();

      for (var i = cubeTrackArray.length - 1; i >= 0; i--) {
        var otherCube = cubeTrackArray[i];
        var diff = (1 + otherCube.size * 0.2);
        if (Math.abs(x - otherCube.x) < diff || Math.abs(z - otherCube.z) < diff) {
          validCoords = false;
          break;
        }
      }

      attempts++;

      if (attempts > 10) {
        return;
      }
    }
    new Enemy(this.scene, x, z);
  };

  GameScene.prototype.addLaser = function (laser) {
    this.scene.add(laser.mesh);
    laser.mesh.applyCentralImpulse(laser.impulseVector);
  };

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
    var cubeTrackArray = [];
    for (var i = 0; i < 35; i++) {
      this.addCube(cubeTrackArray);
    }

    this.player = new Player(this.scene);
    this.scene.add(this.camera);

    for (var i = 0; i < 20; i++) {
      this.addEnemy(cubeTrackArray);
    }
  }

  GameScene.prototype.addWalls = function () {
    var wallGeom = new THREE.BoxGeometry(70, 5, 1);
    var wallMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var wallOne = new Physijs.BoxMesh(wallGeom, wallMaterial, 0);

    wallOne.position.set(1, 2.5, -35);
    this.scene.add(wallOne);

    wallGeom = new THREE.BoxGeometry(70, 5, 1);
    wallMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var wallTwo = new Physijs.BoxMesh(wallGeom, wallMaterial, 0);

    wallTwo.position.set(1, 2.5, 35);
    this.scene.add(wallTwo);

    wallGeom = new THREE.BoxGeometry(1, 5, 70);
    wallMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var wallThree = new Physijs.BoxMesh(wallGeom, wallMaterial, 0);

    wallThree.position.set(35, 2.5, 1);
    this.scene.add(wallThree);

    wallGeom = new THREE.BoxGeometry(1, 5, 70);
    wallMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var wallFour = new Physijs.BoxMesh(wallGeom, wallMaterial, 0);

    wallFour.position.set(-35, 2.5, 1);
    this.scene.add(wallFour);
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

    this.keyControls = new KeyControls();
    this.keyControls.bindKey("SPACE");
  }

  GameScene.prototype.removeLaser = function(laserMesh) {
    this.removeObject(laserMesh);
    this.lasers.splice(this.lasers.indexOf(laserMesh), 1);
  }

  GameScene.prototype.removeObject = function(enemy) {
    this.scene.remove(enemy);
  }

  GameScene.prototype.render = function (timestamp) {
    requestAnimationFrame(this.render.bind(this));
    this.timestamp = timestamp;

    this.player.update();

    var lookAtPos = this.player.mesh.position.clone();
    this.camera.position.set(lookAtPos.x, this.camera.position.y, lookAtPos.z);
    this.camera.lookAt(lookAtPos);
    this.spotlightTarget.position.set(lookAtPos.x, lookAtPos.y, lookAtPos.z);

    this.scene.simulate();

    this.renderer.render(this.scene, this.camera);
  }

  return GameScene;
})();