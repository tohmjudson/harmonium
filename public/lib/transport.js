var transport = {
  isPlaying: false,
  tempo: 120,
  steps: 16,
  lookahead: 0.1,
  intervalTime: 25,
  nextNoteTime: null, // when the next note is happening
  currentNote: 0, // the index of the current note from 0 - 15
  intervalId: null, // the id of the setInterval lookahead
  current16thNote: 1,
  futureTickTime: 0.0,
  timerID: 0,
  controllables: [],
  
  start: function() {
    while (isPlaying) {
      controllables.forEach(function(controllable) {
        for (var i = 1; i <= this.steps; i++) {
          controllable.step(i);
        }
      });
    }
  },
  
  stop: function() {
    controllables.forEach(function(controllable) {
      controllable.stop();
    });
  },

};