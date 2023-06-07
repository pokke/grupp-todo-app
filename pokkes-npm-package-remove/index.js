import { filterTodosByCondition } from 'pokkes-npm-package-utils';

export function removeTodo(todos, todoToRemove) {
    return todos.filter((todo) => todo.id !== todoToRemove.id);
}

export function removeTodoByCondition(todos, conditionFunc) {
    return filterTodosByCondition(todos, conditionFunc);
}
