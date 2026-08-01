import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Ticket from "./pages/Ticket";

function App() {
    return (
        <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(135deg,_#020617_0%,_#071224_45%,_#020617_100%)] text-slate-100">
            <BrowserRouter>
                <Navbar />
                <main className="flex min-h-screen w-full flex-col items-center pt-24">
                    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/collection" element={<Collection />} />
                            <Route path="/ticket" element={<Ticket />} />
                        </Routes>
                    </div>
                </main>
            </BrowserRouter>
        </div>
    );
}

export default App;