// on page load fetch suggestions
window.addEventListener('DOMContentLoaded', (event)  => {
	$('#filterStr').html('<h5 class=\"ml-4 mb-3\">Loading suggestions...</h5>');
	fetchSuggestions();
});

// holds initial and advanced matches results
let globalRes = new Array;
// hold current users tags
let globalTags = new Array;
// holds the filtered results of globalRes
let filteredRes = new Array;
// current user used for filtering
let globalCurrUser;

// function sets event listeners on buttons once globalRes is established for the first time on page load
function setVariables() {
	const advancedBtn = document.getElementById('advancedBtn');
	const orderBtn = document.getElementById('sortBtn');
	const filterBtn = document.getElementById('filterBtn');
	const clearFilterBtn = document.getElementById('clearFilterBtn');
	advancedBtn.addEventListener('click', fetch_advanced);
	orderBtn.addEventListener('click', order_results);
	filterBtn.addEventListener('click', filter_results);
	clearFilterBtn.addEventListener('click', clearFilters);
}

// function used to iterate through results and display
function displayResults(arr) {

	// check if either filteredRes or globalRes(the parameter sent through) has users AND if a filter has been activated with no results
	if (arr.length !== 0 && filteredRes[0] !== 'noresults') {
		let resultsArr = new Array;
	
		arr.forEach(element => {
			if (element.main_image) {
				if (element.bio) {
					resultsArr += `<form action="matched_profile" method="post" id=${element._id}>
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
									</div>
								</form>`;
				} else {
					resultsArr += `<form action="matched_profile" method="post" id=${element._id}>
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
									</div>
								</form>`;
				}
			} else {
				if (element.bio) {
					resultsArr += `<form action="matched_profile" method="post" id=${element._id}>
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
									</div>
								</form>`;
				} else {
					resultsArr += `<form action="matched_profile" method="post" id=${element._id}>
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
									</div>
								</form>`;
				}
			}
		});
		$('#searchResultsBox').html(resultsArr);
	} else {
		$('#searchResultsBox').html('');	
	}
}

// function that builds the custom user message when an advanced search is made
function buildCustomMsg(resCount, tags, rating, age, location) {

	let userMsg;

	// if no input was given but advanced match btn was pressed, else calc msg
	if (tags.length == 0 && rating == '' && age == '' && location == '') {
		if (resCount > 1 || resCount == 0) {
			userMsg = `<p class=\"ml-4 mb-3\">Showing ${resCount} results`;
		} else {
			userMsg = `<p class=\"ml-4 mb-3\">Showing ${resCount} result`;
		}
	} else {
		if (resCount > 1) {
			userMsg = `<p class=\"ml-4 mb-3\">Showing ${resCount} results for `;
		} else {
			userMsg = `<p class=\"ml-4 mb-3\">Showing ${resCount} result for `;
		}
		if (age !== '') {
			userMsg += `age gap = <b>'${age}'</b> `;
		}
		if (location !== '') {
			userMsg += `location = <b>'${location}'</b> `;
		}
		if (rating !== '') {
			userMsg += `fame rating gap = <b>'${rating}'</b> `;
		}
		if (tags.length !== 0) {
			let i = 0;
			while (tags[i]) {
				if (i == 0)
					userMsg += `tags = <b>'${tags[i]}'</b> `;
				else
					userMsg += `<b>'${tags[i]}'</b> `;
				i++;
			}
		}
	}
	userMsg += '</p>';
	return userMsg;
}

// function fetches suggestions on page load
function fetchSuggestions() {

	let loadStr;

	$.ajax({
		type: 'POST',
		url: '/search/fetchResults',
		success: function (ret) {

			globalRes = ret.matches;
			globalTags = ret.tags;
			globalCurrUser = ret.currUser;
			setVariables();
			displayResults(ret.matches);

			// calc user message
			if (ret.matches.length !== 0) {
				if (ret.matches.length > 1)
					loadStr = `<p class=\"ml-4 mb-3\">Showing ${ret.matches.length} suggestions</p>`;
				else
					loadStr = `<p class=\"ml-4 mb-3\">Showing ${ret.matches.length} suggestions</p>`;
				$('#filterStr').html(loadStr);
			} else {
				$('#filterStr').html('<h6 class=\"ml-4 mb-3\">No suggestions at this moment! Try an advanced search.</h6>');
			}
		},
		error: function () {
			$('#filterStr').html('<h5 class=\"ml-4 mb-3\">Error loading suggestions!</h5>');
		}
	});
}

// function used when an advanced search is made
function fetch_advanced() {
	const ageInput = document.getElementById('age').value;
	const locationInput = document.getElementById('location').value;
	const ratingInput = document.getElementById('rating').value;

	let tagArr = new Array;
	let searchObj = new Object;
	let i = 0;

	// obtain checked tags
	while (globalTags[i]) {
		let check = document.getElementById(globalTags[i]).checked;
		if (check) {
			tagArr.push(globalTags[i]);
		}
		i++;
	}

	$('#searchResultsBox').html('');
	$('#filterStr').html('<h5 class=\"ml-4\">Loading...</h5>');
	
	// populate search query object
	searchObj.advanced_search = '1';
	if (ageInput !== '') {
		searchObj.age = ageInput;
	}
	if (locationInput !== '') {
		searchObj.location = locationInput;
	}
	if (ratingInput !== '') {
		searchObj.rating = ratingInput;
	}
	if (tagArr.length !== 0) {
		searchObj.color = tagArr;
	}

	$.ajax({
		type: 'POST',
		url: '/search/fetchResults',
		data: searchObj,
		success: function (ret) {

			globalRes = ret.matches;
			globalTags = ret.tags;
			globalCurrUser = ret.currUser;
			filteredRes = [];
			setVariables();
			displayResults(ret.matches);

			// calc user message using query parameters
			if (ret.matches.length !== 0) {
				let loadStr = buildCustomMsg(ret.matches.length, tagArr, ratingInput, ageInput, locationInput);
				$('#filterStr').html(loadStr);
			} else {
				$('#filterStr').html('<h6 class=\"ml-4 mb-3\">No results at this moment!</h6>');
			}
		},
		error: function () {
			$('#filterStr').html('<h5 class=\"ml-4 mb-3\">Error loading results!</h5>');
		}
	});
}

// function used for ordering in either asc or desc the suggestions/advanced results/filtered results
function order_results() {
	const sortInput = document.getElementById('slctSort').value;
	const orderInput = document.getElementById('slctOrdr').value;

	$('#searchResultsBox').html('');
	orderedArr = new Array;
	let loadStr;

	// check if the globalRes has been filtered - if true then order the filteredRes
	if (filteredRes.length !== 0) {
		orderedArr = filteredRes.sort(compareValues(sortInput, orderInput));
	} else if (filteredRes[0] !== 'noresults') {
		orderedArr = globalRes.sort(compareValues(sortInput, orderInput));
	}
	displayResults(orderedArr);

	// calc user message
	if (orderedArr.length > 1 || orderedArr.length == 0)
		loadStr = `<p class=\"ml-4 mb-3\">Showing ${orderedArr.length} results for <b>${sortInput}</b> ordered ${orderInput}</p>`;
	else if (orderedArr[0] == 'noresults')
		loadStr = '<h6 class=\"ml-4 mb-3\">No results</h6>';
	else
		loadStr = `<p class=\"ml-4 mb-3\">Showing ${orderedArr.length} result for <b>${sortInput}</b> ordered ${orderInput}</p>`;
	$('#filterStr').html(loadStr);
}

// sorting function by ascending or descending. Takes a dynamic object property : key
function compareValues(key, order) {

	return function innerSort(a, b) {

		if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
			return 0;
		}

		let propertyOne = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
		let propertyTwo = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];
		let comparison = 0;

		if (key == 'location') {
			cityOne = a[key].split(',');
			cityTwo = b[key].split(',');
			propertyOne = cityOne[0].trim();
			propertyTwo = cityTwo[0].trim();
		}

		if (propertyOne > propertyTwo) {
			comparison = 1;
		} else if (propertyOne < propertyTwo) {
			comparison = -1;
		}

		return((order === 'descending') ? (comparison * -1) : comparison);
	};
}

// function used for filtering suggestions/advanced search results
function filter_results() {
	let i = 0;
	let allUsers = [...globalRes];
	const filterInput = document.getElementById('slctFltr').value;

	// filtering out unsuitable users according to filter parameter - partial match looks for at least one tag in common
	if (filterInput == 'partial') {
		while (allUsers[i]) {
			let match = false;
			let a = 0;
			while (globalCurrUser.tags[a]) {
				if (allUsers[i].tags && allUsers[i].tags.includes(globalCurrUser.tags[a])) {
					match = true;
				}
				a++;
			}
			if (match !== true) {
				allUsers.splice(i, 1);
			} else {
				i++;
			}
		}
	} else {
		while (allUsers[i]) {
			if (allUsers[i][filterInput] !== globalCurrUser[filterInput]) {
				console.log('removed user from allUsers array due to filtering: ', allUsers[i].username);
				allUsers.splice(i, 1);
			} else {
				i++;
			}
		};
	}
	// save filtered results in global array
	filteredRes = [...allUsers];
	displayResults(allUsers);

	// calc user message
	if (allUsers.length !== 0) {
		if (allUsers.length > 1)
			loadStr = `<p class=\"ml-4 mb-3\">Showing ${allUsers.length} filtered results for <b>${filterInput}</b></p>`;
		else
			loadStr = `<p class=\"ml-4 mb-3\">Showing ${allUsers.length} filtered result for <b>${filterInput}</b></p>`;
		$('#filterStr').html(loadStr);
	} else {
		// save this so that when ordering an empty filtered result array it won't resort to globalRes
		filteredRes[0] = 'noresults';

		$('#filterStr').html('<h6 class=\"ml-4 mb-3\">No results</h6>');
	}
}

// function to clear filters and display original results again
function clearFilters() {
	filteredRes = [];
	// use this function to fake a message
	let loadstr = buildCustomMsg(globalRes.length, [], '', '', '');
	$('#filterStr').html(loadstr);

	displayResults(globalRes);
}