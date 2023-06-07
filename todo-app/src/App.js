import React, { useState, useEffect } from 'react';
import './App.css';

function markAsCompleted(todo) {
    return {
        ...todo,
        completed: true,
    };
}

function markAsUncompleted(todo) {
    return {
        ...todo,
        completed: false,
    };
}

function createTodo(title, dueDate) {
    return {
        id: Date.now(),
        title,
        completed: false,
        dueDate,
    };
}

function filterTodosByCondition(todos, conditionFunc) {
    return todos.filter((todo) => !conditionFunc(todo));
}

function removeTodo(todos, todoToRemove) {
    return todos.filter((todo) => todo.id !== todoToRemove.id);
}

function removeTodoByCondition(todos, conditionFunc) {
    return filterTodosByCondition(todos, conditionFunc);
}

function App() {
    const [todos, setTodos] = useState(
        JSON.parse(localStorage.getItem('todos')) || []
    );
    const [newTodo, setNewTodo] = useState('');
    const [page, setPage] = useState(0);
    const [editTodo, setEditTodo] = useState(null);
    const todosPerPage = 10;
    const [newDueDate, setNewDueDate] = useState('');
    const dueSoonDate = 2 * 24 * 60 * 60 * 1000;

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const handleCompleted = (todo) => {
        const updatedTodos = todos.map((t) =>
            t.id === todo.id ? markAsCompleted(t) : t
        );
        setTodos(updatedTodos);
    };

    const handleUncompleted = (todo) => {
        const updatedTodos = todos.map((t) =>
            t.id === todo.id ? markAsUncompleted(t) : t
        );
        setTodos(updatedTodos);
    };

    const handleRemove = (todoToRemove) => {
        const updatedTodos = removeTodo(todos, todoToRemove);
        setTodos(updatedTodos);
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
    };

    const handleRemoveCompleted = () => {
        const updatedTodos = removeTodoByCondition(
            todos,
            (todo) => todo.completed
        );
        setTodos(updatedTodos);
    };

    const handleEdit = (todo) => {
        setEditTodo(todo);
    };

    const updateTodo = () => {
        const updatedTodos = todos.map((t) =>
            t.id === editTodo.id ? { ...editTodo } : t
        );
        setTodos(updatedTodos);
        setEditTodo(null);
    };

    const addTodo = () => {
        const todo = createTodo(newTodo, newDueDate);
        setTodos([todo, ...todos]);
        setNewTodo('');
        setNewDueDate('');
    };

    const prevPage = () => {
        setPage(page - 1);
    };

    const nextPage = () => {
        setPage(page + 1);
    };

    const todosToShow = todos.slice(
        page * todosPerPage,
        (page + 1) * todosPerPage
    );

    return (
        <div className="App">
            <h1 className="title">Todo List</h1>
            <div className="add-todo-container">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add new todo"
                />
                <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    placeholder="Add due date"
                />
                <button onClick={addTodo}>Add</button>
            </div>
            <ul className="todo-list">
                {todosToShow.map((todo) => (
                    <li
                        className={`todo-item ${
                            todo.completed ? 'completed' : ''
                        }`}
                        key={todo.id}
                    >
                        {editTodo && editTodo.id === todo.id ? (
                            <input
                                type="text"
                                value={editTodo.title}
                                onChange={(e) =>
                                    setEditTodo({
                                        ...editTodo,
                                        title: e.target.value,
                                    })
                                }
                            />
                        ) : (
                            <div className="title-container">
                                {todo.title}
                                {todo.dueDate &&
                                    new Date(todo.dueDate) - new Date() >
                                        dueSoonDate && (
                                        <div className="due">
                                            Due {todo.dueDate}
                                        </div>
                                    )}
                                {todo.dueDate &&
                                    new Date(todo.dueDate) - new Date() <=
                                        dueSoonDate &&
                                    new Date(todo.dueDate) > new Date() && (
                                        <div className="due-soon">
                                            Due {todo.dueDate} - Soon
                                        </div>
                                    )}
                                {todo.dueDate &&
                                    new Date(todo.dueDate) <= new Date() && (
                                        <div className="overdue">
                                            Overdue since {todo.dueDate}
                                        </div>
                                    )}
                            </div>
                        )}
                        <div className="actions-container">
                            {todo.completed ? (
                                <button onClick={() => handleUncompleted(todo)}>
                                    Undo
                                </button>
                            ) : (
                                <button onClick={() => handleCompleted(todo)}>
                                    Done
                                </button>
                            )}
                            {editTodo && editTodo.id === todo.id ? (
                                <button onClick={updateTodo}>Save</button>
                            ) : (
                                <button onClick={() => handleEdit(todo)}>
                                    Edit
                                </button>
                            )}
                            <div className="remove-container">
                                <button onClick={() => handleRemove(todo)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="pagination-buttons">
                <button onClick={prevPage} disabled={page === 0}>
                    Previous
                </button>
                <button
                    onClick={handleRemoveCompleted}
                    className="remove-completed-button"
                >
                    Remove completed
                </button>
                <button
                    onClick={nextPage}
                    disabled={
                        page >= Math.ceil(todos.length / todosPerPage) - 1
                    }
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default App;
