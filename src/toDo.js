export default function toDo(title, id) {
  let dueDate = null;
  let priority = "false";

  const addTitle = (titleToAdd) => (title = titleToAdd);
  const addDueDate = (dueDateToAdd) => (dueDate = dueDateToAdd);
  const setPriority = (priorityToSet) => (priority = priorityToSet);
  const getData = () => ({
    id,
    title,
    dueDate,
    priority,
  });

  return {
    id,
    addDueDate,
    setPriority,
    getData,
    addTitle,
  };
}
