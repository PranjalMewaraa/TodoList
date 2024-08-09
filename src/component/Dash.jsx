/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  db,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "../../firebase";
import InputBox from "./InputBox";

function Dashboard({ user, onLogout }) {
  // My States
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    desc: "",
    priority: "low",
    status: "incomplete",
  });
  const [editingTodo, setEditingTodo] = useState(null);

  //UseEffect is placed by me to run and fetch tasks at every start
  useEffect(() => {
    if (user) {
      fetchTodos(user.uid);
    }
  }, [user]);

  //fuctions to add, retrieve delete and edit thee tasks is written below

  const fetchTodos = async (userId) => {
    const todosCollection = collection(db, `users/${userId}/todos`);
    const todosSnapshot = await getDocs(todosCollection);
    const todosList = todosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTodos(todosList);
  };

  const handleAddTodo = async () => {
    if (user) {
      try {
        const todo = { ...newTodo };
        const docRef = await addDoc(
          collection(db, `users/${user.uid}/todos`),
          todo
        );
        setTodos([...todos, { id: docRef.id, ...todo }]);
        setNewTodo({
          title: "",
          desc: "",
          priority: "low",
          status: "incomplete",
        });
      } catch (error) {
        console.error("Error adding to-do:", error.message);
      }
    }
  };

  const handleEditTodo = async (id) => {
    if (user) {
      try {
        const updatedTodo = { ...editingTodo };
        await updateDoc(doc(db, `users/${user.uid}/todos`, id), updatedTodo);
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, ...updatedTodo } : todo
          )
        );
        setEditingTodo(null);
      } catch (error) {
        console.error("Error updating to-do:", error.message);
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    if (user) {
      try {
        await deleteDoc(doc(db, `users/${user.uid}/todos`, id));
        setTodos(todos.filter((todo) => todo.id !== id));
      } catch (error) {
        console.error("Error deleting to-do:", error.message);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (user) {
      try {
        await updateDoc(doc(db, `users/${user.uid}/todos`, id), {
          status: newStatus,
        });
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, status: newStatus } : todo
          )
        );
      } catch (error) {
        console.error("Error updating status:", error.message);
      }
    }
  };

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setNewTodo({ ...newTodo, [name]: value });
    console.log(value);
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center p-4"
      style={{ backgroundColor: "#0F172A" }}
    >
      <h2 className="text-white text-6xl font-bold mb-4">To-Do List</h2>
      <code className="text-white text-xl font-bold mb-4 text-center">
        You can add todo tasks, set priority from high to low, edit, delete, and
        mark them as completed or incomplete.
      </code>
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <InputBox
          type="text"
          placeholder="Title"
          value={newTodo.title}
          name="title"
          onChange={(e) => handleInputs(e)}
          className="flex items-center w-full md:w-72 text-left space-x-3 px-4 h-12 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
        />
        <InputBox
          type="text"
          name="desc"
          placeholder="Description"
          value={newTodo.desc}
          onChange={(e) => handleInputs(e)}
        />
        <select
          value={newTodo.priority}
          onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
          className="flex items-center w-full md:w-72 text-left space-x-3 px-4 h-12 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          onClick={handleAddTodo}
          className="bg-blue-500 text-white p-2 rounded-md ml-2"
        >
          Add Todo
        </button>
      </div>

      <div className="w-full p-10">
        {todos.map((todo, index) => (
          <div
            key={todo.id}
            className="bg-[#162032] p-4 rounded-md mb-2 flex flex-col md:flex-row justify-between items-center"
          >
            <div className="flex flex-col md:flex-row items-center text-white gap-4 md:gap-8">
              <h4 className="hidden md:flex">{index + 1}</h4>
              <h3 className="text-3xl md:text-lg font-bold">{todo.title}</h3>
              <code className="p-4">{todo.desc}</code>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center py-2">
              <div className="flex gap-4">
                <select
                  value={todo.status}
                  onChange={(e) => handleStatusChange(todo.id, e.target.value)}
                  className="text-white p-1 bg-[#1F2937] border-none rounded-md"
                >
                  <option value="incomplete">Incomplete</option>
                  <option value="completed">Completed</option>
                </select>
                <p
                  className="px-2 py-1 text-white rounded-xl"
                  style={{
                    backgroundColor:
                      todo.priority === "high"
                        ? "#EF4444"
                        : todo.priority === "medium"
                        ? "#F59E0B"
                        : "#10B981",
                  }}
                >
                  Priority: {todo.priority}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setEditingTodo(todo)}
                  className="bg-blue-500 text-white p-2 rounded-md ml-2"
                >
                  <img
                    src="https://img.icons8.com/?size=100&id=8192&format=png&color=FFFFFF"
                    width={"25px"}
                    alt=""
                  />
                </button>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="bg-blue-500 text-white p-2 rounded-md ml-2"
                >
                  <img
                    src="https://img.icons8.com/?size=100&id=99961&format=png&color=FFFFFF"
                    alt=""
                    width={"25px"}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingTodo && (
        <div className="bg-gray-800 p-4 rounded-md w-full max-w-sm mt-4">
          <h3 className="text-white text-lg font-bold">Edit Todo</h3>
          <input
            type="text"
            value={editingTodo.title}
            onChange={(e) =>
              setEditingTodo({ ...editingTodo, title: e.target.value })
            }
            className="p-2 rounded-md w-full"
          />
          <input
            type="text"
            value={editingTodo.desc}
            onChange={(e) =>
              setEditingTodo({ ...editingTodo, desc: e.target.value })
            }
            className="p-2 rounded-md w-full mt-2"
          />
          <select
            value={editingTodo.priority}
            onChange={(e) =>
              setEditingTodo({ ...editingTodo, priority: e.target.value })
            }
            className="p-2 rounded-md w-full mt-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            onClick={() => handleEditTodo(editingTodo.id)}
            className="bg-blue-500 text-white p-2 rounded-md mt-2 w-full"
          >
            Save Changes
          </button>
        </div>
      )}

      <button
        onClick={onLogout}
        className="bg-red-500 text-white p-2 rounded-md mt-4"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
