// Use JavaScript to hide the internet-gif after 5.3 seconds
document.addEventListener("DOMContentLoaded", function () {
	const internetGif = document.getElementById("internet-gif");

	setTimeout(function () {
		internetGif.style.display = "none";
	}, 5300);
});
