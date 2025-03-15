const videoContainer = document.getElementById("videoContainer");
const video = document.querySelector("video");
const playBtn =document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn =document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange =document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreenBtn");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoControls = document.getElementById("videoControls");

video.volume = 0.5;

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = video.volume;

const handlePlayClick = (event) => {
    if(video.paused) {
        video.play();
    }
    else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
}

const handleMuteClick = (event) => {
    if(video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
}

function handleVolumeChange(event) {
    const {
        target: {value},
    } = event;
    video.volume = value;
    volumeValue = value;
    if(video.volume)  {
        video.muted = false;
        muteBtnIcon.classList = "fas fa-volume-up";
    }
    else {
        video.muted = true;
        muteBtnIcon.classList = "fas fa-volume-mute";
    }
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2, "0")}`;
}

function handleLoadedMetadata() {
    totalTime.innerText = formatTime(video.duration);
    timeline.max = Math.floor(video.duration);
}

function handleTimeUpdate() {
    timeline.value = Math.floor(video.currentTime);
    currentTime.innerText = formatTime(video.currentTime);
}

function handleTimeLineUpdate(event) {
    const { target: {value} } = event;
    video.currentTime = parseFloat(value);
}

function handleFullScreenClick() {
    const fullscreen = document.fullscreenElement
    if(fullscreen) {
        document.exitFullscreen();
    } else {
        videoContainer.requestFullscreen();
    }
}

function handleFullScreenChange() {
    const fullscreen = document.fullscreenElement
    if(!fullscreen) {
        fullScreenIcon.classList = "fas fa-compress";
    } else {
        fullScreenIcon.classList = "fas fa-expand";
    }
}

const hideControles = () => videoControls.classList.remove("showing");

function handleMouseMove() {
    if(controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if(controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControles, 3000);
}

function handleMouseLeave() {
    controlsTimeout = setTimeout(hideControles, 3000)
}

function handleVideoClick() {
    if(video.paused) {
        video.play();
    }
    else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
}

async function handleVideoKeyDown(event) {
    const textareas = document.querySelectorAll("textarea");
    if (textareas.length == 0) return;  
    for (let textarea of textareas) {
        if (document.activeElement === textarea) {
            return ;
        }
    }
    if (!(event.code == "Space")) return;
    event.preventDefault();
    if (video.paused) {
        await video.play();
    }
    else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
}

const handleEnded = () => {
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {
        method:"POST",
    });
};

if (video.readyState >= 1) {
    handleLoadedMetadata();
} else {
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("click", handlePlayClick);
video.addEventListener("ended", handleEnded);
document.addEventListener("keydown", handleVideoKeyDown);
timeline.addEventListener("input", handleTimeLineUpdate);
fullScreenBtn.addEventListener("click", handleFullScreenClick);
videoContainer.addEventListener("fullscreenchange", handleFullScreenChange);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);