const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
let questions = [];
let answeredQuestions = [];
let currentQuestionIndex = 0;
async function fetchQuestions() {
	try {
		const response = await fetch(apiUrl);
		const data = await response.json();
		questions = data.slice(0, 10).map(question => {
			return {
				title: question.title,
				body: question.body,
				options: ['Seçenek A', 'Seçenek B', 'Seçenek C', 'Seçenek D']
			};
		});
		startQuiz();
	} catch (error) {
		console.error('Soruları alırken bir hata oluştu:', error);
	}
}

function startQuiz() {
	displayQuestion(currentQuestionIndex);

	const interval = setInterval(() => {
		currentQuestionIndex++;
		if (currentQuestionIndex < questions.length) {
			displayQuestion(currentQuestionIndex);
			disableOptions();
			setTimeout(enableOptions, 10000);
		} else {
			clearInterval(interval);
			showResults();
		}
	}, 30000);
}
function displayQuestion(index) {
	const questionContainer = document.getElementById('question-container');
	const question = questions[index];
	questionContainer.innerHTML = `
        <div class="question">
            <h2>${question.title}</h2>
            <p>${question.body}</p>
        </div>
        <div class="options">
            ${parseOptions(question.options, index)}
        </div>
    `;
	disableOptions();
	setTimeout(enableOptions, 10000);
}

function parseOptions(optionsArray, index) {
	let optionsHTML = '';
	optionsArray.forEach((option, i) => {
		optionsHTML += `<div class="option" data-index="${index}" data-option="${i}" onclick="selectOption(event)">${String.fromCharCode(65 + i)}) ${option}</div>`;
	});
	return optionsHTML;
}

function disableOptions() {
	const options = document.querySelectorAll('.option');
	options.forEach(option => {
		option.style.pointerEvents = 'none';
	});
}

function enableOptions() {
	const options = document.querySelectorAll('.option');
	options.forEach(option => {
		option.style.pointerEvents = 'auto';
	});
}

function selectOption(event) {
	const selectedIndex = parseInt(event.target.getAttribute('data-index'));
	const selectedOption = parseInt(event.target.getAttribute('data-option'));
	if (currentQuestionIndex === selectedIndex) {
		console.log('Cevap:', String.fromCharCode(65 + selectedOption));
		answeredQuestions[selectedIndex] = event.target.textContent.trim().substring(3);
		document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
		event.target.classList.add('selected');
	}
}
function showResults() {
	const resultsContainer = document.getElementById('results-container');
	let resultHTML = '<h2>Sonuçlar</h2><table><tr><th>Soru</th><th>Cevap</th></tr>';
	answeredQuestions.forEach((answer, index) => {
		resultHTML += `<tr><td>${index + 1}</td><td>${answer}</td></tr>`; // Kullanıcının seçtiği şıkkı ekledik
	});
	resultHTML += '</table>';
	resultsContainer.innerHTML = resultHTML;
}

fetchQuestions();
