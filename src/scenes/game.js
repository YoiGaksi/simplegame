export class Game extends Phaser.Scene{
    constructor(){
        super('Game');
    }

    preload(){
        this.load.image('bg', './assets/background.png');
        this.load.image('awan', './assets/awan.png');
        this.load.image('pesawat', './assets/pesawat1.png');
        this.load.image('musuh', './assets/pesawattembak.png');
        this.load.image('fireball', './assets/fireball.png');
        this.load.audio('backsound', './assets/backsound.mp3');
        this.load.audio('bum', './assets/bom.mp3');
        this.load.audio('endgame', './assets/endgame.mp3');
    }
    create() {
        const x = window.innerWidth;
        const y = window.innerHeight;
        this.screenWidth = x;
        this.screenHeight = y;

        //backsound
        this.bgm = this.sound.add('backsound', {
        volume: 0.5,    // volume dari 0.0 ke 1.0
        loop: true      // biar backsound terus diputar
        });
        this.hit = this.sound.add('bum', {
        volume: 0.5,    // volume dari 0.0 ke 1.0
        loop: false      // biar backsound terus diputar
        });
        this.end = this.sound.add('endgame', {
        volume: 0.5,    // volume dari 0.0 ke 1.0
        loop: false      // biar backsound terus diputar
        });
        this.bgm.play();


        // background
        this.backgrounds = [];

        for (let i = 0; i < 2; i++) {
            const bg = this.add.image(x / 2, i * -y, 'bg').setOrigin(0.5, 0).setDepth(0);
            bg.setDisplaySize(x, y); // biar pas dengan layar
            bg.setData('kecepatan', 2); // custom speed
            this.backgrounds.push(bg);
        }
        //awan gerak
        this.clouds = this.add.group();

        // timer awan untuk spawn awan terus menerus
        this.time.addEvent({
            delay: 1000, // setiap 1 detik
            callback: this.spawnCloud,
            callbackScope: this,
            loop: true
        });

        // timer player
        this.timer = 0;
        this.timerText = this.add.text(this.screenWidth / 1.5, this.screenHeight - 50, 'Time: ', {
        fontSize: '16px',
        fill: '#FFF'
        }).setDepth(3);

        // Tambah timer setiap detik
        this.timerEvent = this.time.addEvent({
        delay: 1000,
        callback: () => {
            this.timer++;
            this.timerText.setText('Time: ' + this.timer);
        },
        loop: true
        });


        //Karakter utama
        this.pesawat = this.add.image(this.screenWidth / 2, 100, 'pesawat');
        this.pesawat.setDepth(2);
        this.pesawat.setScale(0.8); // atau sesuaikan ukurannya

        // aktifkan keyboard
        this.cursors = this.input.keyboard.createCursorKeys();

        //Musuh
        this.musuh = this.add.image(this.screenWidth / 2, this.screenHeight - 100, 'musuh');
        this.musuh.setScale(0.2);
        this.musuh.setDepth(2);
        //tembakan musuh 
        this.peluruMusuhGroup = this.add.group();
        this.tembakMusuh = () => {
            console.log('Nembak!');
            this.hit.play();
            const peluru = this.add.image(this.musuh.x, this.musuh.y - 30, 'fireball');
            peluru.setDepth(3);
            peluru.setScale(0.5);
            
            peluru.setData('kecepatan', 5);
            this.peluruMusuhGroup.add(peluru);
        };
        this.time.addEvent({
            delay: 1000, // tiap 1 detik nembak
            callback: this.tembakMusuh,
            callbackScope: this,
            loop: true
        });


        // your code here
       console.log('Your in game page');
    }
    
    spawnCloud() {
        const x = Phaser.Math.Between(0, this.screenWidth);
        const speed = Phaser.Math.FloatBetween(0.5, 2.5);
        const scale = Phaser.Math.FloatBetween(0.3, 1.2);

        const cloud = this.add.image(x, -100, 'awan');
        cloud.setDepth(1)
        cloud.setScale(scale);
        cloud.setAlpha(0.8);
        cloud.setData('kecepatan', speed);

        this.clouds.add(cloud);
    }

    update(){
        //background
        for (let bg of this.backgrounds) {
            bg.y += bg.getData('kecepatan');
            if (bg.y >= this.screenHeight) {
            // Reset ke atas layar (looping)
            bg.y = -this.screenHeight + (bg.y - this.screenHeight);
            }
        }

        //awan
        this.clouds.getChildren().forEach(cloud => {
            cloud.y += cloud.getData('kecepatan');

            // hapus awan jika sudah keluar layar bawah
            if (cloud.y > this.screenHeight + 50) {
            cloud.destroy();
            }
        });

        // kontrol pesawat
        const speed = 5;

        if (this.cursors.left.isDown) {
        this.pesawat.x -= speed;
        } else if (this.cursors.right.isDown) {
        this.pesawat.x += speed;
        }

        // batasi pesawat agar tidak keluar layar
        if (this.pesawat.x < 0) {
        this.pesawat.x = 0;
        } else if (this.pesawat.x > this.screenWidth) {
        this.pesawat.x = this.screenWidth;
        }

        // kecepatan gerakan musuh
        const chaseSpeed = 2;

        // ambil posisi x target (player)
        const targetX = this.pesawat.x;

        // hitung selisih arah
        const deltaX = targetX - this.musuh.x;

        // gerak perlahan ke arah player
        this.musuh.x += deltaX * 0.02 * chaseSpeed; // tweak angka ini untuk delay yang lebih besar/kecil


        //tembakan musuh
        this.peluruMusuhGroup.getChildren().forEach(peluru => {
                peluru.y -= peluru.getData('kecepatan');

                // hapus peluru kalau sudah keluar layar
                if (peluru.y < -50) {
                    peluru.destroy();
                }

                // cek tabrakan sederhana (bounding box)
                if (
                    Phaser.Math.Distance.Between(peluru.x, peluru.y, this.pesawat.x, this.pesawat.y) < 30
                ) {
                    peluru.destroy();
                    console.log('Player kena peluru!'); // ganti dengan logika game over/nyawa

                    //stop timer dan pindah ke start
                    this.timerEvent.remove(); // stop timer
                    this.scene.start('Start', { finalTime: this.timer });
                    this.end.play();
                    this.bgm.stop();
                }
        });

    }
}