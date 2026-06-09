import { useTodos } from "@/entities/todo";
import { AddTodoForm } from "@/features/add-todo";
import { FILTER, toDateKey } from "@/shared/lib";
import { useFilter, FilterTabs } from "@/features/filter-todos";
import { useSelectedDate, DateNavigator } from "@/features/navigate-date";
import { TodoListWidget } from "@/widgets/todo-list";
import { WeeklyView } from "@/widgets/weekly-view";

export function TodoPage() {
  const { todos, addTodo, deleteTodo, toggleTodo, editTodo } = useTodos();
  const { currentFilter, setFilter } = useFilter();
  const { selectedDate, setSelectedDate, goToPrev, goToNext, goToToday } = useSelectedDate();

  const dateKey = toDateKey(selectedDate);

  const filteredTodos = todos
    .filter((todo) => todo.date === dateKey)
    .filter((todo) => {
      if (currentFilter === FILTER.ACTIVE) return !todo.completed;
      if (currentFilter === FILTER.COMPLETED) return todo.completed;
      return true;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-120 mx-auto px-4 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Todo List</h1>
          <p className="text-sm text-gray-500 mt-1">오늘 할 일을 기록해보세요</p>
        </header>

        <div className="flex flex-col gap-4">
          <WeeklyView selectedDate={selectedDate} todos={todos} onDateSelect={setSelectedDate} />
          <DateNavigator selectedDate={selectedDate} onPrev={goToPrev} onNext={goToNext} onToday={goToToday} />
          <FilterTabs currentFilter={currentFilter} onFilterChange={setFilter} />
          <AddTodoForm onAdd={(text) => addTodo(text, dateKey)} />
          <TodoListWidget todos={filteredTodos} onToggle={toggleTodo} onEdit={editTodo} onDelete={deleteTodo} />
        </div>
      </div>
    </div>
  );
}
