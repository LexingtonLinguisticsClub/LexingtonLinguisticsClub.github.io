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
    const card = document.createElement('div');
    card.className = 'question-card';
    const date = document.createElement('h3');
    date.textContent = 'Date: ' + question.date;
    const text = document.createElement('p');
    text.textContent = question.question;
    card.appendChild(date);
    card.appendChild(text);
    if (question.answer) {
      const ans = document.createElement('p');
      ans.innerHTML = '<strong>Answer:</strong> ' + question.answer;
      ans.style.display = 'none';
      const btn = document.createElement('button');
      btn.textContent = 'Show Answer';
      btn.onclick = () => {
        if (ans.style.display === 'none') {
          ans.style.display = 'block';
          btn.textContent = 'Hide Answer';
        } else {
          ans.style.display = 'none';
          btn.textContent = 'Show Answer';
        }
      };
      card.appendChild(btn);
      card.appendChild(ans);
    }
    container.appendChild(card);
  });
  if (!filteredData) {
    displayPaginationControls();
  }
}

function displayPaginationControls() {
  const container = document.getElementById('questions-container');
  if (!container) return;
  const totalPages = Math.ceil(questionsData.length / questionsPerPage);
  const div = document.createElement('div');
  div.className = 'pagination';
  if (currentPage > 1) {
    const prev = document.createElement('button');
    prev.textContent = 'Previous';
    prev.onclick = () => {
      currentPage--;
      displayQuestions();
    };
    div.appendChild(prev);
  }
  const pages = [];
  pages.push(1);
  let start = currentPage - 1;
  let end = currentPage + 1;
  if (start < 2) start = 2;
  if (end > totalPages - 1) end = totalPages - 1;
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  const unique = [...new Set(pages)];
  unique.forEach(num => {
    const btn = document.createElement('button');
    btn.textContent = num;
    if (num === currentPage) {
      btn.classList.add('active');
    }
    btn.onclick = () => {
      currentPage = num;
      displayQuestions();
    };
    div.appendChild(btn);
  });
  if (currentPage < totalPages) {
    const next = document.createElement('button');
    next.textContent = 'Next';
    next.onclick = () => {
      currentPage++;
      displayQuestions();
    };
    div.appendChild(next);
  }
  container.appendChild(div);
}

function searchQuestions() {
  const q = document.getElementById('search-input').value.toLowerCase();
  const filtered = questionsData.filter(x => x.question.toLowerCase().includes(q));
  displayQuestions(filtered);
}

window.onload = function() {
  if (document.getElementById('questions-container')) {
    loadQuestions();
  }
};
