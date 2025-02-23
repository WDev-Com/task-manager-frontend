import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Task_Main from "./components/Task_Components/Task_Main";
import { TaskProvider } from "./contextAPI/ContextProvider";
function App() {
  return (
    <>
      <TaskProvider>
        <Navigation />
        <Task_Main />
      </TaskProvider>
    </>
  );
}

export default App;
