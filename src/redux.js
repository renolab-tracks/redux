function createStore(reducer) {
  // 1. The state
  // 2. Get the state. (getState)
  // 3. Listen to changes on the state. (subscribe)
  // 4. Update the state (dispatch)

  let state;
  let listeners = [];
  const getState = () => state;

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  return {
    getState,
    subscribe,
    dispatch,
  };
}

const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";

/*
Characteristics of a Pure Function (Reducers)
1) They always return the same result if the same arguments are passed in.
2) They depend only on the arguments passed into them.
3) Never produce any side effects.
*/

function goals(state = [], action) {
  switch (action.type) {
    case "ADD_GOAL":
      return state.concat([action.goal]);
    case "REMOVE_GOAL":
      return state.filter((goal) => goal.id !== action.id);
    default:
      return state;
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case "ADD_TODO":
      // return state.concat[action.payload];
      return [...state, action.payload];
    case "REMOVE_TODO":
      return state.filter((todo) => todo.id !== action.payload);
    case "TOGGLE_TODO":
      return state.map((todo) =>
        todo.id !== action.id
          ? todo
          : Object.assign({}, todo, { complete: !todo.complete })
      );
    default:
      return state;
  }
}

function user(state = {}, action) {
  switch (action.type) {
    case "USER_LOGGED_IN":
      return { ...state, logged: true };

    default:
      return state;
  }
}

function app(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action),
    user: user(state.user, action),
  };
}

const store = createStore(app);
const { dispatch, getState, subscribe } = store;

const unsubscribe = subscribe(() => {
  console.log("state updated", store.getState());
  const { goals, todos } = store.getState();
  addItemsToDOM("todos", todos);
  addItemsToDOM("goals", goals);
});

function addItemsToDOM(selectorId, items) {
  document.getElementById(selectorId).innerHTML = getItemsHTML(items);
}

function getItemsHTML(items) {
  return items
    .map(
      ({ name, complete, id }) =>
        `<li onclick="toggleTodo('${id}')" style ="text-decoration : ${
          complete ? "line-through" : "none"
        }" >${name}<span onclick="removeTodo('${id}')" style="padding:2px;border:1px solid">X</span></li>`
    )
    .join("");
}

function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    payload: todo,
  };
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    payload: id,
  };
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  };
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  };
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  };
}

function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    payload: todo,
  };
}

//DOM Update Code
var todoInput, goalInput;

window.onload = () => {
  todoInput = document.getElementById("todo");
  goalInput = document.getElementById("goal");

  dispatch(
    addTodoAction({
      id: generateId(),
      name: "Wake Up",
      complete: false,
    })
  );

  dispatch(
    addTodoAction({
      id: generateId(),
      name: "Drink Coffee",
      complete: false,
    })
  );

  dispatch(
    addTodoAction({
      id: generateId(),
      name: "Go to ITWORX",
      complete: true,
    })
  );

  dispatch(
    addGoalAction({
      id: generateId(),
      name: "Learn Redux",
    })
  );

  dispatch(
    addGoalAction({
      id: generateId(),
      name: "Master Front-End",
    })
  );
};

function addToDo() {
  dispatch(
    addTodoAction({ id: generateId(), name: todoInput.value, complete: false })
  );
}
function addGoal() {
  dispatch(
    addGoalAction({ id: generateId(), name: todoInput.value, complete: false })
  );
}

function toggleTodo(id) {
  dispatch(toggleTodoAction(id));
}

function removeTodo(id) {
  dispatch(removeTodoAction(id));
}

function generateId() {
  return (
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36)
  );
}
