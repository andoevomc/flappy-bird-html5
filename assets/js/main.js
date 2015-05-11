var game = new Phaser.Game(400, 490, Phaser.AUTO, 'container');

var mainState = {

	preload: function() {
		game.stage.backgroundColor = '#71c5cf';
		game.load.image('background', 'assets/img/background.png');
		game.load.image('bird', 'assets/img/bird.png');
	},

	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		this.bg= this.game.add.tileSprite(0, 0, 400, 490, 'background');
		this.bird = this.game.add.sprite(100, 245, 'bird');
		game.physics.arcade.enable(this.bird);
		this.bird.body.gravity.y = 1000;

		var spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceBar.onDown.add(this.jump, this);
	},

	update: function() {
		if(this.bird.inWorld == false) {
			this.restart();
		}
	},

	jump: function() {
		this.bird.body.velocity.y = -350;
	},

	restart: function() {
		game.state.start('main');
	},
};

game.state.add('main', mainState);
game.state.start('main');