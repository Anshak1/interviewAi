import "./index.css";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { Form } from "./components/Form";
import { Toaster } from "sonner";

// Placeholder Interview component
function Interview() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Interview Page</h1>
        <p className="text-slate-400">Interview component coming soon...</p>
      </div>
    </div>
  );
}

export function App() {
  return (
    <>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form/>}/>
        <Route path="/interview/:id" element={<Interview/>}/>
      </Routes>
    </BrowserRouter>
    </>

  );
}

export default App;
