window.addEventListener('DOMContentLoaded', (event) => {
	loadNotifs();
});

setInterval(loadNotifs, 2000);

function loadNotifs() {

	$.ajax({
		type: 'GET',
		url: '/live_notifications',
		success: function(data) {
			if (data !== undefined) {
				let notifs = `<i class=\"fas fa-bell mt-1\"></i><span class=\"badge badge-dark\">${data}</span>`;
				$('#notifBell').html(notifs);
			} else {
				console.log('no data recieved - notifications');
			}
        },
		error: function () {
			console.log('error loading notifications!');
		}
	});
}