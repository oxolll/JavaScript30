/* Get Our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullScreen = player.querySelector('.fullscreen');

/* Build out functions */
function togglePlay(){
	video.paused ? video.play() : video.pause();
}

function updateButton(){
	toggle.textContent = video.paused ? '►' : '❚ ❚';
}

function skip(){
	video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate(){
	video[this.name] = this.value;
}

function handleProgress(){
	const percent = (video.currentTime / video.duration)*100;
	progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e){
	const scrubTime = (e.offsetX / progress.offsetWidth)* video.duration;
	video.currentTime = scrubTime;
}

function enterFS() {
  if (player.requestFullscreen) {
    player.requestFullscreen();
  } else if (player.msRequestFullscreen) {
    player.msRequestFullscreen();
  } else if (player.mozRequestFullScreen) {
    player.mozRequestFullScreen();
  } else if (player.webkitRequestFullscreen) {
    player.webkitRequestFullscreen();
  }
}

function exitFS() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function fs(){
	let onOrOff = this.classList.contains('on');

	if(onOrOff){
		enterFS();
		this.classList.remove('on');
		this.classList.add('off');
	}
	else{
		exitFS();
		this.classList.remove('off');
		this.classList.add('on');
	}
}
video.addEventListener('click',togglePlay);
video.addEventListener('play',updateButton);
video.addEventListener('pause',updateButton);
video.addEventListener('timeupdate',handleProgress);

toggle.addEventListener('click',togglePlay);

skipButtons.forEach(skipButton => skipButton.addEventListener('click',skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove',handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click',scrub);
progress.addEventListener('mousemove',(e) => mousedown && scrub(e));
progress.addEventListener('mousedown',() => mousedown = true);
progress.addEventListener('mouseup',() => mousedown = false);

fullScreen.addEventListener('click',fs);

