export default function collection(title, id) {
  let description;
  let toDos = [];

  const addTitle = (titleToAdd) => (title = titleToAdd);
  const addDescription = (descriptionToAdd) => (description = descriptionToAdd);
  const addToDo = (toDo) => toDos.push(toDo);
  const addToDos = (toDosToAdd) => (toDos = toDosToAdd);
  const getToDos = () => toDos;
  const getToDo = (toDoId) => toDos.find((todo) => todo.id === toDoId);
  const deleteToDo = (toDoId) => {
    toDos = toDos.filter((todo) => todo.id !== toDoId);
  };
  const deleteToDos = () => {
    toDos = [];
  };
  const getData = () => {
    id, title, description, toDos;
  };

  return {
    addTitle,
    addDescription,
    addToDo,
    addToDos,
    getToDos,
    getToDo,
    deleteToDo,
    getData,
    deleteToDos,
  };
}
