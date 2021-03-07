
class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMain" });
    }
    
    preload() {
        //this.load.spritesheet("sprWater", "content/water.png", {frameWidth: 16, frameHeight: 16});
        this.load.image("sprWater", "content/water.png");
        this.load.image("sprDirt", "content/dirt.png");
        this.load.image("sprGrass", "content/grass.png");
        this.load.image("sprStone", "content/stone.png");
        this.load.image("sprMushroom", "content/mushroom.png");
        this.load.image("sprMushroom2", "content/mushroom2.png");
        this.load.image("sprTree", "content/tree.png", {frameWidth: 32, frameHeight: 32});
    }
    
    create() {
        this.chunkSize = 16;
        this.tileSize = 32;
        this.cameraSpeed = 3;

        this.cameras.main.setZoom(2);

        this.followPoint = new Phaser.Math.Vector2(
            this.cameras.main.worldView.x + (this.cameras.main.worldView.width * 0.5),
            this.cameras.main.worldView.y + (this.cameras.main.worldView.height * 0.5)
        );

        this.chunks = [];

        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }
    
    getChunk(x, y) {
        var chunk = null;

        for (var i = 0; i < this.chunks.length; i++) {
            if (this.chunks[i].x == x && this.chunks[i].y == y) {
                chunk = this.chunks[i];
            }
        }

        return chunk;
    }
    
    update() {

        // Get chunk number (pos)
        var snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.x / (this.chunkSize * this.tileSize));
        var snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.y / (this.chunkSize * this.tileSize));

        snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
        snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;

        // Create new chunks
        for (var x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
            for (var y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
                var existingChunk = this.getChunk(x, y);
        
                if (existingChunk == null) {
                    var newChunk = new Chunk(this, x, y);
                    this.chunks.push(newChunk);
                }
            }
        }

        // Load or unload chunks
        for (var i = 0; i < this.chunks.length; i++) {
            var chunk = this.chunks[i];
        
            if (Phaser.Math.Distance.Between(
                snappedChunkX,
                snappedChunkY,
                chunk.x,
                chunk.y
            ) < 3) {
                if (chunk !== null) {
                    chunk.load();
                }
            }
            else {
                if (chunk !== null) {
                    chunk.unload();
                }
            }
        }

        // Let the followpoint move (and the camera to follow it)
        if (this.keyW.isDown) {
            this.followPoint.y -= this.cameraSpeed;
        }
        if (this.keyS.isDown) {
            this.followPoint.y += this.cameraSpeed;
        }
        if (this.keyA.isDown) {
            this.followPoint.x -= this.cameraSpeed;
        }
        if (this.keyD.isDown) {
            this.followPoint.x += this.cameraSpeed;
        }

        this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
    }
}