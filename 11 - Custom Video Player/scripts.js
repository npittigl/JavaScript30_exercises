// 1. Get our elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// 2. Build out functions

// toggle play function
function togglePlay() {
    // alternative way to code it:
    // const method = video.paused ? 'play' : 'pause';
    // video[method]();

    // 'paused' is a property on video element
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

// skip function
function skip() {
    // currentTime is property on video element
    // 'this' keyword = skip button
    // .dataset.skip is property on skip button element & holds value of skip value, which is a string => use parseFloat to convert to a true number
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
    // 'name' & 'playback rate' are the two properties we need to update on video element
    // this.name will either be 'name' or 'playback rate'
    video[this.name] = this.value;
}

// function for progress bar
function handleProgress() {
    // updating the flexbasis value in %
    // first calculate the percentage using data from video properties '.currentTime' & '.duration'
    const percent = (video.currentTime / video.duration) * 100;

    // use value of 'percent' to update css styling on progress bar
    progressBar.style.flexBasis = `${percent}%`;
}

// scrub function
function scrub(event) {
    // event = click on progress bar
    // use event's offset X property - tells you how many pixels you've clicked into the bar
    // progress.offsetWidth = total width of progress bar in px
    const scrubTime = (event.offsetX / progress.offsetWidth) * video.duration;

    // udpate video's time so it plays part where user clicked on progress bar
    video.currentTime = scrubTime;
}

// listen for when video is paused to change 'play' symbol to 'pause' symbol
function updateButton() {
    // cans use 'this' keyword b/c bound to video element
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

// 3. Hook up the event listeners

// event listener to toggle play/pause on video whenever something causes video to pause
video.addEventListener('click', togglePlay);

// event listener to toggle play/pause when button clicked
toggle.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);

// event listener to update play/pause icons
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

// event listener to skip video back/ahead
skipButtons.forEach(button => button.addEventListener('click', skip));

// event listener for range sliders
ranges.forEach(slider => slider.addEventListener('change', handleRangeUpdate));

ranges.forEach(slider => slider.addEventListener('mousemove', handleRangeUpdate));

// we want progress bar to update every so often so we want to listen for video element to emit an event called 'time update', and when that happens we will run handleProgress function
video.addEventListener('timeupdate', handleProgress);

// add event listener to progress element (video progress bar) to listen for 'scrub' events:

// use a flag variable -> set it to FALSE; when mouse clicks (mouseup) set it to TRUE
let mousedown = false;

// listen for click on video bar
progress.addEventListener('click', scrub);

// listen for drag & drop of video bar
progress.addEventListener('mousemove', (event) => mousedown && scrub(event));
// when user moves mouse, it checks if mousedown variable is TRUE, if it is true, then it fires the scrub function
// if variable is false, it will return false and not fire the scrub function
// scrub fn requires the initial event of when this happened on mousemove, we need to pass event in the arrow function above and pass it in scrub function

progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

// progress.addEventListener('mousemove', () => {
//     if(mousedown) {
//         scrub();
//     }
// });

// challenge: add another button that turns video full screen