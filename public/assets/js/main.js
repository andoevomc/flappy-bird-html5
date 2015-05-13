var game = new Phaser.Game(600, 490, Phaser.AUTO, 'container');

var mainState = {

	preload: function() {
		game.stage.backgroundColor = '#71c5cf';
		game.load.image('background', 'assets/img/background.png');
		game.load.image('bird', 'assets/img/bird.png');
        game.load.image('pipe1', 'assets/img/pipe1.png');
        game.load.image('pipe2', 'assets/img/pipe2.png');
        game.load.image('pipe3', 'assets/img/pipe3.png');
        game.load.image('pipe4', 'assets/img/pipe4.png');
	},

	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		this.bg= this.game.add.tileSprite(0, 0, 600, 490, 'background');
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
		this.bird = this.game.add.sprite(100, 245, 'bird');
		game.physics.arcade.enable(this.bird);
		this.bird.body.gravity.y = 1000;
        this.bird.anchor.setTo(-0.2, 0.5);

        this.pipe1s = game.add.group();
        this.pipe1s.enableBody = true;
        this.pipe1s.createMultiple(20, 'pipe1');
        
        this.pipe2s = game.add.group();
        this.pipe2s.enableBody = true;
        this.pipe2s.createMultiple(6, 'pipe2');
        
        this.pipe3s = game.add.group();
        this.pipe3s.enableBody = true;
        this.pipe3s.createMultiple(20, 'pipe3');
        
        this.pipe4s = game.add.group();
        this.pipe4s.enableBody = true;
        this.pipe4s.createMultiple(6, 'pipe4');

		var spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceBar.onDown.add(this.jump, this);
        
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
	},

	update: function() {
        if(this.bird.angle < 30) {
            this.bird.angle += 1;
        }
        
		if(this.bird.inWorld == false) {
			this.restart();
		}
        
        game.physics.arcade.overlap(this.bird, this.pipe1s, this.restart, null, this);
        game.physics.arcade.overlap(this.bird, this.pipe2s, this.restart, null, this);
        game.physics.arcade.overlap(this.bird, this.pipe3s, this.restart, null, this);
        game.physics.arcade.overlap(this.bird, this.pipe4s, this.restart, null, this);
	},
    
	jump: function() {
		this.bird.body.velocity.y = -350;
        
        var animation = game.add.tween(this.bird);
        animation.to({ angle: -20}, 100);
        animation.start();
	},

	restart: function() {
		game.state.start('main');
	},
    
    addOnePipe: function(pipes, x, y) {
        var pipe = pipes.getFirstDead();
        pipe.reset(x, y);
        pipe.body.velocity.x = -200;
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    
    addRowOfPipes: function() {
        var hole = Math.floor(Math.random() * 5) + 1;
        
        for(var i = 0; i < 8; ++i) {
            if(i != hole && i != hole + 1) {
                if(i == hole - 1) {
                    this.addOnePipe(this.pipe2s, 588, i * 60);
                } else if(i == hole + 2) {
                    this.addOnePipe(this.pipe4s, 588, i * 60);
                } else if(i < hole) {
                    this.addOnePipe(this.pipe1s, 600, i * 60);
                } else {
                    this.addOnePipe(this.pipe3s, 600, i * 60);
                }
            }
        }
        
        this.updateScore();
    },
    
    updateScore: function() {
        this.score += 1;
        this.labelScore.text = this.score;
    },
};

game.state.add('main', mainState);
game.state.start('main');