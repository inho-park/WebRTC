// video 요소
const $video = document.querySelector("video");

// 카메라 MediaStream 얻기
navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
}).then((mediaStream) => {
    $video.srcObject = mediaStream;
    $video.onloadedmetadata = (event) => {
        $video.play();
    };
}).catch((err) => {
    console.error(` Error occured : ${err}`);
});