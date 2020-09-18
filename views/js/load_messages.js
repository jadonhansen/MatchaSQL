window.addEventListener('DOMContentLoaded', (event) => {
	load();
	document.getElementById('messageText').placeholder = 'Type a message...';
	const sendBtn = document.getElementById('sendMsg');
	sendBtn.addEventListener('click', sendMsgFunc);
});

function sendMsgFunc() {
	const msg = document.getElementById('messageText').value;
	const elemID = document.querySelector('.person').getAttribute('id');
	if (msg !== '') {
		document.getElementById('messageText').placeholder = "Sending...";
		const sentMsg = { sendMsg: 'sendMessage', message : msg, id: elemID };
		document.getElementById('messageText').value = '';
		$.ajax({
			type: 'POST',
			url: '/chat',
			data: sentMsg,
			success: function(data) {
				document.getElementById('messageText').placeholder = 'Type a message...';
				load();
			},
			error: function () {
				alert('error sending message!');
				document.getElementById('messageText').placeholder = 'Type a message...';
			}
		});
	}
}

function load() {
	const elementSlct = document.getElementById('personEmail').value;
	// const elementSlct = document.getElementById('personUsername').value;
	let resArr = new Array;
	let merge = new Array;
	let send = { email: elementSlct };
	// let send = { username: elementSlct };

	$.ajax({
		type: 'POST',
		url: '/chat/data',
		data: send,
		success: function(data) {
			if (data[1].length !== 0 || data[0].length !== 0) {

				// merge two arrays and sort by sent time
				merge = data[0].concat(data[1]);
				merge.sort( function (a, b) {
					return a.sort_time - b.sort_time;
				});

				// create chat array in order and by user
				merge.forEach(element => {
					if (element.from == elementSlct) {
						resArr += `<div id=\"text-receive\" class=\"text-left\"><p class=\"mb-0\">${element.message}</p><p class=\"msgInfo\">from ${element.from} at ${element.time}</p></div>`;
					} else {
						resArr += `<div id=\"text-send\" class=\"text-right\"><p class=\"mb-0\">${element.message}</p><p class=\"msgInfo\">from ${element.from} at ${element.time}</p></div>`;
					}
				});
				$('#messages').html(resArr);
				let noRes = '';
				$('#text-none').html(noRes);
			} else {
				let noRes = '<h6 class=\"text-center\">There are no messsages here! Start a chat</h6>';
				$('#text-none').html(noRes);
			}
        },
		error: function () {
			console.log('error loading messages!');
		}
	});
};

setInterval(load, 3000);