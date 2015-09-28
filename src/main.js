console.log('main.js is loaded');

lowLag.init();

var tempo = 120;

var interval = (60 / tempo) * 500;

var note = 0;
var timer;

var isPlaying = false;

var tracks = [
  {
    id: 'bass',
    name:'Bass Drum',
    src:'http://assets.noahyarian.com/sounds/808/BD/BD0075.WAV',
    notes: [true,false,false,false,false,false,false,true,
            false,false,false,false,false,false,true,false]
  },
  {
    id: 'snare',
    name: 'Snare Drum',
    src:'http://assets.noahyarian.com/sounds/808/SD/SD0010.WAV',
    notes: [true,false,false,false,true,false,false,false,
            true,false,false,false,true,false,false,false]
  },
  {
    id: 'closedHat',
    name: 'Closed Hat',
    src:'http://assets.noahyarian.com/sounds/808/CH/CH.WAV',
    notes: [true,true,true,true,true,true,true,true,
            true,true,true,true,true,true,true,true]
  },
  {
    id: 'clap',
    name: 'Clap',
    src:'http://assets.noahyarian.com/sounds/808/CP/CP.WAV',
    notes: [true,false,false,false,false,false,false,false,
            true,false,false,false,false,false,false,false]
  }
];

// onLoad
///////////////
$(function() {
  showNotes();
  loadSounds();
});
///////////////


// Listeners
///////////////////
$('.pad').click(function() {
  var id = $(this).attr('id');
  playSound(id);
});

$('.play').click(play);
$('.stop').click(stop);
///////////////////



function showNotes() {
  tracks.forEach(function(track, i) {
    track.notes.forEach(function(note, j) {
      var $note = $($($('.sequencer')[i]).children()[j]);
      if (note) {
        $note.addClass('trackNote');
      }
    });
  });
}

function loadSounds() {
  tracks.forEach(function(track, i) {
    lowLag.load(track.src, track.id);
    // $($('.pad')[i]).text(track.name);
  });
}

function play() {
  if (!isPlaying) {
    timer = setInterval(function() {
      onNote(note);

      if (note === 15) {
        note = 0;
      } else {
        note++;
      }

    }, interval);
  }
  isPlaying = true;
}

function stop() {
  window.clearInterval(timer);
  isPlaying = false;
  note = 0;
  $('.note').removeClass('active');
}


function onNote(note) {
  var prevNote = note === 0 ? 15 : note-1;
  $($('.note')[prevNote]).removeClass('active');
  $($('.note')[note]).addClass('active');

  tracks.forEach(function(track, i) {
    if (track.notes[note]) {
      playSound(track.id);
    }
  });
}

function playSound(sound) {
  $('#' + sound)
    .css('background', randomColor({luminosity: 'bright'}))
    .children('i')
      .html(getRandIcon())
      .css('color', randomColor({luminosity: 'bright'}));
  lowLag.play(sound, function () {
    // $('#' + sound).css('background', '#646464'); //ooglay!
  });
}



function getRandIcon() {
  var str = '&#xf';
  var hexNoF = '0123456789ABCDE'.split('');
  str += Math.round(Math.random());
  str += hexNoF[Math.floor(Math.random() * 8)];
  str += hexNoF[Math.floor(Math.random() * 15)];
  str += ';';
  return str;
}

// digits are 0 to e
// [&#xf000;] to [&#xf280;]


function randIndex(arrLength) {
  return Math.floor(Math.random() * arrLength);
}

function pickTrackHues() {
  tracks.forEach(function(track, i) {
    track.hue1 = getRandHue();
    track.hue2 = getRandHue();
  });
}

function getRandHue() {
  var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
  var randInt = Math.floor(Math.random() * 7);
  return colors[randInt];
}











