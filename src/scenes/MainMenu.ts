import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 300, 'logo');

        this.logo = this.add.image(512, 460, 'rock0');

        /*
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // Create a rock sprite at the pointer location
            const rock = this.physics.add.sprite(pointer.x, pointer.y, 'x');

            // Optionally, set some physics properties
            rock.setCollideWorldBounds(true); // Make it collide with the world bounds
        });
        */

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
