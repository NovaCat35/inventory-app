// Use JavaScript to hide the internet-gif after 5.2 seconds
document.addEventListener("DOMContentLoaded", function () {
	const internetGif = document.getElementById("internet-gif");
	const catMarchVideo = document.getElementById("background-video");
	const fuzzyOverlay = document.querySelector(".fuzzy-overlay");
	const volumeBtn = document.querySelector(".volume-btn");
	const sound = new Audio("../images/cat-march.mp3");

	let isSoundOn = false;
	let volumeDisabled = true;

	/**
	 * Flash when: inactive & disabled
	 */
	volumeBtn.addEventListener("click", () => {
		if (volumeDisabled) return; // volume btn not available yet
		if (isSoundOn) {
			sound.pause();
		} else {
			sound.play();
		}
		volumeBtn.classList.toggle("video-playing");
		isSoundOn = !isSoundOn;
	});

	setTimeout(function () {
		// Cancel initial overlays
		internetGif.style.display = "none";
		fuzzyOverlay.style.display = "none";

		// activate volume btn
		volumeDisabled = false;
		volumeBtn.classList.remove("disable");
		volumeBtn.classList.add("active");

		// play sound with loop
		sound.loop = true;
		catMarchVideo.play();
	}, 5200);
});
