// audio 요소
const $audio = document.querySelector("audio");

// 마이크 MediaStream 취득 (audio 를 true 로 설정)
navigator.mediaDevices.getUserMedia({
    audio: true
}).then((mediaStream) => {
    // Promise 이므로 then 으로 받아서 사용 (async/await 를 사용해야 한다)

    // 마이크에서 입력받은 MediaStream 으로 오디오 재생
    $audio.srcObject = mediaStream;
    $audio.onloadedmetadata = (event) => {
        $audio.play();
    };
}).catch((err) => {
    console.error(`에러 발생 : ${err}`);
});