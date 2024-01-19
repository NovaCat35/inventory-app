// Use JavaScript to hide the internet-gif after 5.2 seconds
document.addEventListener("DOMContentLoaded", function () {
	const internetGif = document.getElementById("internet-gif");
	const catMarchVideo = document.getElementById("background-video");

	setTimeout(function () {
		internetGif.style.display = "none";
		catMarchVideo.play();
	}, 5200);
});

