var Wave = (function () {
  function Wave(scene, enemyCount, cubeArray) {
    this.enemies = [];
    this.scene = scene;
    for (var i = 0; i < enemyCount; i++) {
      this.addEnemy(cubeArray);
    }
    this.max = enemyCount;
    this.setLabelText();
  }

  Wave.prototype.addEnemy = function (cubeArray) {
    var attempts = 0;

    var validCoords = false;

    var x, z;

    while (!validCoords) {
      var validCoords = true;

      x = GameScene.getRandomCoordinate();
      z = GameScene.getRandomCoordinate();

      for (var i = cubeArray.length - 1; i >= 0; i--) {
        var cube = cubeArray[i];
        var diff = (1 + cube.size * 0.2);
        if (Math.abs(x - cube.x) < diff || Math.abs(z - cube.z) < diff) {
          validCoords = false;
          break;
        }
      }

      attempts++;

      if (attempts > 300) {
        return;
      }
    }
    this.enemies.push(new Enemy(this.scene.scene, x, z));
  }

  Wave.prototype.getElement = function () {
    return document.getElementById("wavecounter");
  }

  Wave.prototype.removeAll = function () {
    for (var i = this.enemies.length - 1; i >= 0; i--) {
      var enemy = this.enemies[i];
      enemy.mesh.dispose();
    }

    var counter = this.getElement();
    document.body.removeChild(counter);

    this.enemies = [];
  }

  Wave.prototype.removeEnemy = function(enemy) {
    enemy.mesh.dispose()
    this.enemies.splice(this.enemies.indexOf(enemy), 1);
    this.setLabelText();
  }

  Wave.prototype.setLabelText = function () {
    var ele = this.getElement();
    var text = "Wave " + this.scene.waveCount + " - " + this.enemies.length + "/" + this.max;
    ele.innerText = text;
  }


  return Wave;
})();