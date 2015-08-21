$(function () {

//================ Play Button==================//
$("#play-button").on("click", function () {
    play();
});

//================ Tempo Slider==================//
$("#tempo").on("change", function () {
    tempo = this.value;
    $("#showTempo").html(tempo);
});

//================ Play ========================//
play = function() {
    isPlaying = !isPlaying;

    if (isPlaying) {
        current16thNote = 1;
        currentNote = 0;
        futureTickTime = audioContext.currentTime;
        scheduler();
        return "stop";
    } else {
        window.clearTimeout(timerID);
        return "play";
    }
}

//================ Future Tick ==================//
futureTick = function () {
    var secondsPerBeat = 60.0 / tempo;
    futureTickTime += 0.25 * secondsPerBeat;
    current16thNote++;
    if (current16thNote > 16) {
        current16thNote = 1;
    }
}

//================ Scheduler ==================//
scheduler = function() {
    while (futureTickTime < audioContext.currentTime + 0.1) {
        scheduleSynth(current16thNote, futureTickTime);// SENDS STEP TO STEP SEQUENCER
        scheduleDrumMach(current16thNote, futureTickTime);// SENDS STEP TO DRUM MACH

        //scheduleStep(current16thNote, futureTickTime);// Display Info for Debug
        
        futureTick();
    }
    timerID = window.setTimeout(scheduler, 50.0);
}

/*
//================ Display Info for Debug ==================//
scheduleStep = function (current16thNote, time) {
	//Display Pulse
    $("#metro-ui-" + (current16thNote)).effect("pulsate", {
        times: 1
    }, 10);
	//Log Current Step and Window Time
    console.log("Current Step: " + current16thNote, "Current Window Time:" + time);
}
*/

});