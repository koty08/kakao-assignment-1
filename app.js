// ===== DOM 요소 참조 =====
const todoInput       = document.getElementById('todoInput');
const addButton       = document.getElementById('addButton');
const todoList        = document.getElementById('todoList');
const errorMessage    = document.getElementById('errorMessage');
const emptyState      = document.getElementById('emptyState');
const filterTabs      = document.getElementById('filterTabs');
const weekDaysEl      = document.getElementById('weekDays');
const weekLabelButton = document.getElementById('weekLabelButton');
const weekLabelEl     = document.getElementById('weekLabel');
const prevWeekButton  = document.getElementById('prevWeekButton');
const nextWeekButton  = document.getElementById('nextWeekButton');
const todayButton     = document.getElementById('todayButton');
const weekPickerEl    = document.getElementById('weekPicker');

// ===== 상태 =====
// 각 Todo 항목을 { id, text, completed, date } 형태로 관리
let todos = [];

// 고유 ID 생성용 카운터
let nextId = 1;

// 현재 선택된 필터: 'all' | 'active' | 'completed'
let currentFilter = 'all';

// 현재 선택된 날짜 (YYYY-MM-DD), 없으면 오늘
let selectedDate = localStorage.getItem('selectedDate') ?? getTodayString();

// 현재 표시 중인 주의 시작일 (월요일)
let weekStartDate = getWeekStartDate(selectedDate);

// 드롭다운 내 표시 연도 및 펼쳐진 월 키 ("YYYY-M")
let pickerYear       = new Date(selectedDate).getFullYear();
let expandedMonthKey = null;

// ===== 초기화 =====
loadTodosFromStorage();
renderWeekDays();
renderTodoList();

// ===== 이벤트 리스너 =====

addButton.addEventListener('click', handleAddTodo);

todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAddTodo();
});

todoInput.addEventListener('input', clearInputError);

// 이전 주로 이동
prevWeekButton.addEventListener('click', () => {
  weekStartDate = shiftDate(weekStartDate, -7);
  selectedDate  = weekStartDate;
  localStorage.setItem('selectedDate', selectedDate);
  closeWeekPicker();
  renderWeekDays();
  renderTodoList();
});

// 다음 주로 이동
nextWeekButton.addEventListener('click', () => {
  weekStartDate = shiftDate(weekStartDate, +7);
  selectedDate  = weekStartDate;
  localStorage.setItem('selectedDate', selectedDate);
  closeWeekPicker();
  renderWeekDays();
  renderTodoList();
});

// 오늘로 돌아가기
todayButton.addEventListener('click', () => {
  selectedDate  = getTodayString();
  weekStartDate = getWeekStartDate(selectedDate);
  localStorage.setItem('selectedDate', selectedDate);
  closeWeekPicker();
  renderWeekDays();
  renderTodoList();
});

// 주차 레이블 클릭 → 드롭다운 토글
weekLabelButton.addEventListener('click', (e) => {
  e.stopPropagation();
  weekPickerEl.classList.contains('hidden') ? openWeekPicker() : closeWeekPicker();
});

// 드롭다운 외부 클릭 시 닫기
document.addEventListener('click', (e) => {
  if (!weekPickerEl.classList.contains('hidden') && !weekPickerEl.contains(e.target)) {
    closeWeekPicker();
  }
});

// 필터 탭 클릭
filterTabs.addEventListener('click', (e) => {
  const tab = e.target.closest('.filter-tab');
  if (!tab) return;
  currentFilter = tab.dataset.filter;
  document.querySelectorAll('.filter-tab').forEach((t) =>
    t.classList.toggle('is-active', t === tab)
  );
  renderTodoList();
});

// ===== Todo 추가 =====
function handleAddTodo() {
  const inputText = todoInput.value.trim();

  if (!inputText) {
    showInputError();
    return;
  }

  todos.push({ id: nextId++, text: inputText, completed: false, date: selectedDate });
  saveTodosToStorage();
  todoInput.value = '';
  clearInputError();
  renderWeekDays(); // 날짜 뱃지 카운트 갱신
  renderTodoList();
}

// ===== Todo 완료 토글 =====
function toggleTodoCompleted(id) {
  todos = todos.map((t) => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTodosToStorage();
  renderTodoList();
}

// ===== Todo 삭제 =====
function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodosToStorage();
  renderWeekDays(); // 날짜 뱃지 카운트 갱신
  renderTodoList();
}

// ===== Todo 수정 모드 진입 =====
// 해당 항목의 텍스트를 인라인 input으로 교체
function enterEditMode(id) {
  const listItem  = document.querySelector(`[data-id="${id}"]`);
  const todo      = todos.find((t) => t.id === id);
  const textEl    = listItem.querySelector('.todo-item__text');
  const actionsEl = listItem.querySelector('.todo-item__actions');

  const editInput = document.createElement('input');
  editInput.type      = 'text';
  editInput.className = 'todo-item__edit-input';
  editInput.value     = todo.text;
  editInput.maxLength = 100;

  textEl.replaceWith(editInput);
  editInput.focus();
  // 커서를 텍스트 끝으로 이동
  editInput.setSelectionRange(editInput.value.length, editInput.value.length);

  actionsEl.innerHTML = `
    <button class="btn btn--save" onclick="saveEdit(${id})">저장</button>
    <button class="btn btn--delete" onclick="deleteTodo(${id})">삭제</button>
  `;

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveEdit(id);
  });
}

// ===== Todo 수정 저장 =====
function saveEdit(id) {
  const listItem  = document.querySelector(`[data-id="${id}"]`);
  const editInput = listItem.querySelector('.todo-item__edit-input');
  const newText   = editInput.value.trim();

  // 빈 값이면 저장하지 않고 수정 모드 유지
  if (!newText) {
    editInput.focus();
    editInput.style.borderColor = '#f04452';
    return;
  }

  todos = todos.map((t) => t.id === id ? { ...t, text: newText } : t);
  saveTodosToStorage();
  renderTodoList();
}

// ===== 로컬스토리지 =====
function saveTodosToStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodosFromStorage() {
  const stored = localStorage.getItem('todos');
  if (!stored) return;
  todos = JSON.parse(stored);
  // 저장된 id 중 최댓값 이후부터 채번
  if (todos.length > 0) nextId = Math.max(...todos.map((t) => t.id)) + 1;
}

// ===== 날짜 유틸 =====

// 오늘 날짜를 YYYY-MM-DD 문자열로 반환 (sv-SE 로케일이 해당 형식)
function getTodayString() {
  return new Date().toLocaleDateString('sv-SE');
}

// 날짜를 n일 앞/뒤로 이동한 YYYY-MM-DD 문자열 반환
function shiftDate(dateString, days) {
  const d = new Date(dateString);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('sv-SE');
}

// 해당 날짜가 속한 주의 월요일 날짜 반환
function getWeekStartDate(dateString) {
  const d   = new Date(dateString);
  const day = d.getDay(); // 0=일, 1=월 ... 6=토
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  return d.toLocaleDateString('sv-SE');
}

// 특정 연/월에 속하는 월요일 목록 반환 (월요일 기준, 0-indexed month)
function getMondaysInMonth(year, month) {
  const mondays = [];
  const d = new Date(year, month, 1);
  while (d.getDay() !== 1) d.setDate(d.getDate() + 1); // 첫 번째 월요일 탐색
  while (d.getMonth() === month) {
    mondays.push(d.toLocaleDateString('sv-SE'));
    d.setDate(d.getDate() + 7);
  }
  return mondays;
}

// "N년 M월 K주차" 형식의 주차 레이블 반환
function getWeekLabel(weekStart) {
  const d       = new Date(weekStart);
  const year    = d.getFullYear();
  const month   = d.getMonth();
  const mondays = getMondaysInMonth(year, month);
  const ordinal = mondays.indexOf(weekStart) + 1;
  return `${year}년 ${month + 1}월 ${ordinal}주차`;
}

// ===== 주간 뷰 렌더링 =====
function renderWeekDays() {
  weekDaysEl.innerHTML = '';
  const today    = getTodayString();
  const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
  const satIdx   = 5;
  const sunIdx   = 6;

  for (let i = 0; i < 7; i++) {
    const dateStr = shiftDate(weekStartDate, i);
    const count   = todos.filter((t) => t.date === dateStr).length;

    const cell = document.createElement('div');
    cell.className = 'week-day';
    if (i === satIdx)           cell.classList.add('is-saturday');
    if (i === sunIdx)           cell.classList.add('is-sunday');
    if (dateStr === selectedDate) cell.classList.add('is-selected');
    if (dateStr === today)        cell.classList.add('is-today');

    cell.innerHTML = `
      <span class="week-day__name">${dayNames[i]}</span>
      <span class="week-day__date">${new Date(dateStr).getDate()}</span>
      <span class="week-day__count${count === 0 ? ' is-empty' : ''}">${count > 0 ? count : ''}</span>
    `;

    cell.addEventListener('click', () => {
      selectedDate = dateStr;
      localStorage.setItem('selectedDate', selectedDate);
      renderWeekDays();
      renderTodoList();
    });

    weekDaysEl.appendChild(cell);
  }

  weekLabelEl.textContent  = getWeekLabel(weekStartDate);
  todayButton.disabled     = selectedDate === today;
}

// ===== 주차 드롭다운 열기 / 닫기 =====
function openWeekPicker() {
  pickerYear       = new Date(weekStartDate).getFullYear();
  expandedMonthKey = `${pickerYear}-${new Date(weekStartDate).getMonth()}`;
  renderWeekPicker();
  weekPickerEl.classList.remove('hidden');
  weekLabelButton.classList.add('is-open');
}

function closeWeekPicker() {
  weekPickerEl.classList.add('hidden');
  weekLabelButton.classList.remove('is-open');
}

// ===== 주차 드롭다운 렌더링 =====
function renderWeekPicker() {
  weekPickerEl.innerHTML = '';

  // 연도 네비게이션 헤더
  const yearNav = document.createElement('div');
  yearNav.className = 'week-picker__year-nav';
  yearNav.innerHTML = `
    <button class="week-picker__year-arrow" id="pickerPrevYear">&#8249;</button>
    <span class="week-picker__year">${pickerYear}년</span>
    <button class="week-picker__year-arrow" id="pickerNextYear">&#8250;</button>
  `;
  weekPickerEl.appendChild(yearNav);

  yearNav.querySelector('#pickerPrevYear').addEventListener('click', (e) => {
    e.stopPropagation();
    pickerYear--;
    renderWeekPicker();
  });
  yearNav.querySelector('#pickerNextYear').addEventListener('click', (e) => {
    e.stopPropagation();
    pickerYear++;
    renderWeekPicker();
  });

  const monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

  // 12개월 아코디언 렌더링
  for (let m = 0; m < 12; m++) {
    const mondays    = getMondaysInMonth(pickerYear, m);
    const monthKey   = `${pickerYear}-${m}`;
    const isExpanded = expandedMonthKey === monthKey;

    const monthEl = document.createElement('div');
    monthEl.className = 'week-picker__month';

    // 월 헤더 버튼
    const headerEl = document.createElement('button');
    headerEl.className = `week-picker__month-header${isExpanded ? ' is-expanded' : ''}`;
    headerEl.innerHTML = `
      <span>${monthNames[m]}</span>
      <span class="week-picker__month-caret">▾</span>
    `;

    // 주차 목록
    const weeksEl = document.createElement('div');
    weeksEl.className = `week-picker__weeks${isExpanded ? ' is-expanded' : ''}`;

    mondays.forEach((monday, idx) => {
      const weekEnd  = shiftDate(monday, 6);
      const startDay = new Date(monday).getDate();
      const endDate  = new Date(weekEnd);
      const endLabel = endDate.getMonth() !== m
        ? `${endDate.getMonth() + 1}/${endDate.getDate()}`
        : `${endDate.getDate()}`;

      const weekBtn = document.createElement('button');
      weekBtn.className = `week-picker__week-btn${monday === weekStartDate ? ' is-current' : ''}`;
      weekBtn.innerHTML = `<strong>${idx + 1}주차</strong><br>${m + 1}/${startDay} ~ ${endLabel}`;

      weekBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        weekStartDate = monday;
        selectedDate  = monday;
        localStorage.setItem('selectedDate', selectedDate);
        closeWeekPicker();
        renderWeekDays();
        renderTodoList();
      });

      weeksEl.appendChild(weekBtn);
    });

    // 월 헤더 클릭 → 아코디언 토글
    headerEl.addEventListener('click', (e) => {
      e.stopPropagation();
      expandedMonthKey = isExpanded ? null : monthKey;
      renderWeekPicker();
    });

    monthEl.appendChild(headerEl);
    monthEl.appendChild(weeksEl);
    weekPickerEl.appendChild(monthEl);
  }
}

// ===== 필터링 =====
function getFilteredTodos() {
  const byDate = todos.filter((t) => t.date === selectedDate);
  if (currentFilter === 'active')    return byDate.filter((t) => !t.completed);
  if (currentFilter === 'completed') return byDate.filter((t) => t.completed);
  return byDate;
}

// ===== 목록 렌더링 =====
function renderTodoList() {
  todoList.innerHTML = '';
  const filtered = getFilteredTodos();

  const emptyMessages = {
    all:       '등록된',
    active:    '진행 중인',
    completed: '완료된',
  };
  emptyState.querySelector('.empty-state__text').textContent =
    `${emptyMessages[currentFilter]} 할 일이 없습니다.`;
  emptyState.classList.toggle('hidden', filtered.length > 0);

  filtered.forEach((todo) => todoList.appendChild(createTodoElement(todo)));
}

// ===== Todo 항목 DOM 생성 =====
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className  = `todo-item${todo.completed ? ' is-completed' : ''}`;
  li.dataset.id = todo.id;

  li.innerHTML = `
    <div class="todo-item__checkbox" onclick="toggleTodoCompleted(${todo.id})"></div>
    <span class="todo-item__text">${escapeHtml(todo.text)}</span>
    <div class="todo-item__actions">
      <button class="btn btn--edit" onclick="enterEditMode(${todo.id})">수정</button>
      <button class="btn btn--delete" onclick="deleteTodo(${todo.id})">삭제</button>
    </div>
  `;

  return li;
}

// ===== 입력 오류 =====
function showInputError() {
  todoInput.classList.add('is-error');
  errorMessage.classList.remove('hidden');
  todoInput.focus();
}

function clearInputError() {
  todoInput.classList.remove('is-error');
  errorMessage.classList.add('hidden');
}

// ===== XSS 방지: HTML 특수문자 이스케이프 =====
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
