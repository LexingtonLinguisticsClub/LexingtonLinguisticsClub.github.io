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
  dataToDisplay.forEach(q => {
    const c = document.createElement('div');
    c.className = 'question-card';
    const d = document.createElement('h3');
    d.textContent = 'Date: ' + q.date;
    const t = document.createElement('p');
    t.textContent = q.question;
    c.appendChild(d);
    c.appendChild(t);
    if (q.answer) {
      const a = document.createElement('p');
      a.innerHTML = '<strong>Answer:</strong> ' + q.answer;
      a.style.display = 'none';
      const b = document.createElement('button');
      b.textContent = 'Show Answer';
      b.onclick = () => {
        if (a.style.display === 'none') {
          a.style.display = 'block';
          b.textContent = 'Hide Answer';
        } else {
          a.style.display = 'none';
          b.textContent = 'Show Answer';
        }
      };
      c.appendChild(b);
      c.appendChild(a);
    }
    container.appendChild(c);
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
  let start = currentPage - 1;
  let end = currentPage + 1;
  if (start < 2) start = 2;
  if (end > totalPages - 1) end = totalPages - 1;
  const first = document.createElement('button');
  first.textContent = '1';
  if (currentPage === 1) first.classList.add('active');
  first.onclick = () => {
    currentPage = 1;
    displayQuestions();
  };
  div.appendChild(first);
  if (start > 2) {
    const dots = document.createElement('span');
    dots.textContent = '...';
    dots.className = 'dots';
    div.appendChild(dots);
  }
  for (let i = start; i <= end; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick = () => {
      currentPage = i;
      displayQuestions();
    };
    div.appendChild(btn);
  }
  if (end < totalPages - 1) {
    const dots = document.createElement('span');
    dots.textContent = '...';
    dots.className = 'dots';
    div.appendChild(dots);
  }
  if (totalPages > 1) {
    const last = document.createElement('button');
    last.textContent = totalPages;
    if (currentPage === totalPages) last.classList.add('active');
    last.onclick = () => {
      currentPage = totalPages;
      displayQuestions();
    };
    div.appendChild(last);
  }
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
