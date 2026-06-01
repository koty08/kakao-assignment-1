// ===== DOM 요소 참조 =====
const todoInput     = document.getElementById('todoInput');
const addButton     = document.getElementById('addButton');
const todoList      = document.getElementById('todoList');
const errorMessage  = document.getElementById('errorMessage');
const emptyState    = document.getElementById('emptyState');

// ===== 상태 =====
// 각 Todo 항목을 { id, text, completed } 형태로 관리
let todos = [];

// 고유 ID 생성용 카운터
let nextId = 1;

// ===== 초기화 =====
renderTodoList();

// ===== 이벤트 리스너 =====

// 추가 버튼 클릭
addButton.addEventListener('click', handleAddTodo);

// 입력창에서 Enter 키 입력
todoInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') handleAddTodo();
});

// 입력 중 오류 상태 해제
todoInput.addEventListener('input', () => {
  clearInputError();
});

// ===== Todo 추가 =====
function handleAddTodo() {
  const inputText = todoInput.value.trim();

  // 빈 입력값 검증
  if (!inputText) {
    showInputError();
    return;
  }

  const newTodo = {
    id: nextId++,
    text: inputText,
    completed: false,
  };

  todos.push(newTodo);
  todoInput.value = '';
  clearInputError();
  renderTodoList();
}

// ===== Todo 완료 토글 =====
function toggleTodoCompleted(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  renderTodoList();
}

// ===== Todo 삭제 =====
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  renderTodoList();
}

// ===== Todo 수정 모드 진입 =====
// 해당 항목의 텍스트를 인라인 input으로 교체
function enterEditMode(id) {
  const listItem = document.querySelector(`[data-id="${id}"]`);
  const todo = todos.find((t) => t.id === id);

  // 현재 텍스트 영역을 입력창으로 교체
  const textEl    = listItem.querySelector('.todo-item__text');
  const actionsEl = listItem.querySelector('.todo-item__actions');

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'todo-item__edit-input';
  editInput.value = todo.text;
  editInput.maxLength = 100;

  textEl.replaceWith(editInput);
  editInput.focus();
  // 커서를 텍스트 끝으로 이동
  editInput.setSelectionRange(editInput.value.length, editInput.value.length);

  // 버튼을 '저장' 버튼으로 교체
  actionsEl.innerHTML = `
    <button class="btn btn--save" onclick="saveEdit(${id})">저장</button>
    <button class="btn btn--delete" onclick="deleteTodo(${id})">삭제</button>
  `;

  // 입력창에서 Enter 키로 저장
  editInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') saveEdit(id);
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

  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, text: newText } : todo
  );
  renderTodoList();
}

// ===== 전체 목록 렌더링 =====
function renderTodoList() {
  // 기존 목록 초기화
  todoList.innerHTML = '';

  // 빈 상태 메시지 표시/숨김 처리
  emptyState.classList.toggle('hidden', todos.length > 0);

  todos.forEach((todo) => {
    const listItem = createTodoElement(todo);
    todoList.appendChild(listItem);
  });
}

// ===== Todo 항목 DOM 생성 =====
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item${todo.completed ? ' is-completed' : ''}`;
  li.dataset.id = todo.id;

  li.innerHTML = `
    <div class="todo-item__checkbox" onclick="toggleTodoCompleted(${todo.id})"></div>
    <span class="todo-item__text">${escapeHtml(todo.text)}</span>
    <div class="todo-item__actions">
      <button class="btn btn--edit" onclick="enterEditMode(${todo.id})" ${todo.completed ? 'disabled style="opacity:0.4;cursor:default"' : ''}>수정</button>
      <button class="btn btn--delete" onclick="deleteTodo(${todo.id})">삭제</button>
    </div>
  `;

  return li;
}

// ===== 입력 오류 표시 =====
function showInputError() {
  todoInput.classList.add('is-error');
  errorMessage.classList.remove('hidden');
  todoInput.focus();
}

// ===== 입력 오류 초기화 =====
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
