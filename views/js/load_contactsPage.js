window.addEventListener('DOMContentLoaded', (event)  => {
	heading = `<strong class=\"notif-heading mb-2\">Loading chats...</strong>`;
	$('#heading').html(heading);
	fetch_contacts();
});

function removeChat(chatterEmail) {

	const chatSend = { email : chatterEmail };
	$.ajax({
		type: 'POST',
		url: '/contacts/remove_chat',
		data: chatSend,
		success: function(data) {
			fetch_contacts();
		},
		error: function() {
			console.log('error deleting contact/chat: ', chatID);
		}
	});
}

function fetch_contacts() {

	let chatArr = new Array;
	let heading;
	let subHeading;

	$.ajax({
		type: 'GET',
		url: '/contacts/live_contacts',
		success: function (ret) {
			if (ret.contactArr.length !== 0) {
				ret.contactArr.forEach(element => {
					if (element.main_image) {
						if (element.bio) {
							chatArr += `<form action="matched_profile" method="post" id=${element._id}>
											<input type="hidden" name="unique" value="1" />
											<input type="hidden" name="_id" value=${element._id} />
											<div class="alert alert-primary alert-dismissible fade show ml-4 mr-4" role="alert">
												<div class="media">
													<a href="javascript: submitform('${element._id}')">
														<img class="rounded mr-2 search-profile" src="data:image/*;base64,${element.main_image}" alt="profile_image"/>
													</a>
													<div class="media-body">
														<a href="javascript: submitform('${element._id}')">
															<strong class="custom-username">${element.username}</strong>
														</a>
														<p class="search-profile-descrip mb-0">${element.bio}</p>
													</div>
												</div>
												<button class=\"close\" type="button" onclick="removeChat('${element.email}')">
													<span aria-hidden="true">&times;</span>
												</button>
											</div>
										</form>`;
						} else {
							chatArr += `<form action="matched_profile" method="post" id=${element._id}>
											<input type="hidden" name="unique" value="1" />
											<input type="hidden" name="_id" value=${element._id} />
											<div class="alert alert-primary alert-dismissible fade show ml-4 mr-4" role="alert">
												<div class="media">
													<a href="javascript: submitform('${element._id}')">
														<img class="rounded mr-2 search-profile" src="data:image/*;base64,${element.main_image}" alt="profile_image"/>
													</a>
													<div class="media-body">
														<a href="javascript: submitform('${element._id}')">
															<strong class="custom-username">${element.username}</strong>
														</a>
													</div>
												</div>
												<button class=\"close\" type="button" onclick="removeChat('${element.email}')">
													<span aria-hidden="true">&times;</span>
												</button>
											</div>
										</form>`;
						}
					} else {
						if (element.bio) {
							chatArr += `<form action="matched_profile" method="post" id=${element._id}>
											<input type="hidden" name="unique" value="1" />
											<input type="hidden" name="_id" value=${element._id} />
											<div class="alert alert-primary alert-dismissible fade show ml-4 mr-4" role="alert">
												<div class="media">
													<a href="javascript: submitform('${element._id}')">
														<img class="rounded mr-2 search-profile" src="user.jpg" alt="profile_image"/>
													</a>
													<div class="media-body">
														<a href="javascript: submitform('${element._id}')">
															<strong class="custom-username">${element.username}</strong>
														</a>
														<p class="search-profile-descrip mb-0">${element.bio}</p>
													</div>
												</div>
												<button class=\"close\" type="button" onclick="removeChat('${element.email}')">
													<span aria-hidden="true">&times;</span>
												</button>
											</div>
										</form>`;
						} else {
							chatArr += `<form action="matched_profile" method="post" id=${element._id}>
											<input type="hidden" name="unique" value="1" />
											<input type="hidden" name="_id" value=${element._id} />
											<div class="alert alert-primary alert-dismissible fade show ml-4 mr-4" role="alert">
												<div class="media">
													<a href="javascript: submitform('${element._id}')">
														<img class="rounded mr-2 search-profile" src="user.jpg" alt="profile_image"/>
													</a>
													<div class="media-body">
														<a href="javascript: submitform('${element._id}')">
															<strong class="custom-username">${element.username}</strong>
														</a>
													</div>
												</div>
												<button class=\"close\" type="button" onclick="removeChat('${element.email}')">
													<span aria-hidden="true">&times;</span>
												</button>
											</div>
										</form>`;
						}
					}
				});
				if (ret.contactArr.length == 1)
					heading = `<strong class=\"notif-heading mb-2\">You have existing chats with ${ret.contactArr.length} contact</strong>`;
				else
					heading = `<strong class=\"notif-heading mb-2\">You have existing chats with ${ret.contactArr.length} contacts</strong>`;
				subheading = '';
				$('#heading').html(heading);
				$('#subheading').html(subHeading);
				$('#chats').html(chatArr);
			} else {
				heading = '<strong class=\"notif-heading mb-2\">Contacts</strong>';
				subHeading = '<h6>You have no chats as of yet! Start a chat with someone to add them to this list.</h6>';
				$('#heading').html(heading);
				$('#subheading').html(subHeading);
			}
		},
		error: function () {
			console.log('error retrieving contacts/chats');
		}
	});
}

setInterval(fetch_contacts, 4000);