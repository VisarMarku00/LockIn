export default function collection(title, id, createdAt = Date.now()) {
  let description = "";
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
    return {
      id,
      title,
      description,
      createdAt,
      toDos: toDos.map((todo) => todo.getData()),
    };
  };

  return {
    id,
    createdAt,
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
