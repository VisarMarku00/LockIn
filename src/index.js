import * as controller from "./controller";
import "./index.css";


const collectionFromMemory = controller.getAllCollections();

let newlyCreatedCollectionId = null;
let newlyCreatedTaskId = null;

renderCollections(collectionFromMemory);

function renderCollections(collections, focusCollectionId, focusTodoId) {
  const collectionsContainer = document.getElementById("collections");
  const collectionTemplate = document.getElementById("collection-box");
  const todoTemplate = document.getElementById("todo-box");

  collectionsContainer.innerHTML = "";

  collections.forEach((collectionFunc) => {
    // Get the plain data object from the factory
    const collection = collectionFunc.getData();

    // Clone collection template
    const collectionClone = collectionTemplate.content.cloneNode(true);
    const collectionWrapper = collectionClone.querySelector(".collection-wrapper");
    
    // Set collection data
    collectionClone.querySelector(".collection-title").textContent = collection.title;
    collectionClone.querySelector(".collection-description").textContent = collection.description;
    
    // Use data attribute strictly for identification
    collectionWrapper.dataset.id = collection.id;

    // Apply animation if newly created
    if (collection.id === newlyCreatedCollectionId) {
        collectionWrapper.classList.add("anim-collection-pop");
    }

    // INLINE EDITING LOGIC
    const titleElem = collectionClone.querySelector(".collection-title");
    const descElem = collectionClone.querySelector(".collection-description");

    // Make elements editable
    titleElem.contentEditable = true;
    titleElem.setAttribute("placeholder", "Collection Title");
    
    titleElem.addEventListener("input", () => {
        let val = titleElem.textContent;
        if (val.length > 30) {
            val = val.substring(0, 30);
            titleElem.textContent = val;
            focusEndOfElement(titleElem);
        }
        // Auto-save on every keystroke
        if (val.trim()) {
            controller.editCollection(collection.id, { title: val.trim() });
        }
    });

    descElem.contentEditable = true;
    descElem.setAttribute("placeholder", "Description");
    
    descElem.addEventListener("input", () => {
        let val = descElem.textContent;
        if (val.length > 30) {
            val = val.substring(0, 30);
            descElem.textContent = val;
            focusEndOfElement(descElem);
        }
        // Auto-save on every keystroke
        controller.editCollection(collection.id, { description: val.trim() });
    });

    // Prevent newlines and blur on Enter
    [titleElem, descElem].forEach(el => {
        el.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                el.blur();
            }
        });
    });

    // Save on Blur (Title)
    titleElem.addEventListener("blur", () => {
        let newTitle = titleElem.textContent.trim();

        if (newTitle) {
             controller.editCollection(collection.id, { title: newTitle });
             renderCollections(controller.getAllCollections());
        } else {
             // If empty on blur, delete the collection automatically (Silent Auto-Removal)
             controller.deleteCollection(collection.id);
             renderCollections(controller.getAllCollections());
        }
    });

    // Save on Blur (Description)
    descElem.addEventListener("blur", () => {
        let newDesc = descElem.textContent.trim();
        controller.editCollection(collection.id, { description: newDesc });
    });

    // Delete Button Logic
    collectionClone.querySelector(".btn-delete-collection").addEventListener("click", () => {
        controller.deleteCollection(collection.id);
        renderCollections(controller.getAllCollections());
    });

    const todoContainer = collectionClone.querySelector(".todo-container");

    // Render existing todos + one phantom placeholder
    const todosToRender = [...(collection.toDos || [])];
    // Always add one empty placeholder at the end
    todosToRender.push({
        id: "new-task-placeholder-" + collection.id,
        title: "",
        description: "",
        dueDate: "",
        priority: "false",
        isPlaceholder: true
    });

    todosToRender.forEach((todo) => {
        // Clone todo template
        const todoClone = todoTemplate.content.cloneNode(true);
        
        const todoTitle = todoClone.querySelector(".todo-title");
        const dateDisplay = todoClone.querySelector(".todo-date-display");
        const todoDate = todoClone.querySelector(".todo-due-date");
        const priorityBtn = todoClone.querySelector(".btn-priority-toggle");
        const dateTrigger = todoClone.querySelector(".btn-date-trigger");

        // TITLE (Inline Edit)
        todoTitle.textContent = todo.title;
        todoTitle.contentEditable = true;
        todoTitle.dataset.id = todo.id; // Store ID for focus maintenance
        todoTitle.setAttribute("placeholder", todo.isPlaceholder ? "Add Task..." : "Task Title");
        
        todoTitle.addEventListener("input", () => {
            let val = todoTitle.textContent;
            if (val.length > 30) {
                val = val.substring(0, 30);
                todoTitle.textContent = val;
                focusEndOfElement(todoTitle);
            }
            // Auto-save existing tasks on every keystroke
            if (!todo.isPlaceholder && val.trim()) {
                controller.editToDo(collection.id, todo.id, { title: val.trim() });
            }
        });

        todoTitle.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                todoTitle.blur();
            }
        });

        if (todo.isPlaceholder) {
            // Spawning Logic: on input, create a real task
            todoTitle.addEventListener("input", () => {
                const val = todoTitle.textContent.trim();
                if (val) {
                    const newTodo = controller.createTodo(collection.id, {
                        title: val,
                        dueDate: "",
                        priority: "false"
                    });
                    newlyCreatedTaskId = newTodo.id; // Track for animation
                    // Re-render, focusing the newly created task's title
                    renderCollections(controller.getAllCollections(), null, newTodo.id);
                }
            }, { once: true }); // Only trigger once to avoid multiple creations
        }

        // Apply animation if newly created
        if (todo.id === newlyCreatedTaskId) {
            todoClone.querySelector(".todo-wrapper").classList.add("anim-task-slide-down");
        }

        todoTitle.addEventListener("blur", () => {
             let newTitle = todoTitle.textContent.trim();

             if (newTitle) {
                 if (!todo.isPlaceholder) {
                    controller.editToDo(collection.id, todo.id, { title: newTitle });
                    renderCollections(controller.getAllCollections());
                 }
             } else {
                 if (!todo.isPlaceholder) {
                    controller.deleteToDo(collection.id, todo.id);
                    renderCollections(controller.getAllCollections()); 
                 }
             }
        });

        // DATE DISPLAY & TRIGGER
        if (todo.dueDate) {
            dateDisplay.textContent = todo.dueDate;
        } else {
            dateDisplay.textContent = "";
        }

        dateTrigger.addEventListener("click", () => {
            todoDate.showPicker(); // Opens the native calendar
        });

        todoDate.value = todo.dueDate || "";
        todoDate.addEventListener("change", () => {
            const newDate = todoDate.value;
            controller.editToDo(collection.id, todo.id, { dueDate: newDate });
            renderCollections(controller.getAllCollections());
        });
        
        // PRIORITY (Toggle Icon)
        const updatePriorityDisplay = (isHigh) => {
            priorityBtn.textContent = isHigh === "true" ? "★" : "☆";
            if (isHigh === "true") {
                priorityBtn.classList.add("high-priority");
            } else {
                priorityBtn.classList.remove("high-priority");
            }
        };

        updatePriorityDisplay(todo.priority);

        priorityBtn.addEventListener("click", () => {
             const newPriority = todo.priority === "true" ? "false" : "true";
             controller.editToDo(collection.id, todo.id, { priority: newPriority });
             renderCollections(controller.getAllCollections());
        });

        // DELETE TODO & ACTIONS VISIBILITY
        const deleteTodoBtn = todoClone.querySelector(".btn-delete-todo");
        if (todo.isPlaceholder) {
            // Hide all controls on placeholder
            dateTrigger.style.display = "none";
            priorityBtn.style.display = "none";
            deleteTodoBtn.style.display = "none";
        } else {
            deleteTodoBtn.addEventListener("click", () => {
                controller.deleteToDo(collection.id, todo.id);
                renderCollections(controller.getAllCollections());
            });
        }

        todoContainer.appendChild(todoClone);
    });

    collectionsContainer.appendChild(collectionClone);
  });

  // Render "Add Collection" button
  const addCollectionTemplate = document.getElementById("add-collection-box");
  const addCollectionClone = addCollectionTemplate.content.cloneNode(true);
  
  const addCollectionBtn = addCollectionClone.querySelector(".add-collection-btn");
  
  if (addCollectionBtn) {
    addCollectionBtn.addEventListener("click", () => {
        try {
            // Formless Creation: Immediately create a new collection
            const newCollection = controller.createCollection({
                title: "", // Empty to trigger placeholder/delete-on-empty
                description: "",
                toDos: []
            });
            newlyCreatedCollectionId = newCollection.id; // Track for animation
            // Render and focus the new collection
            renderCollections(controller.getAllCollections(), newCollection.id);
        } catch (e) {
            alert("Error: " + e.message);
        }
    });
  }

  // Only show Add Collection button if there are no pending empty compositions
  const isCreating = collections.some(c => c.getData().title === "");
  
  if (!isCreating) {
      collectionsContainer.appendChild(addCollectionClone);
  }

  // FOCUS MAINTENANCE
  if (focusCollectionId) {
    const coll = document.querySelector(`.collection-wrapper[data-id="${focusCollectionId}"]`);
    if (coll) {
        const title = coll.querySelector(".collection-title");
        if (title) focusEndOfElement(title);
    }
  }

  if (focusTodoId) {
    const todoEl = document.querySelector(`.todo-title[data-id="${focusTodoId}"]`);
    if (todoEl) focusEndOfElement(todoEl);
  }

  // Clear animation tracking after render is complete
  newlyCreatedCollectionId = null;
  newlyCreatedTaskId = null;
}

function focusEndOfElement(el) {
    el.focus();
    // Move cursor to end of contentEditable
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}
