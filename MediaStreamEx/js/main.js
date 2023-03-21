// video 태그 취득
const $video = document.querySelector('video');
    
// MediaStream 생성(마이크+카메라)
navigator.mediaDevices.getUserMedia({
    audio: true, 
    video: true
}).then(function(mediaStream) {
    // Promise이므로 then으로 받아서 처리
    
    // MediaStream 에서 비디오, 오디오 MediaStreamTrack 각각 추출
    const videoTracks = mediaStream.getVideoTracks()
    const audioTracks = mediaStream.getAudioTracks()
    
    // 비디오 MediaStreamTrack으로만 구성된 새로운 MediaStream 생성(무음 영상)
    const mediaStreamAudioX = new MediaStream(videoTracks);
    
    // 입력받은 MediaStream을 그대로 video태그에 적용
    $video.srcObject = mediaStream;
    
    // 재생 처리
    $video.onloadedmetadata = function(e) {
        $video.play();
    };

}).catch(function(err) {
     console.log(err.name + ": " + err.message); 
});
