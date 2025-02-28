import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util';

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg",
}

const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
}

const handleDownload = async () => {
    actionBtn.removeEventListener("click", handleDownload);
    actionBtn.innerText = "Transcording....";
    actionBtn.disabled = true;
    const ffmpeg = new FFmpeg();
    await ffmpeg.load({
        corePath: '/node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js',
    });

    try
    {
        ffmpeg.writeFile(files.input, await fetchFile(videoFile));
        await ffmpeg.exec(["-i", files.input, "-r", "60", files.output]);
        const mp4File = await ffmpeg.readFile(files.output);
        const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
        const mp4Url = URL.createObjectURL(mp4Blob);

        downloadFile(mp4Url, "MyRecording.mp4");

        ffmpeg.deleteFile(files.output);
        URL.revokeObjectURL(mp4Url);
    }
    catch (error) {
        console.log("video:" + error)
    }


    try
    {
        await ffmpeg.exec(["-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb]);
        const thumbFile = await ffmpeg.readFile(files.thumb);
        const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
        const thumbUrl = URL.createObjectURL(thumbBlob);

        downloadFile(thumbUrl, "MyThumbnail.jpg");

        ffmpeg.deleteFile(files.thumb);
        URL.revokeObjectURL(thumbFile);
    }
    catch(error) {
        console.log("thumbnail:" + error)
    }

    ffmpeg.deleteFile(files.input);
    URL.revokeObjectURL(videoFile);

    actionBtn.disabled = false;
    actionBtn.innerText = "Record Again";
    init();
    actionBtn.addEventListener("click", handleStart);
};

const handleStop = () => {
    actionBtn.innerText = "Download Recording";
    actionBtn.removeEventListener("click", handleStop);
    actionBtn.addEventListener("click", handleDownload);

    recorder.stop();
}

const handleStart = () => {
    actionBtn.innerText = "Stop Recording";
    actionBtn.removeEventListener("click", handleStart);
    actionBtn.addEventListener("click", handleStop);

    recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.ondataavailable = (event) => {
      videoFile = URL.createObjectURL(event.data);
      video.srcObject = null;
      video.src = videoFile;
      video.loop = true;
      video.play();
    };
    recorder.start();
}

const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    });
    video.srcObject = stream;
    video.play();
}

init();

actionBtn.addEventListener("click", handleStart);