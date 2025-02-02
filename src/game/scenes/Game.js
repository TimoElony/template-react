import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{

    constructor ()
    {
        super('Game');
    }
   
    preload() {
        // already preloaded during Preload and Main Menu
        this.add.tileSprite(0, 300, 3000, 800, 'background');
        this.add.tileSprite(3000, 300, 3000, 800, 'background');
        this.add.tileSprite(6000, 300, 3000, 800, 'background');
        this.player = this.physics.add.image(200, 140, 'player');
        this.add.tileSprite(0, 300, 3000, 800, 'foreground').setAlpha(0.8);
        this.add.tileSprite(3000, 300, 3000, 800, 'foreground').setAlpha(0.8);
        this.add.tileSprite(6000, 300, 3000, 800, 'foreground').setAlpha(0.8);
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0xffffffff);
        

        this.cursors = this.input.keyboard.createCursorKeys();

       
        this.player.setDamping(true);
        this.player.setAngularDrag(0.1); //Pitch sensitivity
        this.player.setDrag(0.8);  //Drag of the Foil
        this.player.setMaxVelocity(500); //Top speed of the foil
        
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

    EventBus.emit('current-scene-ready', this);
    }

    pump() {
        if (this.player.body.rotation > Math.PI/18) {
            this.player.setVelocityX(Math.max(this.player.body.velocity.x * 1.01, 200));
            this.player.setVelocityY(Math.max(this.player.body.velocity.y * 1.01, 200));
        }
    }

    leanBackward() {
        this.player.setAngularVelocity(Math.max(this.player.body.angularVelocity - 3, -30));
    }

    leanForward() {
        this.player.setAngularVelocity(Math.min(this.player.body.angularVelocity + 3, 30));
    }

    hitSomething() {
        // Game Over
        this.player.setX(0);
        this.physics.pause();
        this.player.setTint(0xff0000); // Tint the sprite
        this.scene.restart(); // Restart the scene
    }

    update() {
        
        //leaning back and forth
        if (this.cursors.left.isDown) {
            this.leanBackward();
        }

        if (this.cursors.right.isDown) {
            this.leanForward();
        }

        //pumping
        if (this.cursors.space.isDown) {
            this.pump();
        }

        // once it hits the water, let it only move along plane of the foil, stall at low speeds and decelerate when hitting the water
        if (this.player.y  > 250) {
            this.player.body.velocity.rotate(Phaser.Math.DegToRad(this.player.body.rotation) - this.player.body.velocity.angle());
            if (this.player.y > 370) {
                this.player.setVelocity(60,0);
                this.player.setDrag(0.5);
                this.hitSomething();
            }
            if (this.player.body.velocity.x <= 55) {
                this.hitSomething();
            }
        }

    }



    changeScene() {
        this.scene.start('GameOver');
    }
}
