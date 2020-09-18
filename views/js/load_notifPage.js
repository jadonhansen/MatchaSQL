window.addEventListener('DOMContentLoaded', (event)  => {
	fetch_notifs();
});

function removeNotif(notifID) {

	const notifSend = { id : notifID };
	$.ajax({
		type: 'POST',
		url: '/live_notifications/remove_notif',
		data: notifSend,
		success: function (data) {
			fetch_notifs();
		},
		error: function () {
			console.log('error deleting notification: ', notifID);
		}
	});
}

function updateRead() {
	$.ajax({
		type: 'GET',
		url: '/live_notifications/update_read',
		success: function (data) {
			fetch_notifs();
		},
		error: function () {
			alert('Error updating read notifications!');
		}
	});
}

function fetch_notifs() {
	notifArr = new Array;
	oldNotifArr = new Array;

	$.ajax({
		type: 'POST',
		url: '/live_notifications',
		success: function (data) {
			// new notifications
			if (data.new.length !== 0) {
				data.new.slice().reverse().forEach(element => {
					notifArr += `<div class=\"alert alert-info alert-dismissible fade show pb-0\" role="alert">
									<strong class=\"mr-2\">${element.name}</strong><small>${element.time}</small>
									<p class=\"mb-3 notifContent\">${element.content}</p>
								</div>`;
				});
				if (data.new.length == 1)
				heading = `<h6>You have ${data.new.length} unread notification:</h6>
							<button id="clear" class="badge badge-light pt-1 pb-1 mb-1" name="clear">Mark all as read</button>
							<hr>`;
				else
				heading = `<h6>You have ${data.new.length} unread notifications:</h6>
							<button id="clear" class="badge badge-light pt-1 pb-1 mb-1" name="clear">Mark all as read</button>
							<hr>`;
				$('#notifHead').html(heading);
				$('#notifBox').html(notifArr);
				const btnClear = document.getElementById('clear');
				btnClear.addEventListener('click', updateRead);
			} else {
				heading = `<h6>No new notifications :)</h6><hr>`;
				$('#notifHead').html(heading);
			}
			// old notifications
			if (data.old.length !== 0) {
				if (data.new.length == 0) {
					notifArr = '';
					$('#notifBox').html(notifArr);
				}
				data.old.slice().reverse().forEach(element => {
					oldNotifArr += `<div class=\"alert alert-info alert-dismissible fade show pb-0\" role="alert">
										<strong class=\"mr-2\">${element.name}</strong><small>${element.time}</small>
										<button class=\"close\" type="button" onclick="removeNotif('${element._id}')">
											<span aria-hidden="true">&times;</span>
										</button>
										<p class=\"mb-3 notifContent\">${element.content}</p>
										</form>
									</div>`;
				});
				if (data.old.length == 1)
					heading = `<h6>You have ${data.old.length} read notification:</h6><hr>`;
				else
					heading = `<h6>You have ${data.old.length} read notifications:</h6><hr>`;
				$('#oldNotifHead').html(heading);
				$('#oldNotifBox').html(oldNotifArr);
			} else {
				heading = '';
				$('#oldNotifHead').html(heading);
			}
		},
		error: function () {
			console.log('error loading notifications!');
		}
	});
}

setInterval(fetch_notifs, 3000);