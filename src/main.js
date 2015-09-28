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
  tracks.forEach(function(track, i) {
    // var $track = $($('.sequencer')[i]);
    track.notes.forEach(function(note, j) {
      var $note = $($($('.sequencer')[i]).children()[j]);
      if (note) {
        $note.addClass('trackNote');
      }
    });
  });
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

function loadSounds() {
  tracks.forEach(function(track, i) {
    lowLag.load(track.src, track.id);
    $($('.pad')[i]).text(track.name);
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
  var prev = note === 0 ? 15 : note-1;
  $($('.note')[prev(note)]).removeClass('active');
  $($('.note')[note]).addClass('active');

  tracks.forEach(function(track, i) {
    if (track.notes[note]) {
      playSound(track.id);
    }
  });
}

function playSound(sound) {
  $('#' + sound).css('background', randomColor({luminosity: 'bright'}));
  lowLag.play(sound, function () {
    $('#' + sound).css('background', '#646464');
  });
}










