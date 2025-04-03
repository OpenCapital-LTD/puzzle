import "./App.css";
import CrosswordPuzzle from "@/components/crossword-puzzle";
import AppTour from "./components/tour";
import { useEffect, useState } from "react";
import AdminPage from "./components/admin";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { MenuIcon } from "lucide-react";

// TO-DO: encrypt player
const admins = ['Shellton Omondi', 'Sandra Kampaire']
function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  useEffect(() => {
    setIsAdmin(false);
    let player = localStorage.getItem('player')
    if(player){
      if(admins.includes(player)){
        setIsAdmin(true)
        setShowPortal(true)
      }
    }
  }, []);
  const closePortal = ()=>{
    setIsAdmin(false)
  }
  return isAdmin ? (
    <AdminPage adminCallback={closePortal} />
  ) : (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className=" text-4xl font-bold text-center mb-8">
          Crossword Challenge
        </h1>

        {showPortal && <Button variant={'outline'} className="mt-[-10%] mb-[3%]" onClick={()=>{setIsAdmin(true)}}>Admin Portal</Button>}
        <AppTour />
        <CrosswordPuzzle />
      </div>
    </main>
  );
}

export default App;
