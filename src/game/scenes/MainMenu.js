import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(512, 384, 'background');
        this.add.image(200, 240, 'player');
        this.add.image(512,384, 'foreground');

        this.logo = this.add.image(512, 300, 'logo').setDepth(100);

        this.add.text(512, 460, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setDepth(100).setOrigin(0.5);

        this.foilQuiver = [
            {   
                name: 'beginner foil',
                span: 1200,
                chordWidth: 400,
                surface: 2000,
                stabSurface: 400,
                fuselage: 800
            },
            {   
                name: 'standard foil',
                span: 1000,
                chordWidth: 200,
                surface: 1200,
                stabSurface: 400,
                fuselage: 700
            },
            {   
                name: 'high aspect foil',
                span: 1200,
                chordWidth: 80,
                surface: 800,
                stabSurface: 200,
                fuselage: 600
            }

        ]

        EventBus.emit('current-scene-ready', this);
    }

    update ()
    {

    }

    changeScene ()
    {
        this.scene.start('Game');
    }
}
