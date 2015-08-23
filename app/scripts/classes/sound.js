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
  this.loopMute = false;

  this.sounds = {};
  this.soundsVolume = 0.5;
  this.soundsMute = false;


  // -- Methods --
  this.init = function() {

    if(typeof(Storage) !== "undefined") {
      if(localStorage.getItem("loopMute") === "true")
        this.loopMute = true;
      if(localStorage.getItem("soundsMute") === "true")
        this.soundsMute = true;
    }

    this.loops.push(new Howl({
      urls: ['sound/loop1.mp3', 'sound/loop1.ogg'],
      buffer: true,
      onend: function() {
        Sound.getInstance().newTrack();
      }
    }));

    this.loops.push(new Howl({
      urls: ['sound/loop2.mp3', 'sound/loop2.ogg'],
      buffer: true,
      onend: function() {
        Sound.getInstance().newTrack();
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

    // Actions --
    $('#soundsMute').on('click', function() {
      var sound = Sound.getInstance();
      sound.setSoundMute(!sound.soundsMute);
    })
    $('#loopMute').on('click', function() {
      var sound = Sound.getInstance();
      sound.setLoopMute(!sound.loopMute);
    })
  };

  this.newTrack = function() {
    this.currentLoopId = Math.floor(Math.random() * 100) % this.loops.length;
    console.log(this.currentLoopId);
    this.currentLoop = this.loops[this.currentLoopId];
    this.currentLoop.volume(this.loopVolume);

    if(!this.loopMute)
      this.currentLoop.play();
  };

  this.onMove = function() {
    if(!this.soundsMute) {
      this.sounds.volume(this.soundsVolume);
      this.sounds.play('move');
    }
  };

  this.onWin = function() {
    if(!this.soundsMute) {
      this.sounds.volume(this.soundsVolume);
      this.sounds.play('win');
    }
  };

  this.onError = function() {
    if(!this.soundsMute) {
      this.sounds.volume(this.soundsVolume);
      this.sounds.play('error');
    }
  };

  this.onMindControl = function() {
    if(!this.soundsMute) {
      this.sounds.volume(this.soundsVolume);
      this.sounds.play('mindcontrol');
    }
  };

  // -- Getters & setters --
  this.setSoundMute = function(boolean) {
    if(typeof(Storage) !== "undefined") {
      localStorage.setItem("soundsMute", boolean ? "true" : "false");
    }

    this.soundsMute = boolean;
  };

  this.setLoopMute = function(boolean) {
    if(typeof(Storage) !== "undefined") {
      localStorage.setItem("loopMute", boolean ? "true" : "false");
    }

    this.loopMute = boolean;

    if(this.loopMute) {
      this.currentLoop.pause();
    } else {
      this.currentLoop.play();
    }
  };
};

Sound.getInstance = function () { return Sound._instance || new Sound(); }
console.log('Sound system: ready');
