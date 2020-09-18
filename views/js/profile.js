window.addEventListener('DOMContentLoaded', (event) => {

	// adding and removing overlays to gear (personal profile)
	document.getElementById("alter-bio").addEventListener("mouseover", () => applyOverlay("alter-bio"));
	document.getElementById("alter-bio").addEventListener("mouseout", () => removeOverlay("alter-bio"));

	// adding and removing overlays to images
	document.getElementById("main-profile-img").addEventListener("mouseover", () => applyOverlay("main-profile-img"));
	document.getElementById("main-profile-img").addEventListener("mouseout", () => removeOverlay("main-profile-img"));

	document.getElementById("profile-img-two").addEventListener("mouseover", () => applyOverlay("profile-img-two"));
	document.getElementById("profile-img-two").addEventListener("mouseout", () => removeOverlay("profile-img-two"));

	document.getElementById("profile-img-three").addEventListener("mouseover", () => applyOverlay("profile-img-three"));
	document.getElementById("profile-img-three").addEventListener("mouseout", () => removeOverlay("profile-img-three"));

	document.getElementById("profile-img-four").addEventListener("mouseover", () => applyOverlay("profile-img-four"));
	document.getElementById("profile-img-four").addEventListener("mouseout", () => removeOverlay("profile-img-four"));

	document.getElementById("profile-img-five").addEventListener("mouseover", () => applyOverlay("profile-img-five"));
	document.getElementById("profile-img-five").addEventListener("mouseout", () => removeOverlay("profile-img-five"));
});

function applyOverlay(id) {
	document.getElementById(id).style.opacity = "0.5";
}

function removeOverlay(id) {
	document.getElementById(id).style.opacity = "1";
}
