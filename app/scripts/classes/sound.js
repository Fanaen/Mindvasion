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
      if(localStorage.getItem("loopVolume") != null)
        this.loopVolume = parseFloat(localStorage.getItem("loopVolume"));
      if(localStorage.getItem("soundsVolume") != null)
        this.soundsVolume = parseFloat(localStorage.getItem("soundsVolume"));
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
    $('#loopPlus').on('click', function() { Sound.getInstance().loopPlus(); });
    $('#loopLess').on('click', function() { Sound.getInstance().loopLess(); });
    $('#soundsPlus').on('click', function() { Sound.getInstance().soundsPlus(); });
    $('#soundsLess').on('click', function() { Sound.getInstance().soundsLess(); });

    $('#soundsMute').text(this.soundsMute ? "Unmute" : "Mute");
    $('#loopMute').text(this.loopMute ? "Unmute" : "Mute");
  };

  this.newTrack = function() {
    this.currentLoopId = Math.floor(Math.random() * 100) % this.loops.length;
    this.currentLoop = this.loops[this.currentLoopId];
    this.currentLoop.volume(this.loopVolume);

    if(!this.loopMute)
      this.currentLoop.play();
  };

  this.onMove = function() {
    console.log(this.soundsMute);
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
    $('#soundsMute').text(this.soundsMute ? "Unmute" : "Mute");
  };

  this.setLoopMute = function(boolean) {
    if(typeof(Storage) !== "undefined") {
      localStorage.setItem("loopMute", boolean ? "true" : "false");
    }

    this.loopMute = boolean;
    $('#loopMute').text(this.loopMute ? "Unmute" : "Mute");

    if(this.loopMute) {
      this.currentLoop.pause();
    } else {
      this.currentLoop.play();
    }
  };

  this.soundsPlus = function() {
    this.soundsVolume += 0.1;
    if(this.soundsVolume > 1) this.soundsVolume = 1;

    if(typeof(Storage) !== "undefined") {
      localStorage.setItem("soundsVolume", this.soundsVolume.toFixed(1).toString());
    }
  }

  this.soundsLess = function() {
    this.soundsVolume -= 0.1;
    if(this.soundsVolume < 0) this.soundsVolume = 0;

    if(typeof(Storage) !== "undefined") {
      localStorage.setItem("soundsVolume", this.soundsVolume.toFixed(1).toString());
    }
  }

  this.loopPlus = function() {
    this.loopVolume += 0.1;
    if(this.loopVolume > 1) this.loopVolume = 1;

    this.currentLoop.volume(this.loopVolume);

    if(typeof(Storage) !== "undefined") {
      localStorage.setItem("loopVolume", this.loopVolume.toFixed(1).toString());
    }
  }

  this.loopLess = function() {
    this.loopVolume -= 0.1;
    if(this.loopVolume < 0) this.loopVolume = 0;

    this.currentLoop.volume(this.loopVolume);

    if(typeof(Storage) !== "undefined") {
      localStorage.setItem("loopVolume", this.loopVolume.toFixed(1).toString());
    }
  }
};

Sound.getInstance = function () { return Sound._instance || new Sound(); }
console.log('Sound system: ready');
