const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
	navigator.mediaDevices.getUserMedia({ video: true, audio: false})
		.then(localMediaStream =>{
			console.log(localMediaStream);
			video.srcObject = localMediaStream;
			video.play();
		})
		.catch(err =>{
			console.error('OH NO!!!',err);
		})
}

function paintToCanvas(){
	const width = video.videoWidth;
	const height = video.videoHeight;
	canvas.width = width;
	canvas.height = height;

	return setInterval(() => {
		ctx.drawImage(video, 0, 0, width, height);
		let pixels = ctx.getImageData(0, 0, width, height);
		//pixels = greenScreen(pixels);
		pixels = rgbSplit(pixels);
		//ctx.globalAlpha = 0.01;
		ctx.putImageData(pixels, 0, 0);
	},16)
}
function takePhoto(){
	snap.currentTime = 0;
	snap.play();

	const data = canvas.toDataURL('image/png');
	const link = document.createElement('a');
	link.href = data;
	link.setAttribute('download', 'test');
	link.textContent = 'Download Image';
	link.innerHTML = `<img src="${data}" alt="test">`;
	strip.insertBefore(link, strip.firstChild);
}
function redEffect(pixels){
	for(let i=0;i<pixels.data.length;i+=4){
		pixels.data[i + 0] = pixels.data[i + 0] + 200;
		pixels.data[i + 1] = pixels.data[i + 1] + 50;
		pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
 	}
 	return pixels;
}
function rgbSplit(pixels){
	for(let i=0;i<pixels.data.length;i+=4){
		pixels.data[i - 150] = pixels.data[i + 0];
		pixels.data[i + 500] = pixels.data[i + 1];
		pixels.data[i - 550] = pixels.data[i + 2];
 	}
 	return pixels;
}
function greenScreen(pixels){
	const levels = {};
	document.querySelectorAll('.rgb input').forEach((input) => {
		levels[input.name] = input.value;
	})

	for(let i=0;i < pixels.data.length;i+=4){
		let red = pixels.data[i + 0];
		let green = pixels.data[i + 1];
		let blue = pixels.data[i + 2];
		let alpha = pixels.data[i + 3];

		if(red >= levels.rmin && red <= levels.rmax
			& green >= levels.gmin && green <= levels.gmax
			&& blue >= levels.bmin && blue <= levels.bmax){
			pixels.data[i + 3] = 0;
		}
	}
	return pixels;
}
getVideo();

video.addEventListener('canplay',paintToCanvas);