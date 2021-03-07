
class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMain" });
        this.player = undefined
    }
    
    preload() {
        this.load.image("sprWater", "content/water.png");
        this.load.image("sprDirt", "content/dirt.png");
        this.load.image("sprGrass", "content/grass.png");
        this.load.image("sprStone", "content/stone.png");
        this.load.image("sprMushroom", "content/mushroom.png");
        this.load.image("sprMushroom2", "content/mushroom2.png");
        this.load.image("sprTree", "content/tree.png", {frameWidth: 32, frameHeight: 64});
        this.load.image("sprMars", "content/mars.png");
        this.load.image("sprRestart", "content/restart.png");
        this.load.spritesheet('sprPlayerIdleDown', 'content/sprPlayerIdleDown.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('sprPlayerIdleLeft', 'content/sprPlayerIdleLeft.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('sprPlayerIdleRight', 'content/sprPlayerIdleRight.png', {frameWidth: 16, frameHeight: 16});
        this.load.image('sprPlayerIdleUp', 'content/sprPlayerIdleUp.png');
        this.load.spritesheet('sprPlayerWalkDown', 'content/sprPlayerWalkDown.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('sprPlayerWalkLeft', 'content/sprPlayerWalkLeft.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('sprPlayerWalkRight', 'content/sprPlayerWalkRight.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('sprPlayerWalkUp', 'content/sprPlayerWalkUp.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('sprBadWalkDown', 'content/sprBadWalkDown.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('sprBadWalkLeft', 'content/sprBadWalkLeft.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('sprBadWalkRight', 'content/sprBadWalkRight.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('sprBadWalkUp', 'content/sprBadWalkUp.png', {frameWidth: 16, frameHeight: 16});
    }
    
    create() {
        
        this.chunkSize = 16;
        this.tileSize = 32;
        this.cameraSpeed = 100;

        this.cameras.main.setZoom(2);

         this.spawnPoint = new Phaser.Math.Vector2(
            this.cameras.main.worldView.x + (this.cameras.main.worldView.width * 0.5),
            this.cameras.main.worldView.y + (this.cameras.main.worldView.height * 0.5)
        );

        this.chunks = [];

        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        

        this.anims.create({
            key: 'idleDown',
            frames: this.anims.generateFrameNumbers('sprPlayerIdleDown', { start: 0, end: 4 }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'idleLeft',
            frames: this.anims.generateFrameNumbers('sprPlayerIdleLeft', { start: 0, end: 4 }),
            frameRate: 4,
            repeat: -1
        });
        
        this.anims.create({
            key: 'idleRight',
            frames: this.anims.generateFrameNumbers('sprPlayerIdleRight', { start: 0, end: 4 }),
            frameRate: 4,
            repeat: -1
        });
        
        this.anims.create({
            key: 'walkDown',
            frames: this.anims.generateFrameNumbers('sprPlayerWalkDown', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'walkLeft',
            frames: this.anims.generateFrameNumbers('sprPlayerWalkLeft', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'walkRight',
            frames: this.anims.generateFrameNumbers('sprPlayerWalkRight', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'walkUp',
            frames: this.anims.generateFrameNumbers('sprPlayerWalkUp', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'badWalkDown',
            frames: this.anims.generateFrameNumbers('sprBadWalkDown', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'badWalkLeft',
            frames: this.anims.generateFrameNumbers('sprBadWalkLeft', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'badWalkRight',
            frames: this.anims.generateFrameNumbers('sprBadWalkRight', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'badWalkUp',
            frames: this.anims.generateFrameNumbers('sprBadWalkUp', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        this.player = new Player(this, this.spawnPoint.x, this.spawnPoint.y);
        this.player.play("idleDown");

        //this.baddies = this.physics.add.group();

        this.bar = new Bar(this, this.spawnPoint.x, this.spawnPoint.y + 40)
        this.physics.add.overlap(this.player, this.bar, this.win, null, this);
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

    updateChunks() {
        // Get chunk number (pos)
        var snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(this.player.x / (this.chunkSize * this.tileSize));
        var snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(this.player.y / (this.chunkSize * this.tileSize));

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
    }

    handleControls() {
        // Let the followpoint move (and the camera to follow it)
        if (this.keyW.isDown) {
            this.player.setVelocityY(-this.cameraSpeed);
            
            this.player.play("walkUp", true)

            if (this.keyA.isUp && this.keyD.isUp) {
                this.player.setVelocityX(0)
            }
        }
        if (this.keyS.isDown) {
            this.player.setVelocityY(this.cameraSpeed);
            
            this.player.play("walkDown", true)

            if (this.keyA.isUp && this.keyD.isUp) {
                this.player.setVelocityX(0)
            }
        }
        if (this.keyA.isDown) {
            this.player.setVelocityX(-this.cameraSpeed);

            if (this.keyW.isUp && this.keyS.isUp) {
                this.player.setVelocityY(0)
                this.player.play("walkLeft", true)
            }
        }
        if (this.keyD.isDown) {
            this.player.setVelocityX(this.cameraSpeed);

            if (this.keyW.isUp && this.keyS.isUp) {
                this.player.setVelocityY(0)
                this.player.play("walkRight", true)
            }
        }

        if (this.keyW.isUp && this.keyD.isUp && this.keyS.isUp && this.keyA.isUp) {
            this.setIdleAnim()

            this.player.setVelocity(0);
        }

        this.cameras.main.centerOn(this.player.x, this.player.y);
    }

    setIdleAnim() {
        if (this.player.anims.getName() === "walkUp") {
            this.player.setTexture("sprPlayerIdleUp")
        }
        else if (this.player.anims.getName() === "walkLeft") {
            this.player.play("idleLeft")
        }
        else if (this.player.anims.getName() === "walkRight") {
            this.player.play("idleRight")
        }
        else if (this.player.anims.getName() === "walkDown") {
            this.player.play("idleDown")
        }
    }

    update() {

        this.updateChunks()

        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.bar.x, this.bar.y)
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bar.x, this.bar.y)

        if (distance > 0.01 && distance < 200) {
            this.bar.setVelocityX(Math.cos(angle) * (3500 / distance))
            this.bar.setVelocityY(Math.sin(angle) * (3500 / distance))
        }
        else {
            this.bar.setVelocity(0)
        }
        


        this.handleControls()
    }

    win() {
        this.physics.pause()
        console.log(this.spawnPoint.x, this.spawnPoint.y)
        var text = this.add.text(this.player.x, this.player.y + 50, 'You Win!', { fontSize: '32px', fill: '#000' });
        text.setDepth(3);
        text.setOrigin(0.5)

        var button = this.add.sprite(this.player.x, this.player.y + 100, 'sprRestart').setInteractive();;
        button.setScale(0.25);
        button.setDepth(3);
        button.on('pointerup',  _ => {
            location.reload()
        });
    }
}