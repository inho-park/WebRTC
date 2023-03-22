// audio, button 태그
const $audio = document.querySelector("audio");
const $btn = document.querySelector("button");

// 녹음 상태 확인용 변수
let isRecording = false;

// MediaRecorder 변수 생성
let mediaRecorder = null;

// 녹음 데이터 (Blob) 조각 저장 배열
const audioArray = [];

// 녹음 시작/종료 버튼 클릭 시 이벤트 처리
$btn.onclick = async function(event) {

    // 녹음 중이 아닌 경우에만 녹음 시작 처리
    if(!isRecording) {

        // 마이크 mediaStream 생성 : Promise 를 반환하므로 async/await 사용
        const mediaStream = await navigator.mediaDevices.getUserMedia({audio: true});

        // MediaRecorder 생성 : 마이크 MediaStream 을 인자로 사용
        mediaRecorder = new MediaRecorder(mediaStream);

        // 이벤트핸들러 : 녹음 데이터 얻기
        mediaRecorder.ondataavailable = (event) => {
            audioArray.push(event.data) 
        }

        // 이벤트핸들러 : 녹음 종료 처리 & 재생하기
        mediaRecorder.onstop = (event) => {

            // 녹음이 종료되면, 배열에 담긴 오디오 데이터(Blob)들을 합침 ( 코덱도 설정해줌 )
            const blob = new Blob(audioArray, {"type": "audio/ogg codecs=opus"});
            audioArray.splice(0); // 기존 오디오 데이터들은 모두 비워 초기화

            // Blob 데이터에 접근할 수 있는 객체 url 생성
            const blobURL = window.URL.createObjectURL(blob);

            // audio 요소 재생
            $audio.src = blobURL;
            $audio.play();
        }

        // 녹음 시작
        mediaRecorder.start();
        isRecording = true;
    
    }else {
        // 녹음 종료
        mediaRecorder.stop();
        isRecording = false;
    }
}