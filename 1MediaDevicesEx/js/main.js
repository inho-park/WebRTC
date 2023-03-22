// 권한 승인 요소 => 권한을 승인하면 Promise<MediaStream> 객체 반환
// Promise 를 반환하므로 then() 으로 받아서 사용하거나 async/await 사용해야함
// navigator.mediaDevices.getUserMedia({
//     audio:true,
//     video:false
// });


// video 태그 취득
const $video = document.querySelector('video');

// MediaStream 생성(마이크+카메라)
navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
        width: 1280, // 영상 넓이 설정 가능
        height: 720,
        facingMode: "user" // 전면 카메라 사용 = user , 후면 카메라는 environment
    }
}).then(function(mediaStream) {
    // Promise이므로 then으로 받아서 처리
    
    // 입력받은 MediaStream을 그대로 video태그에 적용
    $video.srcObject = mediaStream;
    
    // 재생 처리
    $video.onloadedmetadata = function(e) {
        $video.play();
    };
}).catch(function(err) {
         console.log(err.name + ": " + err.message); 
});