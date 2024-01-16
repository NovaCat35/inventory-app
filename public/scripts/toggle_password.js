/**
 * Goal: to hide/unhide password text with eye-icon
 */
const eyeIcon = document.querySelector(".eye-icon");
const passInput = document.getElementById("password");
eyeIcon.addEventListener("click", () => {
	// Unhide password and display close-eye icon
	if (passInput.type === "password") {
		passInput.type = "text";
		eyeIcon.src = "/images/eye-off.svg";
	} else {
		passInput.type = "password";
		eyeIcon.src = "/images/eye.svg";
	}
});
