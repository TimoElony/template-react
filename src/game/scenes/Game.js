import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload() {
        //this.load.image('player', '/assets/foilboard.png'); // should already be loaded
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x000000);

        this.add.image(512, 384, 'background').setAlpha(0.8);
        this.player = this.physics.add.image(200, 240, 'player');
        this.player.setDamping(true);
        this.player.setDrag(0.99);
        this.player.setMaxVelocity(200);

        this.input.keyboard.on('keydown-SPACE', this.pump, this);
    

    EventBus.emit('current-scene-ready', this);
    }

    pump() {
        this.player.setVelocityY(-200); // Move upwards
    }

    hitSomething() {
        // Game Over
        this.physics.pause();
        this.player.setTint(0xff0000); // Tint the sprite
        this.scene.restart(); // Restart the scene
    }

    update() {
        // Keep bird within screen bounds
        if (this.player.y < 0) {
            this.player.setY(0);
        }
        if (this.player.y > 480) {
            this.player.setY(480); // Game Over if the bird goes out of bounds
            this.hitSomething();
        }
    }



    changeScene() {
        this.scene.start('GameOver');
    }
}
