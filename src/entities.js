class Chunk {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.obstacles = this.scene.physics.add.staticGroup();
        this.scene.physics.add.collider(this.obstacles, this.scene.player)
        this.tiles = this.scene.add.group();
        this.isLoaded = false;
        this.obstacleCoords = Array.from(Array(20).keys()).map(_ => {
            return [
                Math.round(Math.random() * this.scene.chunkSize), 
                Math.round(Math.random() * this.scene.chunkSize)
            ];
        });
        //const baddie = new Baddie(this.scene, x, y);
        //baddie.play("badWalkUp");
        //this.scene.baddies.add(baddie);
    }

    unload() {
        if (this.isLoaded) {
            this.tiles.clear(true, true);
            this.obstacles.clear(true, true);
    
            this.isLoaded = false;
        }
    }

    load() {
        if (!this.isLoaded) {
            for (var x = 0; x < this.scene.chunkSize; x++) {
                for (var y = 0; y < this.scene.chunkSize; y++) {
                    
                    const tileX = (this.x * (this.scene.chunkSize * this.scene.tileSize)) + (x * this.scene.tileSize);
                    const tileY = (this.y * (this.scene.chunkSize * this.scene.tileSize)) + (y * this.scene.tileSize);
                    const perlinValue = noise.perlin2(tileX / 500, tileY / 500); // wth?
                    const obstacleKey = this.getObstacleKey(x, y, tileX, tileY);
                    const tile = this.createTile(perlinValue, tileX, tileY);

                    this.tiles.add(tile);

                    if (obstacleKey && tile.texture.key === "sprGrass") {
                        this.obstacles.add(new Obstacle(this.scene, tileX, tileY, obstacleKey));
                    } 
                }
            }

            this.isLoaded = true;
        }
    }

    getObstacleKey(x, y) {
        var key = undefined;
        const included = this.obstacleCoords.filter(e => {
            return e[0] === x && e[1] === y;
        });

        if (included.length >= 1) {
            const prob = (x + y) + 10
            if (prob % 6 === 0) {
                key = "sprStone"
            }
            else if (prob % 8 === 0) {
                key = "sprMushroom"
            }
            else if (prob % 7 === 0) {
                key = "sprMushroom2"
            }
            else {
                key = "sprTree";
            }
        }

        return key
    }

    createTile(perlinValue, tileX, tileY) {
        var key = "";
        var animationKey = "";

        if (perlinValue < 0.2) {
            key = "sprGrass";
            //animationKey = "sprWater";
        }
        else if (perlinValue >= 0.2 && perlinValue < 0.3) {
            key = "sprDirt";
        }
        else if (perlinValue >= 0.3) {
            key = "sprWater";
        }

        var tile = new Tile(this.scene, tileX, tileY, key);

        if (animationKey !== "") {
            tile.play(animationKey);
        }

        return tile
    }
}

class Tile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
        this.setOrigin(0);
    }
}

class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.tabIndex = 1
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setDepth(0.2);
        
        this.setOrigin(0);

        if (key === "sprTree") {
            this.setDepth(1);
            this.setOrigin(0, 0.5);
            this.scene.physics.add.collider(this, this.scene.player)
            this.setImmovable(true)
            this.body.setSize(16, 32, true)
            this.body.setOffset(8, 24)
        }
        else if (key === "sprStone") {
            this.setDepth(1);
            this.scene.physics.add.collider(this, this.scene.player)
            this.setImmovable(true)
            this.body.setSize(16, 20, true)
        }
    }
}

class Bar extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "sprMars");
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setDepth(2);
    }
}

class Baddie extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "sprBadWalkUp");
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setDepth(1);
    }
}
