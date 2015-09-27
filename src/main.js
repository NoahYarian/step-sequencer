console.log('main.js is loaded');

lowLag.init();
lowLag.load("http://assets.noahyarian.com/sounds/808/BD/BD0075.WAV", 'bass');
lowLag.load("http://assets.noahyarian.com/sounds/808/SD/SD0010.WAV", 'snare');
lowLag.load("http://assets.noahyarian.com/sounds/808/CH/CH.WAV", 'closedHat');
lowLag.load("http://assets.noahyarian.com/sounds/808/CP/CP.WAV", 'clap');

var tempo = 120;

var interval = (60 / tempo) * 500;

var note = 0;
var timer;

var isPlaying = false;

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
});

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
  $($('.note')[prev(note)]).removeClass('active');
  $($('.note')[note]).addClass('active');

  tracks.forEach(function(track, i) {
    if (track.notes[note]) {
      playSound(track.id);
    }
  })



  // if (note % 8 === 0) {
  //   playSound('clap');
  // }
  // if (note % 4 === 0) {
  //   playSound('snare');
  // } else if (note % 1 === 0) {
  //   playSound('closedHat');
  // }
  // if (note % 7 === 0) {
  //   playSound('bass');
  // }
}

$('.play').click(play);
$('.stop').click(stop);

function prev(note) {
  return note === 0 ? 15 : note-1;
}

function next(note) {
  return note === 15 ? 0 : note+1;
}

function playSound(sound) {
  $('#' + sound).css('background', randomColor({luminosity: 'bright'}));
  lowLag.play(sound, function () {
    $('#' + sound).css('background', '#646464');
  });
}

$('.pad').click(function() {
  var id = $(this).attr('id');
  playSound(id);
});


var tracks = [
  {
    id: 'bass',
    name:'Bass Drum',
    src:'http://assets.noahyarian.com/sounds/808/BD/BD0075.WAV',
    notes: [true,false,false,false,false,false,false,true,
            false,false,false,false,false,false,true,false]
      // 0: false,
      // 1: false,
      // 2: false,
      // 3: false,
      // 4: false,
      // 5: false,
      // 6: false,
      // 7: false,
      // 8: false,
      // 9: false,
      // 10: false,
      // 11: false,
      // 12: false,
      // 13: false,
      // 14: false,
      // 15: false
    // }
  },
  {
    id: 'snare',
    name: 'Snare Drum',
    src:'http://assets.noahyarian.com/sounds/808/SD/SD0010.WAV',
    notes: [true,false,false,false,true,false,false,false,
            true,false,false,false,true,false,false,false]
    //   0: false,
    //   1: false,
    //   2: false,
    //   3: false,
    //   4: false,
    //   5: false,
    //   6: false,
    //   7: false,
    //   8: false,
    //   9: false,
    //   10: false,
    //   11: false,
    //   12: false,
    //   13: false,
    //   14: false,
    //   15: false
    // }
  },
  {
    id: 'closedHat',
    name: 'Closed Hat',
    src:'http://assets.noahyarian.com/sounds/808/CH/CH.WAV',
    notes: [true,true,true,true,true,true,true,true,
            true,true,true,true,true,true,true,true]
    //   0: false,
    //   1: false,
    //   2: false,
    //   3: false,
    //   4: false,
    //   5: false,
    //   6: false,
    //   7: false,
    //   8: false,
    //   9: false,
    //   10: false,
    //   11: false,
    //   12: false,
    //   13: false,
    //   14: false,
    //   15: false
    // }
  },
  {
    id: 'clap',
    name: 'Clap',
    src:'http://assets.noahyarian.com/sounds/808/CP/CP.WAV',
    notes: [true,false,false,false,false,false,false,false,
            true,false,false,false,false,false,false,false]
    //   0: false,
    //   1: false,
    //   2: false,
    //   3: false,
    //   4: false,
    //   5: false,
    //   6: false,
    //   7: false,
    //   8: false,
    //   9: false,
    //   10: false,
    //   11: false,
    //   12: false,
    //   13: false,
    //   14: false,
    //   15: false
    // }
  }
]





