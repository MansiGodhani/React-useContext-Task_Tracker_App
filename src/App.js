// import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header';
import Footer from './components/Footer';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import About from './components/About';
import Context from "./components/Context"
import Login from "./components/Login"

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([
    // {
    //   id: 1,
    //   text: "Go to College",
    //   day: "Jan 5th at 10AM",
    //   reminder: true
    // },
    // {
    //   id: 2,
    //   text: "Meet friends",
    //   day: "Jan 8th at 9pm",
    //   reminder: false
    // },
    // {
    //   id: 3,
    //   text: "Shopping at Mall",
    //   day: "Jan 11th at 2:00pm",
    //   reminder: true
    // }
  ]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  //Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data
  }

  // Fetch Task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    return data
  }

  //Add Task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(task),
    })

    const data = await res.json()

    setTasks([...tasks, data])

    // const id = Math.floor(Math.random() * 10000) + 1;
    // const newTask = { id, ...task };
    // setTasks([...tasks, newTask]);
  }

  // Delete Task
  const deleteTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'DELETE',
  })
  //We should control the response status to decide if we will change the state or not.
  res.status === 200
    ? setTasks(tasks.filter((task) => task.id !== id))
    : alert('Error Deleting This Task')
  }

  //Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updTask),
    })

    const data = await res.json()
    console.log(data)
    setTasks(
      tasks.map((task) => 
        task.id === id ? { ...task, reminder:
        !task.reminder } : task
      )
    )
  }
  
  const [logstatus, setLogStatus] = useState(false);
  const login = () => {
    setLogStatus(true);
  };

  return (
    <Router>
      <div className="container">
      <Context.Provider  value={{status1: logstatus, login: login}} >
          <Login/>
        </Context.Provider>
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
        
        <Routes>
          <Route
            path='/'
            element={
              <>
                {showAddTask && <AddTask onAdd={addTask} />}
                {tasks.length > 0 ? (
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTask}
                    onToggle={toggleReminder}
                  />
                ) : (
                  'No Tasks To Show'
                )}
              </>
            }
          />
          <Route path='/about' element={<About />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
