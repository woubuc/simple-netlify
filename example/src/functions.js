window.loadFunctions = function loadFunctions() {
	let content1 = document.getElementById('content1');
	content1.textContent = 'Loading';

	fetch('/.netlify/functions/hello')
		.then(res => res.json())
		.then(data => content1.textContent = data.message);


	let content2 = document.getElementById('content2');
	content2.textContent = 'Loading';

	fetch('/.netlify/functions/hello-timeout')
		.then(res => res.json())
		.then(data => content2.textContent = data.message);


	let content3 = document.getElementById('content3');
	content3.textContent = 'Loading';

	fetch('/.netlify/functions/hello-async')
		.then(res => res.json())
		.then(data => content3.textContent = data.message);
}
