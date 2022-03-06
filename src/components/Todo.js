import React, { useState } from "react";
import TodoForm from "./TodoForm";
import { MdDeleteOutline } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";
import { AiOutlineStar } from "react-icons/ai";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TodoList from "./TodoList";

function Todo({
  todos,
  filteredTodos,
  completeTodo,
  removeTodo,
  updateTodo,
  toggleImportantTodo,
  getLocalTodos,
  saveLocalTodos,
}) {
  const [edit, setEdit] = useState({
    id: null,
    value: "",
  });

  const submitUpdate = (value) => {
    updateTodo(edit.id, value);
    setEdit({
      id: null,
      value: "",
    });
  };

  if (edit.id) {
    return <TodoForm edit={edit} onSubmit={submitUpdate} />;
  }

  return (
    <DragDropContext
      onDragEnd={(param) => {
        const srcIndex = param.source.index;
        const destinationIndex = param.destination.index;
        todos.splice(destinationIndex, 0, todos.splice(srcIndex, 1)[0]);
        console.log(TodoList, "<<todo list");
        console.log(filteredTodos, "<< filtered todos");
        console.log(todos, "<< todos");
        TodoList.saveLocalTodos(todos);
      }}
    >
      <Droppable droppableId="droppable-1">
        {(provided, _) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {filteredTodos.map((todo, index) => (
              <Draggable
                axis="none"
                key={todo.id}
                draggableId={`draggable-${todo.id}`}
                index={index}
                className="droppable"
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      boxShadow: snapshot.isDragging
                        ? "0 0 .4rem #FFF"
                        : "none",
                    }}
                    className={
                      todo.isComplete ? "todo-row complete" : "todo-row"
                    }
                    key={index}
                  >
                    <div key={todo.id} onClick={() => completeTodo(todo.id)}>
                      {todo.text}
                    </div>
                    <div className="icons">
                      <RiEditLine
                        onClick={() =>
                          setEdit({ id: todo.id, value: todo.text })
                        }
                        className="edit-icon"
                      />
                      <MdDeleteOutline
                        onClick={() => removeTodo(todo.id)}
                        className="delete-icon"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Todo;
