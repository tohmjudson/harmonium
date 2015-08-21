$(function () {

scheduleDrumMach = function (current16thNote, time) {
    checkAndPlay(track1, kick, current16thNote, time);
    checkAndPlay(track2, snare, current16thNote, time);
    checkAndPlay(track3, hihat, current16thNote, time);
    checkAndPlay(track4, shaker, current16thNote, time);

    track1.push(track1Que[0]);
    track1Que[0] = undefined;

    track2.push(track2Que[0]);
    track2Que[0] = undefined;

    track3.push(track3Que[0]);
    track3Que[0] = undefined;

    track4.push(track4Que[0]);
    track4Que[0] = undefined;

};

//================ Play  ==================//
checkAndPlay = function (trackArray, sndToPlay, current16thNote, time) {
    for (var i = 0; i < trackArray.length; i += 1) {
        if (current16thNote === trackArray[i]) {
            sndToPlay.play(time);
        }
    }
};

//================ Div Colors ==================//
setDivColors = function (domElementGridNote, arr) {
    for (var i = 0; i < arr.length; i += 1) {
        $(domElementGridNote + arr[i]).css("background-color", "red");
    }
};

setDivColors('#gridBeatTrack1-Rhyth', track1);
setDivColors('#gridBeatTrack2-Rhyth', track2);
setDivColors('#gridBeatTrack3-Rhyth', track3);
setDivColors('#gridBeatTrack4-Rhyth', track4);

//================ Grid ==================//
sequenceGridToggler = function (classDomEle, arr) {
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
};

sequenceGridToggler(".grid-track1", track1);
sequenceGridToggler(".grid-track2", track2);
sequenceGridToggler(".grid-track3", track3);
sequenceGridToggler(".grid-track4", track4);

});