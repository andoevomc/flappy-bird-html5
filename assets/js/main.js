var game = new Phaser.Game(600, 490, Phaser.AUTO, 'container');

var fontStyleScore = {
    font: "20pt Zorque",
    fill: "#ffffff",     
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 2,
    shadowColor: '#000000'
};

var fontStyleNotify = {
    font: "50pt Zorque",
    fill: "#ffffff",     
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 4,
    shadowColor: '#0c0000'
};

var mainState = {

	preload: function() {
		game.stage.backgroundColor = '#71c5cf';
		game.load.image('background', 'assets/img/background.png');
		game.load.image('bird', 'assets/img/bird.png');
        game.load.image('pipe1', 'assets/img/pipe1.png');
        game.load.image('pipe2', 'assets/img/pipe2.png');
        game.load.image('pipe3', 'assets/img/pipe3.png');
        game.load.image('pipe4', 'assets/img/pipe4.png');

        game.load.audio('jump', 'assets/sound/jump.wav');
        game.load.audio('score', 'assets/sound/score.wav');
        game.load.audio('hit', 'assets/sound/hit.wav');
	},

	create: function() {
        this.isStarted = false;
        this.isPutPipe = false;
		game.physics.startSystem(Phaser.Physics.ARCADE);
		this.bg= this.game.add.tileSprite(0, 0, 600, 490, 'background');
		this.bird = this.game.add.sprite(100, 245, 'bird');
		game.physics.arcade.enable(this.bird);
        this.bird.anchor.setTo(-0.2, 0.5);

        this.pipeArr = [];

        this.pipe1s = game.add.group();
        this.pipe1s.enableBody = true;
        this.pipe1s.createMultiple(20, 'pipe1');
        this.pipeArr.push(this.pipe1s);
        
        this.pipe2s = game.add.group();
        this.pipe2s.enableBody = true;
        this.pipe2s.createMultiple(6, 'pipe2');
        this.pipeArr.push(this.pipe2s);
        
        this.pipe3s = game.add.group();
        this.pipe3s.enableBody = true;
        this.pipe3s.createMultiple(20, 'pipe3');
        this.pipeArr.push(this.pipe3s);
        
        this.pipe4s = game.add.group();
        this.pipe4s.enableBody = true;
        this.pipe4s.createMultiple(6, 'pipe4');
        this.pipeArr.push(this.pipe4s);

        this.jumpSound = game.add.audio('jump');
        this.scoreSound = game.add.audio('score');
        this.hitSound = game.add.audio('hit');

        this.scorePipe = null;
        this.scorePipeCache = null;
        this.score = 0;
        this.labelScore = game.add.text(15, 15, "Score: 0", fontStyleScore);
        this.labelNotify = game.add.text(210, 210, "START!", fontStyleNotify);

		var spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceBar.onDown.add(this.jump, this); 

        game.input.onDown.add(this.jump, this);


        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
	},

	update: function() {
        if(this.isStarted == false) {
            return;
        }

        if(this.bird.alive == true) {
            this.bg.tilePosition.x -=2;
        }

        if(this.bird.angle < 90) {
            this.bird.angle += 1;
        }
        
		if(this.bird.inWorld == false) {
			this.restart();
		}
        
        this.pipeArr.forEach(function(pipes) {
            game.physics.arcade.overlap(this.bird, pipes, this.hitPipes, null, this);
        }, this);

        if(this.scorePipe == null) {
            this.scorePipe = this.scorePipeCache;
        }

        if(this.scorePipe != null && this.scorePipe.body.x <= 100) {
            this.score += 1;
            this.labelScore.text = "Score: " + this.score;
            this.scorePipe = null;
            this.scoreSound.play();
        }
        
	},

    hitPipes: function() {
        if(this.bird.alive == false) {

            return;
        }

        this.bird.alive = false;

        game.time.events.remove(this.timer);

        this.pipeArr.forEach(function(pipes) {
            pipes.forEachAlive(function(pipe) {
                pipe.body.velocity.x = 0;
            });
        }, this);

        this.hitSound.play();
    },
    
	jump: function() {
        if(this.bird.alive == false) {
            return;
        }

        if(this.isStarted == false) {
            this.isStarted = true;
            this.labelScore.text = "Score: 0";
            this.labelNotify.text = "";
            this.bird.body.gravity.y = 1000;
        }

        this.jumpSound.play();

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
        return pipe;
    },
    
    addRowOfPipes: function() {
        if(this.isStarted == false) {
            return;
        }

        var hole = Math.floor(Math.random() * 5) + 1;
        
        for(var i = 0; i < 8; ++i) {
            if(i != hole && i != hole + 1) {
                if(i == hole - 1) {
                    this.scorePipeCache = this.addOnePipe(this.pipe2s, 588, i * 60);
                } else if(i == hole + 2) {
                    this.addOnePipe(this.pipe4s, 588, i * 60);
                } else if(i < hole) {
                    this.addOnePipe(this.pipe1s, 600, i * 60);
                } else {
                    this.addOnePipe(this.pipe3s, 600, i * 60);
                }
            }
        }
    },
};

game.state.add('main', mainState);
game.state.start('main');