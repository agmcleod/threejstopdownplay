var GameScene = (function () {

  function getRandomCoordinate () {
    return  -30 + Math.round(Math.random() * 60);
  }

  function GameScene (engine, canvas) {
    this.canvas = canvas;
    this.scene = new BABYLON.Scene(engine);
    this.scene.collisionsEnabled = true;
    this.scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    this.engine = engine;

    this.enemies = [];
    this.lasers = [];
    this.walls = [];

    this.bindEvents();

    this.addObjects();
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
    var cube = new BABYLON.Mesh.CreateBox("box", size, this.scene);
    var material = new BABYLON.StandardMaterial("cubeMat", this.scene);
    material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    cube.material = material;
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
      cube.collisionsEnabled = true;
      attempts++;

      if (attempts > 10) {
        return;
      }
    }


    cube.position.y = size / 2;
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
    this.enemies.push(new Enemy(this.scene, x, z));
  };

  GameScene.prototype.addLaser = function (laser) {
    this.lasers.push(laser);
  }

  GameScene.prototype.addLighting = function () {
    this.cameraLight = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 5, 0), this.scene);
    this.cameraLight.diffuse = new BABYLON.Color3(1, 1, 1);
  }

  GameScene.prototype.addObjects = function () {
    this.camera = new BABYLON.TopDownCamera("FollowCam", new BABYLON.Vector3(0, 20, 0), this.scene);

    var plane = new BABYLON.Mesh.CreateGround("ground", 70, 70, 2, this.scene);
    plane.diffuseColor = new BABYLON.Color3(0, 0, 0);
    this.plane = plane;

    this.addLighting();
    var cubeTrackArray = [];
    this.cubes = [];
    for (var i = 0; i < 35; i++) {
      this.addCube(cubeTrackArray);
    }

    this.player = new Player(this.scene);
    this.camera.target = this.player.mesh;
    this.scene.activeCamera = this.camera;
    this.scene.activeCamera.attachControl(this.canvas);

    for (var i = 0; i < 20; i++) {
      this.addEnemy(cubeTrackArray);
    }
    this.addWalls();
  }

  GameScene.prototype.addWalls = function () {
    var wallOne = new BABYLON.Mesh("wallone", this.scene);
    CreateVariableBox(70, 5, 1).applyToMesh(wallOne);
    wallOne.position.copyFromFloats(1, 2.5, -35);
    wallOne.diffuseColor = new BABYLON.Color3(1, 1, 1);
    wallOne.collisionsEnabled = true;

    var wallTwo = new BABYLON.Mesh("walltwo", this.scene);
    CreateVariableBox(70, 5, 1).applyToMesh(wallTwo);
    wallTwo.position.copyFromFloats(1, 2.5, 35);
    wallTwo.diffuseColor = new BABYLON.Color3(1, 1, 1);
    wallTwo.collisionsEnabled = true;

    var wallThree = new BABYLON.Mesh("walltwo", this.scene);
    CreateVariableBox(1, 5, 70).applyToMesh(wallThree);
    wallThree.position.copyFromFloats(35, 2.5, 1);
    wallThree.diffuseColor = new BABYLON.Color3(1, 1, 1);
    wallThree.collisionsEnabled = true;

    var wallFour = new BABYLON.Mesh("walltwo", this.scene);
    CreateVariableBox(1, 5, 70).applyToMesh(wallFour);
    wallFour.position.copyFromFloats(-35, 2.5, 1);
    wallFour.diffuseColor = new BABYLON.Color3(1, 1, 1);
    wallFour.collisionsEnabled = true;

    this.walls.push(wallOne);
    this.walls.push(wallTwo);
    this.walls.push(wallThree);
    this.walls.push(wallFour);
  }

  GameScene.prototype.bindEvents = function () {
    window.addEventListener("resize", this.resizeEvent.bind(this), false);

    this.mouseControls = new MouseControls();
    this.mouseControls.bindTouch();

    this.keyControls = new KeyControls();
    this.keyControls.bindKey("SPACE");
  }

  GameScene.prototype.checkCollisions = function () {
    for (var l = this.lasers.length - 1; l >= 0; l--) {
      var laser = this.lasers[l];
      for (var i = this.walls.length - 1; i >= 0; i--) {
        var wall = this.walls[i];
        if (laser.mesh.intersectsMesh(wall, false)) {
          laser.mesh.dispose();
          this.lasers.splice(l, 1);
        }
      }

      for (var i = this.cubes.length - 1; i >= 0; i--) {
        var cube = this.cubes[i];
        if (laser.intersectsMesh(cube, false)) {
          laser.mesh.dispose();
          this.lasers.splice(l, 1);
        }
      }

      for (var i = this.enemies.length - 1; i >= 0; i--) {
        var enemy = this.enemies[i];
        if (laser.intersectsMesh(enemy.mesh, false)) {
          laser.mesh.dispose();
          this.lasers.splice(l, 1);
          enemy.mesh.dispose();
          this.enemies.splice(i, 1);
        }
      }
    }

    for (var i = this.enemies.length - 1; i >= 0; i--) {
      var enemy = this.enemies[i];
      for (var c = this.cubes.length - 1; c >= 0; c--) {
        var cube = this.cubes[c];
        if (cube.intersectsMesh(enemy.mesh, false)) {
          enemy.changeDirection();
        }
      }

      if (enemy.mesh.intersectsMesh(this.player.mesh, false)) {
        this.player.takeHit();
      }
    }
  }

  GameScene.prototype.dontRender = function () {
    this.dontRender = true;
  }

  GameScene.prototype.removeEnemy = function(enemy) {
    this.removeObject(enemy.mesh);
    this.enemies.splice(this.enemies.indexOf(enemy), 1);
  }

  GameScene.prototype.removeEvents = function () {
    this.mouseControls.unbind();
    this.keyControls.unbind();
    window.removeEventListener("resize", this.resizeEvent.bind(this));
  }

  GameScene.prototype.removeLaser = function(laserMesh) {
    this.removeObject(laserMesh);
  }

  GameScene.prototype.removeObject = function(obj) {
    this.scene.remove(obj);
  }

  GameScene.prototype.render = function (timestamp) {
    if (this.dontRender === true) {
      return false;
    }
    this.timestamp = timestamp;

    this.player.update();

    for (var i = this.enemies.length - 1; i >= 0; i--) {
      var enemy = this.enemies[i];
      enemy.update();
    }

    this.checkCollisions();
    this.scene.render();
  }

  GameScene.prototype.resizeEvent = function () {
    this.engine.resize();
    this.canvas.style.width = (window.innerWidth) + 'px';
    this.canvas.style.height = (window.innerHeight) + 'px';
  }

  GameScene.prototype.showEndScreen = function () {
    this.dontRender();
    var loss = new ImageScreen("retry");
    this.player.mesh.dispose();
    this.player = null;
    for (var i = this.cubes.length - 1; i >= 0; i--) {
      this.cubes[i].dispose();
    }

    this.cubes = [];

    for (var i = this.enemies.length - 1; i >= 0; i--) {
      this.enemies[i].mesh.dispose();
    }

    this.enemies = [];
    this.plane.dispose();
    this.camera.dispose();

    for (var i = this.walls.length - 1; i >= 0; i--) {
      this.walls[i].dispose();
    }

    loss.stageImage(function () {
      window.scene = new GameScene();
      requestAnimationFrame(scene.render.bind(scene));
    });
  }

  return GameScene;
})();