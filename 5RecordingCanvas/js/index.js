    // 요소 가져오기
    const $canvas = document.querySelector("#canvas");
    const $video = document.querySelector("#video")
    const $btn_start = document.querySelector("#btn_start");
    const $btn_stop = document.querySelector("#btn_stop");
    const $video_recorded = document.querySelector("#video_recorded");
    const ctx = $canvas.getContext('2d');

    // MediaRecorder(녹화기) 변수 선언
    let mediaRecorder = null;

    // 스트림 데이터를 담아둘 배열 생성
    const arrVideoData = [];
    const arrAudioData = [];

    // "녹화시작" 버튼 이벤트 처리
    $btn_start.onclick = (event)=> {

        // 캔버스 영역 화면을 스트림으로 취득
        const mediaStream = $canvas.captureStream();
        const audioStreamTrack = $video.captureStream().getAudioTracks()[0];
        const audioStream = new MediaStream();
        audioStream.addTrack(audioStreamTrack);

        // MediaRecorder(녹화) 객체 생성
        mediaRecorder = new MediaRecorder(mediaStream);
        audioRecorder = new MediaRecorder(audioStream);

        // MediaRecorder.dataavailable 이벤트 처리
        mediaRecorder.ondataavailable = (event)=>{
            // 스트림 데이터(Blob)가 들어올 때마다 배열에 담아둔다
            arrVideoData.push(event.data);
        };
        audioRecorder.ondataavailable = (event) => { arrAudioData.push(event.data)};

        // MediaRecorder.stop 이벤트 처리
        mediaRecorder.onstop = (event)=>{
            // 들어온 스트림 데이터들(Blob)을 통합한 Blob객체를 생성
            const blob = new Blob(arrVideoData);

            // BlobURL 생성: 통합한 스트림 데이터를 가르키는 임시 주소를 생성
            const blobURL = window.URL.createObjectURL(blob);
            console.log(blobURL);
            // 재생 구현
            $video_recorded.src = blobURL;
            $video_recorded.play();

            // 다운로드 구현
            const $anchor = document.createElement("a"); // 앵커 태그 생성
            document.body.appendChild($anchor);
            $anchor.style.display = "none";
            $anchor.href = blobURL; // 다운로드 경로 설정
            $anchor.download = "test.webm"; // 파일명 설정
            $anchor.click(); // 앵커 클릭
            
            // 배열 초기화
            arrVideoData.splice(0);
        }

        audioRecorder.onstop = (event) => {
            const blob = new Blob(arrAudioData);

            const blobURL = window.URL.createObjectURL(blob);
            const $anchor2 = document.createElement("a");
            document.body.appendChild($anchor2);
            $anchor2.style.display = "none";
            $anchor2.href = blobURL;
            $anchor2.download = "test.mp3";
            $anchor2.click();
        }

        // 녹화 시작
        mediaRecorder.start(); 
        audioRecorder.start();
    }


    // "녹화종료" 버튼 이벤트 처리
    $btn_stop.onclick = (event)=>{

        // 녹화 중단!
        mediaRecorder.stop(); 
        audioRecorder.stop();
    }



if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then( (stream) => { 
        
        //마우스 움직임 정보를 담아두는 구간 입니다.
        const moveArray = [];
        $canvas.addEventListener('mousemove', function (event) {
            var x = event.clientX - $canvas.offsetLeft;
            var y = event.clientY - $canvas.offsetTop;
            moveArray.push({x, y});
        }); 

        //비디오에 스트림을 넣습니다.
        $video.srcObject = stream
        $video.play()
        
        //동영상이 재생되면 인터벌함수를 통해 캔버스에 putImage를 해 줍니다.
        $video.addEventListener('play', ()=>{

           setInterval(()=>{
               //초기화
               ctx.clearRect(0,0,$canvas.width, $canvas.height);
               ctx.save();
               ctx.beginPath();
                    
               //비디오 이미지 먼저 그려줍니다.
               ctx.drawImage($video, 0, 0, $canvas.width, $canvas.height);

               //마우스가 움직인 정보값을 점 찍어 봅니다.
               moveArray.forEach( (data)=> {
                   ctx.save();
                   ctx.beginPath();
                   ctx.arc(data.x, data.y, 10, (Math.PI / 180) * 0,  (Math.PI / 180) * 360, false);
                   ctx.fillStyle = 'blue';
                   ctx.fill();
                   ctx.closePath();
                   ctx.restore();                        
               });

            },1)

        }, false);
    })
    .catch( (error)=>{
          console.log(error);
    });
};

