import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{

    constructor ()
    {
        super('Game');
    }
   
    preload() {
        this.add.tileSprite(0, 300, 300000, 800, 'background');
        //this.add.tileSprite(30000, 300, 30000, 800, 'background');
        //this.add.tileSprite(60000, 300, 30000, 800, 'background');
        this.player = this.physics.add.image(100, 140, 'player');
        this.add.tileSprite(0, 300, 300000, 800, 'foreground').setAlpha(0.8);
        //this.add.tileSprite(30000, 300, 30000, 800, 'foreground').setAlpha(0.8);
        //this.add.tileSprite(60000, 300, 30000, 800, 'foreground').setAlpha(0.8);
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0xffffffff);
        

        this.cursors = this.input.keyboard.createCursorKeys();
        
        const selectedFoil = {   
            name: 'experimental foil',
            span: 1000,
            chordWidth: 100,
            surface: 1000,
            stabSurface: 200,
            fuselage: 600,
            stallSpeed: 200
        };
        // setting up physics
        this.player.setDamping(true);
        this.player.setAngularDrag(selectedFoil.chordWidth*0.001); //Pitch sensitivity depending on chordWidth
        //this.player.setAngularDrag(0.1); //Pitch sensitivity depending on chordWidth
        //this.player.setDrag(0.8);  //Drag of the Foil normed to beginner foil
        this.player.setDrag(0.94+(0.0099*345/selectedFoil.chordWidth));  //Drag of the Foil normed to axis fireball 880 69mm mean chord
        const maxVelocity = 100*2000/selectedFoil.surface*400/selectedFoil.chordWidth;
        this.player.setMaxVelocity(maxVelocity); //Top speed of the foil
        this.data.set('dragFactor', 5/maxVelocity); //sink ratio
        this.data.set('maxVelocity', maxVelocity);
        this.data.set('stallSpeed', 350*69/selectedFoil.chordWidth); // compared to fireball 880 mean chordwidth
        this.player.setAngularAcceleration(10);

        
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

    EventBus.emit('current-scene-ready', this);
    }

    pump() {
        if (this.player.body.rotation > Math.PI/18) {
            this.player.setVelocityX(this.data.get('maxVelocity')*0.4+this.player.body.velocity.x*0.1);
            this.player.setVelocityY(this.data.get('maxVelocity')*0.4+this.player.body.velocity.y*0.1);
        }
    }

    leanBackward() {
        this.player.setAngularVelocity(Math.max(this.player.body.angularVelocity - this.data.get('maxVelocity')/200, -40));
        this.player.setAngularAcceleration(40);
    }

    leanForward() {
        this.player.setAngularVelocity(Math.min(this.player.body.angularVelocity + this.data.get('maxVelocity')/200, 40));
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

        // once it hits the water, let it only move along plane of the foil, stall at low speeds and crash when hitting the water
        if (this.player.y  > 250) {
            this.player.body.velocity.rotate(Phaser.Math.DegToRad(this.player.body.rotation) - this.player.body.velocity.angle()); //turn velocity in direction of foil
            this.player.body.setVelocityY(this.player.body.velocity.y + this.data.get('dragFactor')); //the more drag the more sink
            if (this.player.body.rotation < -30 && this.player.body.velocity.y < 0) { //if hitting the water at too steep angle > 30 degrees upwards it crashes
                this.hitSomething();
            }
            if (this.player.y > 370) {
                this.player.setVelocity(60,0);
                this.player.setDrag(0.5);
                this.hitSomething();
            }
            if (this.player.body.velocity.x <= this.data.get('stallSpeed')) { //if it is too slow it stalls
                this.hitSomething();
            }
        }

    }



    changeScene() {
        this.scene.start('GameOver');
    }
}
