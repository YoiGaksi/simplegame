export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('bg', './assets/background.png');
        this.load.image('awan', './assets/awan.png');
    }

    create(data) {
        const x = window.innerWidth;
        const y = window.innerHeight;
        this.screenHeight = y;

        // background
        this.bg = this.add.image(x /2, y /2, 'bg').setOrigin(0.5,0.5);

        const awan = this.add.image(x / 2, y / - 1.5, 'awan');

        //Judul Game
        const judulgame = this.add.text( x / 2, y / 4, "don't get Hit", { fontSize: '32px', fill: '#FFF' });
        judulgame.setOrigin(0.5,0.5);
        judulgame.setAlpha(1);
        judulgame.setScale(5);


        // play button
        const playbtn = this.add.text(x / 2, y / 1.5, 'Play', { fontSize: '32px', fill: '#FFF' });
        playbtn.setInteractive();
        playbtn.setOrigin(0.5,0.5);

        playbtn.on('pointerover', () => {
            this.tweens.add({
                targets: playbtn,
                scale: 1.5,
                duration: 250,
                ease: 'Linear'
            });
        });
        playbtn.on('pointerout', () => {
            this.tweens.add({
                targets: playbtn,
                scale: 1,
                duration: 500,
                ease: 'Linear'
            });
        });
        playbtn.on('pointerup', () => {
            this.scene.start('Game');
        });

        //Highest time
        this.highestTime = this.add.text( x / 2, y / 1.4, 'Your Highest Time:', { fontSize: '16px', fill: '#FFF' });
        this.highestTime.setOrigin(0.5,0.5);
        if (data.finalTime !== undefined) {
            this.highestTime.setText('Your Highest Time: ' + data.finalTime + 's');
        }
        //copyright 
        this.add.text(x / 1.2, y / 1.05 , '@Last Update - 17/05/2025', { fontSize: '16px', fill: '#FFF' }).setOrigin(0.5,0.5);
        this.navigasi = this.add.text( x / 2, y / 1.1, 'Use Arrow pad in your keyboard to move', { fontSize: '16px', fill: '#FFF' });
        this.navigasi.setOrigin(0.5,0.5);
        this.tweens.add({
                targets: this.navigasi,
                scale: 2,
                duration: 2000,
                ease: 'Linear',
                repeat: -1
            });
    }

    update() {
        //aray bg
        
    }
    
}
