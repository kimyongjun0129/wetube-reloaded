const video = document.querySelector("video");
const playBtn =document.getElementById("play");
const muteBtn =document.getElementById("mute");
const time =document.getElementById("time");
const volumeRange =document.getElementById("volume");

const save_volume = volumeRange.value;

const handlePlayClick = (event) => {
    if(video.paused) {
        video.play();
    }
    else {
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Pause";
}

const handleMuteClick = (event) => {
    if(video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    volumeRange.value = video.muted ? 0 : save_volume;
}


playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
