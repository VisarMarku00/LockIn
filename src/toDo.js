export default function toDo(title, id) {
  let description;
  let dueDate;
  let priority;

  const addTitle = (titleToAdd) => (title = titleToAdd);
  const addDescription = (descriptionToAdd) => (description = descriptionToAdd);
  const addDueDate = (dueDateToAdd) => (dueDate = dueDateToAdd);
  const setPriority = (priorityToSet) => (priority = priorityToSet);
  const getData = () => ({
    id,
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
    addTitle,
  };
}
