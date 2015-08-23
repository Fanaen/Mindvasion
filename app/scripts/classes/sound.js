/**
 * Created by Fanaen on 23/08/2015.
 */

/**
 * Created by Lifaen on 22/08/2015.
 */

var Sound = function () {
  if (Sound._instance) { return Sound._instance; }
  Sound._instance = this;

  // -- Attributes --
  this.loops = [];
  this.currentLoopId = 0;
  this.currentLoop = {};
  this.loopVolume = 0.5;

  this.sounds = {};
  this.soundsVolume = 0.5;


  // -- Methods --
  this.init = function() {

    this.loops.push(new Howl({
      urls: ['sound/loop1.mp3'],
      buffer: true,
      onend: function() {
        Game.getInstance().newTrack();
      }
    }));

    this.loops.push(new Howl({
      urls: ['sound/loop2.mp3'],
      buffer: true,
      onend: function() {
        Game.getInstance().newTrack();
      }
    }));

    // Sound FX --
    this.sounds = new Howl({
      urls: ['sound/sounds.ogg', 'sound/sounds.wav'],
      volume: 0.5,
      sprite: {
        error: [0, 300],
        mindcontrol: [420, 630],
        move: [1405, 95],
        win: [1950, 950]
      }
    });

    this.newTrack();
  };

  this.newTrack = function() {
    this.currentLoopId = Math.floor(Math.random() * 100) % this.loops.length;
    console.log(this.currentLoopId);
    this.currentLoop = this.loops[this.currentLoopId];
    this.currentLoop.volume(this.loopVolume);
    this.currentLoop.play();
  };

  this.onMove = function() {
    this.sounds.volume(this.soundsVolume);
    this.sounds.play('move');
  };

  this.onWin = function() {
    this.sounds.volume(this.soundsVolume);
    this.sounds.play('win');
  };

  this.onError = function() {
    this.sounds.volume(this.soundsVolume);
    this.sounds.play('error');
  };

  this.onMindControl = function() {
    this.sounds.volume(this.soundsVolume);
    this.sounds.play('mindcontrol');
  };
};

Sound.getInstance = function () { return Sound._instance || new Sound(); }
console.log('Sound system: ready');
