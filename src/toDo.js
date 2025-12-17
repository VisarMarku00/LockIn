export default function toDo(title) {
  let description;
  let dueDate;
  let priority;

  const addDescription = (descriptionToAdd) => (description = descriptionToAdd);
  const addDueDate = (dueDateToAdd) => (dueDate = dueDateToAdd);
  const setPriority = () => (priority = !priority);
  const getData = () => ({
    title,
    description,
    dueDate,
    priority,
  });

  return {
    addDescription,
    addDueDate,
    setPriority,
    getData,
  };
}
