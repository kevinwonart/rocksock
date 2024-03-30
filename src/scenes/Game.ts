import { Scene, Time } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    timedEvent: Time.TimerEvent;
    private rocks : Phaser.Physics.Arcade.Group;
    player1Score: number;
    player2Score: number;

    constructor () {
        super('Game');
        this.player1Score = 0;
        this.player2Score = 0;
        //this.onClickRock = this.onClickRock.bind(this);
    }

    create ():void {
      this.camera = this.cameras.main;

      this.background = this.add.image(512, 384, 'background');
      this.background.setAlpha(0.5);
      const gameWidth = this.sys.game.config.width as number;
      const gameHeight= this.sys.game.config.height as number;  


      const sock1 = this.add.image(0, gameHeight, 'sock1').setOrigin(0, 1);
      const sock2 = this.add.image(gameWidth, gameHeight, 'sock2').setOrigin(1, 1);

      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.dropRock,
        callbackScope: this,
        loop: true
      })
      
      this.rocks = this.physics.add.group({});
      //this.rocks.body.onCollide = true;

      this.physics.add.collider(this.rocks, this.rocks);
      /* left sock top (221,559) (291, 597)
       * right sock top (801, 559) (729, 600)
      */

    }   


    dropRock() {
      //width 1024
      //this.sys.game.config.width as number
      if (this.rocks.countActive(true) < 3) {
        const xPosition: number = Phaser.Math.Between(0, this.sys.game.config.width as number);

        const rock = this.physics.add.sprite(xPosition, 0, 'rock0');
        this.rocks.add(rock);
        rock.setInteractive();
        rock.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
          const clickX = pointer.worldX;
          const clickY = pointer.worldY;
          const pushStrength = 200;
          const angle = Phaser.Math.Angle.Between(rock.x, rock.y, clickX, clickY);
          rock.body.setVelocity(
            Math.cos(angle) * -pushStrength,
            Math.sin(angle) * -pushStrength
          ); 
        });

        rock.setCollideWorldBounds(false);
        //rock.body.setVelocityY(Phaser.Math.Between(50, 150));
      }
    }

    update() {
      const screenHeight = this.sys.game.config.height as number;

      this.physics.world.bodies.each(body => {
        if (body.gameObject instanceof Phaser.Physics.Arcade.Sprite && body.gameObject.texture.key === 'rock0') {
            if (body.gameObject.y > screenHeight) {
                body.gameObject.destroy();
            }
        }
        return true;
      }, this);

      //calc player 1 score and remove rock if passes sock line
      this.rocks.children.each((rock: Phaser.GameObjects.GameObject) => {
        if (rock instanceof Phaser.Physics.Arcade.Sprite && rock.active && this.hasCrossedLine1(rock)) {
          rock.destroy(); // Destroy the rock
          this.player1Score += 1; // Increment player 1 score
          console.log(`Player 1 Score: ${this.player1Score}`);
        }
        return null;
      }, this);
      
      //calc player 2 score and remove rock if passes sock line
      this.rocks.children.each((rock: Phaser.GameObjects.GameObject) => {
        if (rock instanceof Phaser.Physics.Arcade.Sprite && rock.active && this.hasCrossedLine2(rock)) {
          rock.destroy(); // Destroy the rock
          this.player2Score += 1; // Increment player 1 score
          console.log(`Player 2 Score: ${this.player1Score}`);
        }
        return null;
      }, this);
    }
    
    hasCrossedLine1(rock: Phaser.Physics.Arcade.Sprite) {
      const lineY = this.calculateLineY1(rock.x);
      return rock.y > lineY;
    }

    calculateLineY1(x: number): number {
      const x1 = 221, y1 = 559, x2 = 291, y2 = 597;
      const slope = (y2 - y1) / (x2 - x1);
      const yIntercept = y1 - slope * x1;

      return slope * x + yIntercept;
    }

    hasCrossedLine2(rock: Phaser.Physics.Arcade.Sprite) {
      const lineY = this.calculateLineY2(rock.x);
      return rock.y > lineY;
    }

    calculateLineY2(x: number): number {
      const x1 = 801, y1 = 559, x2 = 729, y2 = 600;
      const slope = (y2 - y1) / (x2 - x1);
      const yIntercept = y1 - slope * x1;

      return slope * x + yIntercept;
    }
}
