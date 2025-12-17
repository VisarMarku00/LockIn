export default function collection(title) {
  let description;
  let toDos = [];

  const addDescription = (descriptionToAdd) => (description = descriptionToAdd);
  const addToDos = (toDo) => toDos.add(toDo);
  const getToDos = () => ({
    toDos,
  });
}
