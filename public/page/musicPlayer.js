window.onload = () => {
    class MusicPlayer {
        constructor(id) {
            this.id = id;
            this.music = [];
            this.Index = 0;
            this.likeIndex = 0;
            this.likeData = [];
            this.isLike = false;
        }
        // 화면 전환 버튼
        displayMainAndSub() {
            document.getElementById('munuicon').addEventListener('click', () => {
                document.getElementById('Box1').style.display = "none";
                document.getElementById('Box2').style.display = "block";
                this.displayList();
                this.likeBtn();
            });

            document.getElementById('menuUp').addEventListener('click', () => {
                document.getElementById('Box2').style.display = "none";
                document.getElementById('Box1').style.display = "block";
                this.displayList();
                this.likeBtn();
            });
            document.getElementById('likeBtnArea').addEventListener('click', () => {
                document.getElementById('Box1').style.display = "none";
                document.getElementById('Box3').style.display = "block";
                this.displayList();
                this.likeBtn();
            });
            document.getElementById('menuUp2').addEventListener('click', () => {
                document.getElementById('Box1').style.display = "block";
                document.getElementById('Box3').style.display = "none";
                this.displayList();
                this.likeBtn();
            });
        }
        //화면 출력
        display() {
            this.likeBtn();
            // 일반 재생목록 
            if (this.isLike == false) {
                const nowIndex = this.music[this.Index];
                document.getElementById("title").innerHTML = `${nowIndex.title}`;
                document.getElementById("singer").innerHTML = `${nowIndex.singer}`;
                document.getElementById("musicCover").innerHTML = `<img src="../img/${nowIndex.img}">`;
                document.getElementById('musicBox').innerHTML = `<audio src="../music/${nowIndex.song}" id="${nowIndex.song}"></audio>`;
                this.updateUI(nowIndex);
                this.visual(nowIndex);
                musicPlayer.timeupDate(nowIndex);
            }
            // 좋아요 재생목록
            else {
                const nowIndex = this.likeData[this.likeIndex];
                document.getElementById("title").innerHTML = `${nowIndex.title}`;
                document.getElementById("singer").innerHTML = `${nowIndex.singer}`;
                document.getElementById("musicCover").innerHTML = `<img src="../img/${nowIndex.img}">`;
                document.getElementById('musicBox').innerHTML = `<audio src="../music/${nowIndex.song}" id="${nowIndex.song}"></audio>`;
                this.updateUI(nowIndex);
                this.visual(nowIndex);
                musicPlayer.timeupDate(nowIndex);
            }
        }
        // 현재 재생중인 화면
        updateUI(nowIndex) {
            document.getElementById("playingNow_cover").innerHTML = `<img src="../img/${nowIndex.img}">`;
            document.getElementById("playingNow_song").innerHTML = `${nowIndex.title}`;
            document.getElementById("playingNow_singer").innerHTML = `${nowIndex.singer}`;
            document.getElementById("lyrics").innerHTML = `${nowIndex.text}`;
            document.getElementById("playingNow_cover2").innerHTML = `<img src="../img/${nowIndex.img}">`;
            document.getElementById("playingNow_song2").innerHTML = `${nowIndex.title}`;
            document.getElementById("playingNow_singer2").innerHTML = `${nowIndex.singer}`;
        }
        // 캔버스로 음악 왔다리 갔다리
        visual(nowIndex) {
            class Visualizer {
                constructor(id) {
                    this.id = id;
                    this.audioElement = document.getElementById(nowIndex.song);
                    this.canvas = document.getElementById('visualizerCanvas');
                    this.canvasContext = this.canvas.getContext('2d');
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    this.analyser = this.audioContext.createAnalyser();
                    this.source = this.audioContext.createMediaElementSource(this.audioElement);
                    this.bufferLength = this.analyser.frequencyBinCount;
                    this.dataArray = new Uint8Array(this.bufferLength);
                }

                init() {
                    this.source.connect(this.analyser);
                    this.analyser.connect(this.audioContext.destination);
                    this.analyser.fftSize = 512;
                }

                draw = () => {
                    requestAnimationFrame(this.draw);
                    this.analyser.getByteFrequencyData(this.dataArray);

                    // Canvas 초기화
                    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.canvasContext.fillStyle = '#535C91';
                    const barWidth = (this.canvas.width / this.bufferLength) * 3;
                    let x = 0;

                    // 각 데이터를 막대로 표현
                    for (let i = 0; i < this.bufferLength; i++) {
                        const barHeight = this.dataArray[i] / 3;

                        this.canvasContext.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
                        x += barWidth + 3; // 막대 사이의 간격
                    }
                }

                play() {
                    this.audioElement.onplay = () => {
                        if (this.audioContext.state === 'suspended') {
                            this.audioContext.resume();
                        }
                        this.draw(); // 오디오가 실행될 때 시각화 시작
                    };
                }

                run() {
                    // this.audioElement = audioElement;
                    this.init();
                    this.draw();
                    this.play();
                }
            }
            const visualizer = new Visualizer("visualizer");
            visualizer.run();
        }
        // 재생목록 출력
        displayList() {
            // 일반 재생목록
            const listContainer = document.getElementById(`Box2_songs`);
            listContainer.innerHTML = '';
            this.music.forEach((v, i) => {
                listContainer.innerHTML += `
                    <aside id="Box2_song${i + 1}" class="Box2_song">
                        <div class="Shadow_2">
                            <div id="Box2_cover${i + 1}" class="Box2_cover">
                                <img src="../img/${v.img}" class="box2Img">
                            </div>
                        </div>
                        <div class="nameAndSinger">
                            <span id="songname${i + 1}" class="songname">${v.title}</span>
                            <span id="singername${i + 1}" class="singername">${v.singer}</span>
                        </div>
                    </aside>`;
            });
            // 좋아요 재생목록
            const likeContainer = document.getElementById(`Box3_songs`);
            likeContainer.innerHTML = '';
            this.likeData.forEach((v, i) => {
                likeContainer.innerHTML += `
                    <aside id="Box3_song${i}" class="Box2_song">
                        <div class="Shadow_2">
                            <div id="Box3_cover${i}" class="Box2_cover">
                                <img src="../img/${v.img}" class="box2Img">
                            </div>
                        </div>
                        <div class="nameAndSinger">
                            <span id="songname${i}" class="songname">${v.title}</span>
                            <span id="singername${i}" class="singername">${v.singer}</span>
                        </div>
                    </aside>`;
            });
            this.setupPlaylistClick();
        }
        // 클릭했을때 재생목록인지 하트목록인지 설정하고 화면출력 및 재생 
        setupPlaylistClick() {
            this.music.forEach((v, i) => {
                document.getElementById(`Box2_song${i + 1}`).addEventListener('click', () => {
                    this.Index = i;
                    this.isLike = false;
                    this.display();
                    this.playMusic();
                });
            });
            this.likeData.forEach((v, i) => {
                document.getElementById(`Box3_song${i}`).addEventListener('click', () => {
                    console.log(`Box3_song${i}`);
                    this.likeIndex = i;
                    this.isLike = true;
                    this.display();
                    this.playMusic();
                });
            });
        }
        // 가사 출력
        displayLyrics() {
            document.getElementById("lyricsBtn").addEventListener("click", () => {
                document.getElementById("lyricsBox").classList.toggle("displayBox");
            });
        }
        // 음악 재생
        playMusic() {
            // console.log(this.isLike);
            document.getElementById('playBtn').style.display = "none";
            document.getElementById('stopBtn').style.display = "block";
            // 일반 재생
            if (this.isLike == false) {
                const nowIndex = this.music[this.Index];
                const audio = document.getElementById(nowIndex.song);
                console.log(audio);
                if (document.getElementById('stopBtn').style.display == "block") {
                    audio.play();
                    audio.addEventListener('ended', () => {
                        if (document.getElementById('oneSong').style.display == "none") {
                            audio.pause();
                            this.playMusic();
                        }
                        else {
                            this.nextSong();
                        }
                    });
                }
            }
            // 하트목록
            if ((this.isLike == true)) {
                const nowIndex = this.likeData[this.likeIndex];
                const audio = document.getElementById(nowIndex.song);
                // console.log(audio);
                if (document.getElementById('stopBtn').style.display == "block") {
                    audio.play();
                    audio.addEventListener('ended', () => {
                        if (document.getElementById('oneSong').style.display == "none") {
                            audio.pause();
                            this.playMusic();
                        }
                        else {
                            this.nextSong();
                        }
                    });
                }
            }
        }
        // 흘러가는 시간 화면에 출력
        timeupDate(nowIndex) {
            const songRange = document.getElementById("song_range");
            const audio = document.getElementById(nowIndex.song);
            audio.addEventListener('loadedmetadata', () => {
                songRange.max = audio.duration;
                let min = String(Math.floor(audio.duration / 60));
                let sec = String(Math.floor(audio.duration % 60));
                if (min.length == 1) {
                    let zero = '0';
                    min = zero + min;
                } else {
                    min = min;
                }
                if (sec.length == 1) {
                    let zero = '0';
                    sec = zero + sec;
                }
                // 끝나는 시간 넣기
                document.getElementById('endTime').innerHTML = (`${min}:${sec}`);
                if (audio) {

                    songRange.addEventListener('mouseup', () => {
                        audio.currentTime = songRange.value;
                    });
                }
                audio.addEventListener('timeupdate', () => {
                    songRange.value = audio.currentTime;
                    // 0을 추가해서 시간을 깔끔하게 맞추기
                    let min = String(Math.floor(audio.currentTime / 60));
                    let sec = String(Math.floor(audio.currentTime % 60));
                    if (min.length == 1) {
                        let zero = '0';
                        min = zero + min;
                    } else {
                        min = min;
                    }
                    if (sec.length == 1) {
                        let zero = '0';
                        sec = zero + sec;
                    }
                    // 시작하는 시간 넣기
                    document.getElementById('startTime').innerHTML = (`${min}:${sec}`);
                });
            });
        }
        // 노래 멈추기
        stopMusic() {
            document.getElementById('playBtn').style.display = "block";
            document.getElementById('stopBtn').style.display = "none";
            if (this.isLike == false) {
                const nowIndex = this.music[this.Index];
                const audio = document.getElementById(nowIndex.song);
                if (audio) {
                    audio.pause();
                }
            }
            else {
                const nowIndex = this.likeData[this.likeIndex];
                const audio = document.getElementById(nowIndex.song);
                if (audio) {
                    audio.pause();
                }
            }
        }
        nextSong() {
            //  like 아닌 그냥 일반 재생목록의 다음곡 재생
            if (this.isLike == false) {
                const nowIndex = this.music[this.nowIndex];
                if (document.getElementById("randomBtn").classList.contains("inside")) {
                    let randomNum = (Math.floor(Math.random() * (this.music.length + 1)));
                    if (this.Index == randomNum) {
                        this.Index = randomNum + 1;
                        this.display();
                        this.playMusic();
                    }
                    else {
                        this.Index = randomNum;
                        this.display();
                        this.playMusic();
                    }
                }
                else {
                    if (this.Index < this.music.length - 1) {
                        this.Index++;
                    } else {
                        this.Index = 0;
                    }
                    this.display();
                    this.playMusic();
                }
            }
            // 하트목록의 다음곡 재생
            if (this.isLike == true) {
                const nowIndex = this.likeData[this.nowIndex];
                if (document.getElementById("randomBtn").classList.contains("inside")) {
                    let randomNum = (Math.floor(Math.random() * (this.likeData.length + 1)));
                    if (this.likeIndex == randomNum) {
                        this.likeIndex = randomNum + 1;
                        this.display();
                        this.playMusic();
                    }
                    else {
                        this.likeIndex = randomNum;
                        this.display();
                        this.playMusic();
                    }
                }
                else {
                    if (this.likeIndex < this.likeData.length - 1) {
                        this.likeIndex++;
                    } else {
                        this.likeIndex = 0;
                    }
                    this.display();
                    this.playMusic();
                }
            }

        }

        prevSong() {
            // 일반 이전곡
            if (this.isLike == false) {
                const nowIndex = this.music[this.Index];
                if (this.Index > 0) {
                    this.Index--;
                } else {
                    this.Index = this.music.length - 1;
                    // 0 보다 작으면 마지막으루 ~
                }
                this.display();
                this.playMusic();
            }
            // 하트 이전곡
            else {
                const nowIndex = this.likeData[this.likeIndex];
                if (this.likeIndex > 0) {
                    this.likeIndex--;
                } else {
                    this.likeIndex = this.likeData.length - 1;
                    // 0 보다 작으면 마지막으루 ~
                }
                this.display();
                this.playMusic();
            }
        }

        againSong() {
            document.getElementById('oneSong').addEventListener('click', () => {
                document.getElementById('oneSong').style.display = "none";
                document.getElementById('againSong').style.display = "block";
                document.getElementById('againSong').classList.add("inside");
            });
            document.getElementById('againSong').addEventListener('click', () => {
                document.getElementById('againSong').style.display = "none";
                document.getElementById('oneSong').style.display = "block";
            });
        }
        randomPlay() {
            document.getElementById("randomBtn").addEventListener("click", () => {
                document.getElementById("randomBtn").classList.toggle("inside");
            });
        }

        likeBtn() {
            const nowIndex = this.music[this.Index];
            // 만약 이미 좋아요 눌려있으면 이미 눌린 상태
            if (nowIndex.like == 1) {
                document.getElementById('dontlike').style.display = "none";
                document.getElementById('like').style.display = "inline-block";
            } else {
                document.getElementById('like').style.display = "none";
                document.getElementById('dontlike').style.display = "inline-block";
            }
            document.getElementById('dontlike').addEventListener('click', () => {
                document.getElementById('dontlike').style.display = "none";
                document.getElementById('like').style.display = "inline-block";
                this.likeDbData();
            });
            document.getElementById('like').addEventListener('click', () => {
                document.getElementById('like').style.display = "none";
                document.getElementById('dontlike').style.display = "inline-block";
                this.dontlikeDbData();
            });
        }
        // 좋아요 누른 DB 업뎃
        async likeDbData() {
            const nowIndex = this.music[this.Index];
            // console.log(nowIndex.id);
            try {
                const response = await fetch('http://kkms4001.iptime.org:45170/like', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: nowIndex.id }),
                });
                const data = await response.json();
                this.music = data.map((song) => ({
                    id: song.id,
                    singer: song.singer,
                    title: song.title,
                    img: song.img,
                    song: song.song,
                    text: song.text,
                    like: song.like
                }));
                // console.log(this.music);
                this.likeData = this.music.filter(song => song.like === "1");
                // console.log(this.likeData);
            } catch (err) {
                console.error("에러 발생:", err);
            }
        }
        // 좋아요 해제하면 다시 업뎃 
        async dontlikeDbData() {
            const nowIndex = this.music[this.Index];
            // console.log(nowIndex.id);
            try {
                const response = await fetch('http://kkms4001.iptime.org:45170/dontlike', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: nowIndex.id }),
                });
                const data = await response.json();
                this.music = data.map((song) => ({
                    id: song.id,
                    singer: song.singer,
                    title: song.title,
                    img: song.img,
                    song: song.song,
                    text: song.text,
                    like: song.like
                }));
                // console.log(this.music);
                this.likeData = this.music.filter(song => song.like === "1");
                // console.log(this.likeData);
            } catch (err) {
                console.error("에러 발생:", err);
            }
        }
        // 최초로 DB 값 받아오기 ,  컨트롤 부분
        async control() {
            try {
                const response = await fetch("http://kkms4001.iptime.org:45170/data");
                const data = await response.json();
                this.music = data.map((song) => ({
                    id: song.id,
                    singer: song.singer,
                    title: song.title,
                    img: song.img,
                    song: song.song,
                    text: song.text,
                    like: song.like
                }));
                // console.log(this.music);
                this.likeData = this.music.filter(song => song.like === "1");
                // console.log(this.likeData);
                this.display();
                this.displayList();
                this.displayLyrics();
                this.displayMainAndSub();
                this.randomPlay();
                this.againSong();
                this.likeBtn();
                document.getElementById("nextSong").addEventListener("click", () => this.nextSong());
                document.getElementById("previousSong").addEventListener("click", () => this.prevSong());
                document.getElementById('playBtn').addEventListener('click', () => this.playMusic());
                document.getElementById('stopBtn').addEventListener('click', () => this.stopMusic());

            } catch (error) {
                console.error('Error loading music data:', error);
            }
        }
    }
    const musicPlayer = new MusicPlayer("musicPlayer");
    musicPlayer.control();
};
