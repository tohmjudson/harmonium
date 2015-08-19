$(function () {
    "use strict";

//================ General variable ==================//
    var isPlaying = false,
        tempo = 120.0, // BPM
        current16thNote = 1,
        futureTickTime = 0.0,
        timerID = 0;

//================ Load samples ==================//
    var kick = audioFileLoader("sounds/kick.mp3"),
        snare = audioFileLoader("sounds/snare.mp3"),
        hihat = audioFileLoader("sounds/hihat.mp3"),
        shaker = audioFileLoader("sounds/shaker.mp3");

//================ Track Que ==================//
    var track1Que = [],
        track2Que = [],
        track3Que = [],
        track4Que = [];

//================ Track Array ==================//
    var track1 = [],
        track2 = [],
        track3 = [],
        track4 = [];

//================ Future Tick ==================//
    function futureTick() {
        var secondsPerBeat = 60.0 / tempo;
        futureTickTime += 0.25 * secondsPerBeat;
        current16thNote++;
        if (current16thNote > 16) {
            current16thNote = 1;
        }
    }

//================ Div Colors ==================//
    function setDivColors(domElementGridNote, arr) {
        for (var i = 0; i < arr.length; i += 1) {
            $(domElementGridNote + arr[i]).css("background-color", "red");
        }
    }

    setDivColors('#gridBeatTrack1-Rhyth', track1);
    setDivColors('#gridBeatTrack2-Rhyth', track2);
    setDivColors('#gridBeatTrack3-Rhyth', track3);
    setDivColors('#gridBeatTrack4-Rhyth', track4);

//================ Record and Play Pads ==================//
    function checkIfRecordedAndPlay(trackArray, sndToPlay, gridBeat, timeVal) {
        for (var i = 0; i < trackArray.length; i += 1) {
            if (gridBeat === trackArray[i]) {
                sndToPlay.play(timeVal);
            }
        }
    }

//================ Schedule Note ==================//
    function scheduleNoteBeat(beatDivisionNumber, time) {

        $("#metro-ui-" + (beatDivisionNumber)).effect("pulsate", {
            times: 1
        }, 10);

        checkIfRecordedAndPlay(track1, kick, beatDivisionNumber, time);
        checkIfRecordedAndPlay(track2, snare, beatDivisionNumber, time);
        checkIfRecordedAndPlay(track3, hihat, beatDivisionNumber, time);
        checkIfRecordedAndPlay(track4, shaker, beatDivisionNumber, time);

        track1.push(track1Que[0]);
        track1Que[0] = undefined;

        track2.push(track2Que[0]);
        track2Que[0] = undefined;

        track3.push(track3Que[0]);
        track3Que[0] = undefined;

        track4.push(track4Que[0]);
        track4Que[0] = undefined;

        currentNote = ++currentNote % values.length;

        scheduleNote((values[beatDivisionNumber-1]), time, beatDivisionNumber -1, mutedArray[beatDivisionNumber-1], accentArray[beatDivisionNumber-1]);
    }

//================ Scheduler ==================//
    function scheduler() {
        while (futureTickTime < audioContext.currentTime + 0.1) {
            scheduleNoteBeat(current16thNote, futureTickTime);// For Beatbox

            futureTick();
        }
        timerID = window.setTimeout(scheduler, 50.0);
    }

//================ Play ==================//
    function play() {
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

    $("#play-button").on("click", function () {
        play();
    });

    $("#tempo").on("change", function () {
        tempo = this.value;
        $("#showTempo").html(tempo);
    });

//================ Grid ==================//
    function sequenceGridToggler(classDomEle, arr) {
        $(classDomEle).on("mousedown", function () {
            // console.log(classDomEle)
            var rhythmicValue = parseInt(this.id.match(/(\d+)$/)[0], 10);
            var index = arr.indexOf(rhythmicValue);
            if (index > -1) {
                arr.splice(index, 1);
                $('#' + this.id).css("background-color", "");
            } else {
                arr.push(rhythmicValue);
                $('#' + this.id).css("background-color", "red");
            }
        });
    }

    sequenceGridToggler(".grid-track1", track1);
    sequenceGridToggler(".grid-track2", track2);
    sequenceGridToggler(".grid-track3", track3);
    sequenceGridToggler(".grid-track4", track4);

});