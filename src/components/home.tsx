import "../App.css";
import CrosswordPuzzle from "@/components/crossword-puzzle";
import { useEffect, useState } from "react";
import AdminPage from "./admin";
import { Button } from "./ui/button";
import AppTour from "./tour";
import Cookies from 'js-cookie'
import useAxios from "./hooks/useAxios";


// TO-DO: encrypt player
const admins = ['Sandra Kyampaire']
function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  
  useEffect(() => {
    setIsAdmin(false);
    let player = Cookies.get("user_id")
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
    <main className="flex  flex-col items-center justify-between p-4 md:p-24" style={{
        paddingTop:'0px'
    }}>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className=" text-1xl font-bold text-center mb-8" style={{
            fontSize:'30px'
        }}>
          Crossword Challenge
        </h1>
        <br/>
        {showPortal && <Button variant={'outline'} className="mt-[-10%] mb-[4%]" style={{
            marginBottom:'30px'
        }} onClick={()=>{setIsAdmin(true)}}>Admin Portal</Button>}
        <br/>
        <AppTour />
        <CrosswordPuzzle />
      </div>
    </main>
  );
}

export default Home;
