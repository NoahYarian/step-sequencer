console.log('main.js is loaded');

lowLag.init();

var tempo = 115;
var oldTempo;

var interval = (60 / tempo) * 250;

var note = 0;
var timer;
var timerSinceLastNote;
var timeSinceLastNote;

var isPlaying = false;

var tracks = [{"id":"bass","name":"Bass Drum","src":"http://assets.noahyarian.com/sounds/808/BD/BD0075.WAV","notes":[true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,true]},{"id":"snare","name":"Snare Drum","src":"http://assets.noahyarian.com/sounds/808/SD/SD0010.WAV","notes":[false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false]},{"id":"closedHat","name":"Closed Hat","src":"http://assets.noahyarian.com/sounds/808/CH/CH.WAV","notes":[false,false,true,false,false,false,true,false,false,false,true,false,false,false,true,false]},{"id":"openHat","name":"Open Hat","src":"http://assets.noahyarian.com/sounds/808/OH/OH00.WAV","notes":[true,false,true,false,true,false,true,false,true,true,false,true,false,true,false,false]},{"id":"clap","name":"Clap","src":"http://assets.noahyarian.com/sounds/808/CP/CP.WAV","notes":[false,false,false,false,true,false,false,false,false,false,false,false,true,false,true,false]}]
// [
//   {
//     id: 'bass',
//     name:'Bass Drum',
//     src:'http://assets.noahyarian.com/sounds/808/BD/BD0075.WAV',
//     notes: [true,false,false,false,false,false,false,true,
//             false,false,false,false,false,false,true,false]
//   },
//   {
//     id: 'snare',
//     name: 'Snare Drum',
//     src:'http://assets.noahyarian.com/sounds/808/SD/SD0010.WAV',
//     notes: [true,false,false,false,true,false,false,false,
//             true,false,false,false,true,false,false,false]
//   },
//   {
//     id: 'closedHat',
//     name: 'Closed Hat',
//     src:'http://assets.noahyarian.com/sounds/808/CH/CH.WAV',
//     notes: [true,true,false,true,true,true,false,true,
//             true,true,false,true,true,false,true,false]
//   },
//   {
//     id: 'openHat',
//     name: 'Open Hat',
//     src:'http://assets.noahyarian.com/sounds/808/OH/OH00.WAV',
//     notes: [false,false,true,false,false,false,true,false,
//             false,false,true,false,false,true,false,true]
//   },
//   {
//     id: 'clap',
//     name: 'Clap',
//     src:'http://assets.noahyarian.com/sounds/808/CP/CP.WAV',
//     notes: [true,false,false,false,false,false,false,false,
//             true,false,false,false,false,false,false,false]
//   }
// ];

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
  if (isPlaying) {
    addNoteRealtime(id);
  }
});

$('.note').click(function() {
  var track = $(this)[0].parentElement.id.slice(0, -5);
  var note;
  var that = this;

  $($(this)[0].parentElement).children().each(function(index) {
    if (that === this) {
      note = index;
    }
  });

  $(this).toggleClass('trackNote');
  toggleNote(track, note);
});

$('.note').hover(function() {
  $(this).css('border', '4px solid lime');
}, function() {
  $(this).css('border', '');
});

$('.play').click(play);
$('.stop').click(stop);

$('.minus').click(tempoDown);
$('.plus').click(tempoUp);
$('.tempoEdit').change(editTempo);

$('.tempoEdit').click(function() {
  oldTempo = tempo;
  editTempoListenersOn();
});

$(document).click(function(event) {
  if(!$(event.target).closest('.tempoEdit').length) {
    editTempo();
    editTempoListenersOff();
  }
});

$('.tempo').mousewheel(function(event) {
  event.deltaY < 0 ? tempoDown() : tempoUp();
});

$('.randomize').click(randomizeBeat);
$('.clear').click(clearBeat);
///////////////////

function tempoUp() {
  tempo++;
  setIntervalVar();
  $('.tempoEdit').val(tempo);
}

function tempoDown() {
  tempo--;
  setIntervalVar();
  $('.tempoEdit').val(tempo);
}

function editTempo() {
  setIntervalVar();
  tempo = $('.tempoEdit').val();
}

function editTempoListenersOn() {
  $(document).keydown(function(e) {
    switch(e.which) {

        case 27: // esc
          tempo = oldTempo;
          $('.tempoEdit').val(tempo);
        case 13: // enter
          $('.tempoEdit').blur();
          editTempoListenersOff();
        break;

        case 38: // up
          tempoUp();
        break;

        case 40: // down
          tempoDown();
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });
}

function editTempoListenersOff() {
  $(document).off('keydown');
}

function setIntervalVar() {
  interval = (60 / tempo) * 250;
}

function showNotes() {
  tracks.forEach(function(track, i) {
    track.notes.forEach(function(note, j) {
      var $note = $($($('.sequencer')[i]).children()[j]);
      if (note) {
        $note.addClass('trackNote');
      } else {
        $note.removeClass('trackNote'); //randomize needs this
      }
    });
  });
}

function loadSounds() {
  tracks.forEach(function(track, i) {
    lowLag.load(track.src, track.id);
  });
}

function play() {
  if (!isPlaying) {
    $('.play').css('color', 'lime');
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
  $('.tick').removeClass('active');
  $('.play').css('color', '#FAFAFA');
}


function onNote(note) {
  window.clearInterval(timerSinceLastNote);
  timeSinceLastNote = 0;
  timerSinceLastNote = setInterval(function() {
    timeSinceLastNote++;
  }, 1);
  var prevNote = note === 0 ? 15 : note-1;
  $($('.tick')[prevNote]).removeClass('active');
  $($('.tick')[note]).addClass('active');

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

// FA Icons -
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

function toggleNote(trackId, noteIndex) {
  var trackIndex;

  tracks.forEach(function(track, i) {
    if (track.id === trackId) {
      trackIndex = i;
    }
  });

  tracks[trackIndex].notes[noteIndex] = !tracks[trackIndex].notes[noteIndex];
}


function randomizeBeat() {
  tracks.forEach(function(track, i) {
    track.notes = [];
    for (var j = 0; j < 16; j++) {
      if (Math.round(Math.random() - .25)) {
        track.notes.push(true);
      } else {
        track.notes.push(false);
      }
    }
  });
  showNotes();
}

function clearBeat() {
  tracks.forEach(function(track, i) {
    track.notes = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
  });
  showNotes();
}

function addNoteRealtime(padId) {
  var roundNoteDown = timeSinceLastNote < interval / 2 ? true : false;
  var whichNote = roundNoteDown ? note-1 : note;
  var datNote = $(`#${padId}Track .note`)[whichNote];
  toggleNote(padId, whichNote);
  $(datNote).toggleClass('trackNote');
}








