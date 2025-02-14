function toggleMenu() {
  var x = document.getElementById("navbar");
  if (x.className === "") {
    x.className += " responsive";
  } else {
    x.className = "";
  }
}

let currentPage = 1;
const questionsPerPage = 10;
let questionsData = [];

function loadQuestions() {
  fetch('questions.json')
    .then(response => response.json())
    .then(data => {
      questionsData = data;
      displayQuestions();
    })
    .catch(error => console.error('Error fetching questions:', error));
}

function displayQuestions(filteredData) {
  const container = document.getElementById('questions-container');
  if (!container) return;
  container.innerHTML = '';
  const dataToDisplay = filteredData || questionsData.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage);
  dataToDisplay.forEach(question => {
    const questionCard = document.createElement('div');
    questionCard.className = 'question-card';
    const date = document.createElement('h3');
    date.textContent = `Date: ${question.date}`;
    const questionText = document.createElement('p');
    questionText.textContent = question.question;
    if (question.answer) {
      const answerText = document.createElement('p');
      answerText.innerHTML = `<strong>Answer:</strong> ${question.answer}`;
      answerText.style.display = 'none';
      const toggleButton = document.createElement('button');
      toggleButton.textContent = 'Show Answer';
      toggleButton.onclick = () => {
        if (answerText.style.display === 'none') {
          answerText.style.display = 'block';
          toggleButton.textContent = 'Hide Answer';
        } else {
          answerText.style.display = 'none';
          toggleButton.textContent = 'Show Answer';
        }
      };
      questionCard.appendChild(date);
      questionCard.appendChild(questionText);
      questionCard.appendChild(toggleButton);
      questionCard.appendChild(answerText);
    } else {
      questionCard.appendChild(date);
      questionCard.appendChild(questionText);
    }
    container.appendChild(questionCard);
  });
  if (!filteredData) {
    displayPaginationControls();
  }
}

function displayPaginationControls() {
  const container = document.getElementById('questions-container');
  if (!container) return;
  const totalPages = Math.ceil(questionsData.length / questionsPerPage);
  const paginationDiv = document.createElement('div');
  paginationDiv.className = 'pagination';
  if (currentPage > 1) {
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.onclick = () => {
      currentPage--;
      displayQuestions();
    };
    paginationDiv.appendChild(prevButton);
  }
  const maxButtons = 3;
  let startPage = Math.max(1, currentPage - 1);
  let endPage = startPage + maxButtons - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    if (i === currentPage) {
      pageButton.classList.add('active');
    }
    pageButton.onclick = () => {
      currentPage = i;
      displayQuestions();
    };
    paginationDiv.appendChild(pageButton);
  }
  if (currentPage < totalPages) {
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.onclick = () => {
      currentPage++;
      displayQuestions();
    };
    paginationDiv.appendChild(nextButton);
  }
  container.appendChild(paginationDiv);
}

function searchQuestions() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const filteredQuestions = questionsData.filter(question => question.question.toLowerCase().includes(query));
  displayQuestions(filteredQuestions);
}

window.onload = function() {
  if (document.getElementById('questions-container')) {
    loadQuestions();
  }
};
