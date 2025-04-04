import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Confetti } from "@/components/confetti";
import { Timer } from "@/components/timer";
import { HelpCircle, RefreshCw, CheckCircle } from "lucide-react";
import useAxios from "./hooks/useAxios";
import Loader from "./loader";
import Cookies from "js-cookie";

// Sample words array - replace with your own 15 words
const WORDS_ARRAY = [
  "JAVASCRIPT",
  "REACT",
  "NEXTJS",
  "TYPESCRIPT",
  "TAILWIND",
  "COMPONENT",
  "FUNCTION",
  "VARIABLE",
  "INTERFACE",
  "PROMISE",
  "ASYNC",
  "RENDER",
  "HOOK",
  "STATE",
  "PROPS",
];

// Crossword puzzle generator
const generateCrossword = (words: string[], clues: Record<string, string>) => {
  // Sort words by length (descending)
  const sortedWords = [...words].sort((a, b) => b.length - a.length);

  // Initialize grid with empty cells
  const grid: string[][] = Array(13)
    .fill(null)
    .map(() => Array(16).fill(""));

  // Initialize word placements
  const placements: {
    word: string;
    row: number;
    col: number;
    direction: "across" | "down";
    clue: string;
  }[] = [];

  // Simple clues for each word
  const cluesd: Record<string, string> = {
    JAVASCRIPT: "Popular programming language for web development",
    REACT: "UI library developed by Facebook",
    NEXTJS: "React framework with server-side rendering",
    TYPESCRIPT: "JavaScript with static typing",
    TAILWIND: "Utility-first CSS framework",
    COMPONENT: "Reusable UI building block",
    FUNCTION: "Block of code designed to perform a task",
    VARIABLE: "Named storage for data",
    INTERFACE: "Structure that defines object properties and methods",
    PROMISE: "Object representing eventual completion of an operation",
    ASYNC: "Enables asynchronous programming",
    RENDER: "Process of displaying elements on screen",
    HOOK: "Functions that let you use React features",
    STATE: "Data that changes over time in a component",
    PROPS: "Data passed from parent to child component",
  };

  // Place first word horizontally in the middle
  const firstWord = sortedWords[0];
  const firstRow = Math.floor(13 / 2);
  const firstCol = Math.floor((16 - firstWord.length) / 2);

  for (let i = 0; i < firstWord.length; i++) {
    grid[firstRow][firstCol + i] = firstWord[i];
  }

  placements.push({
    word: firstWord,
    row: firstRow,
    col: firstCol,
    direction: "across",
    clue: clues[firstWord],
  });

  // Try to place remaining words
  const placedWords = [firstWord];
  const acrossCount = 1;
  const downCount = 0;

  // Helper function to check if a word can be placed
  const canPlaceWord = (
    word: string,
    row: number,
    col: number,
    direction: "across" | "down"
  ) => {
    // Check if word fits in the grid
    if (direction === "across") {
      if (col + word.length > 16) return false;
    } else {
      if (row + word.length > 13) return false;
    }

    // Check if placement is valid
    for (let i = 0; i < word.length; i++) {
      const currentRow = direction === "across" ? row : row + i;
      const currentCol = direction === "across" ? col + i : col;

      // Out of bounds check
      if (
        currentRow < 0 ||
        currentRow >= 13 ||
        currentCol < 0 ||
        currentCol >= 16
      ) {
        return false;
      }

      // Check if cell is empty or has the same letter
      if (
        grid[currentRow][currentCol] !== "" &&
        grid[currentRow][currentCol] !== word[i]
      ) {
        return false;
      }

      // Check adjacent cells (except for intersection points)
      if (grid[currentRow][currentCol] === "") {
        // Check above
        if (
          currentRow > 0 &&
          grid[currentRow - 1][currentCol] !== "" &&
          !(
            direction === "down" &&
            i > 0 &&
            currentRow - 1 === row + i - 1 &&
            currentCol === col
          )
        ) {
          return false;
        }

        // Check below
        if (
          currentRow < 12 &&
          grid[currentRow + 1][currentCol] !== "" &&
          !(
            direction === "down" &&
            i < word.length - 1 &&
            currentRow + 1 === row + i + 1 &&
            currentCol === col
          )
        ) {
          return false;
        }

        // Check left
        if (
          currentCol > 0 &&
          grid[currentRow][currentCol - 1] !== "" &&
          !(
            direction === "across" &&
            i > 0 &&
            currentRow === row &&
            currentCol - 1 === col + i - 1
          )
        ) {
          return false;
        }

        // Check right
        if (
          currentCol < 16 &&
          grid[currentRow][currentCol + 1] !== "" &&
          !(
            direction === "across" &&
            i < word.length - 1 &&
            currentRow === row &&
            currentCol + 1 === col + i + 1
          )
        ) {
          return false;
        }
      }
    }

    return true;
  };

  // Try to place remaining words with intersections
  for (let wordIndex = 1; wordIndex < sortedWords.length; wordIndex++) {
    const word = sortedWords[wordIndex];
    let placed = false;

    // Try to find an intersection with already placed words
    for (const placedWord of placedWords) {
      if (placed) break;

      // Find common letters
      for (let i = 0; i < placedWord.length; i++) {
        if (placed) break;

        for (let j = 0; j < word.length; j++) {
          if (placedWord[i] === word[j]) {
            // Try to place horizontally if placed word is vertical
            const placement = placements.find((p) => p.word === placedWord);
            if (!placement) continue;

            if (placement.direction === "down") {
              // Try to place horizontally
              const row = placement.row + i;
              const col = placement.col - j;

              if (canPlaceWord(word, row, col, "across")) {
                // Place the word
                for (let k = 0; k < word.length; k++) {
                  grid[row][col + k] = word[k];
                }

                placements.push({
                  word,
                  row,
                  col,
                  direction: "across",
                  clue: clues[word],
                });

                placedWords.push(word);
                placed = true;
                break;
              }
            } else {
              // Try to place vertically
              const row = placement.row - j;
              const col = placement.col + i;

              if (canPlaceWord(word, row, col, "down")) {
                // Place the word
                for (let k = 0; k < word.length; k++) {
                  grid[row + k][col] = word[k];
                }

                placements.push({
                  word,
                  row,
                  col,
                  direction: "down",
                  clue: clues[word],
                });

                placedWords.push(word);
                placed = true;
                break;
              }
            }
          }
        }
      }
    }

    // If we couldn't place with intersection, try to place adjacent
    if (!placed) {
      // Simple placement strategy for remaining words
      // This is a simplified approach - a real crossword generator would be more sophisticated

      // Try to place horizontally if we need more across words
      if (acrossCount < 6) {
        for (let row = 0; row < 13; row++) {
          if (placed) break;
          for (let col = 0; col < 16 - word.length; col++) {
            if (canPlaceWord(word, row, col, "across")) {
              // Place the word
              for (let k = 0; k < word.length; k++) {
                grid[row][col + k] = word[k];
              }

              placements.push({
                word,
                row,
                col,
                direction: "across",
                clue: clues[word],
              });

              placedWords.push(word);
              placed = true;
              break;
            }
          }
        }
      }
      // Try to place vertically if we need more down words
      else if (downCount < 6) {
        for (let col = 0; col < 16; col++) {
          if (placed) break;
          for (let row = 0; row < 13 - word.length; row++) {
            if (canPlaceWord(word, row, col, "down")) {
              // Place the word
              for (let k = 0; k < word.length; k++) {
                grid[row + k][col] = word[k];
              }

              placements.push({
                word,
                row,
                col,
                direction: "down",
                clue: clues[word],
              });

              placedWords.push(word);
              placed = true;
              break;
            }
          }
        }
      }
    }
  }

  // Number the grid cells for clues
  let clueNumber = 1;
  const numberedGrid = Array(13)
    .fill(null)
    .map(() => Array(16).fill(0));

  placements.forEach((placement) => {
    const { row, col } = placement;
    if (numberedGrid[row][col] === 0) {
      numberedGrid[row][col] = clueNumber++;
    }
  });

  // Update placements with clue numbers
  placements.forEach((placement) => {
    placement.clue = `${numberedGrid[placement.row][placement.col]}. ${
      placement.clue
    }`;
  });

  return { grid, placements, numberedGrid };
};

export default function CrosswordPuzzle() {
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [solution, setSolution] = useState<string[][]>([]);
  const [placements, setPlacements] = useState<any[]>([]);
  const [numberedGrid, setNumberedGrid] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [direction, setDirection] = useState<"across" | "down">("across");
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [puzzle, setPuzzle] = useState("");
  const [resetCount, setResetCount] = useState(0);
  const [score, setScore] = useState(91);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [myScored, setMyScore] = useState();
  const [user, setUser] = useState("");
  const { get, post, loading } = useAxios(
    "https://vercel-functions-eta.vercel.app/api"
  );
  function formatSecondsToMinutes(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const paddedMins = mins.toString().padStart(2, "0");
    const paddedSecs = secs.toString().padStart(2, "0");

    return `${paddedMins}:${paddedSecs}`;
  }

  const gridRefs = useRef<(HTMLInputElement | null)[][]>(
    Array(13)
      .fill(null)
      .map(() => Array(16).fill(null))
  );
  useEffect(() => {
    // post('https://puzzle-gamma-lyart.vercel.app/api/v1').then((res:any)=>{
    //   console.log("here is response ::: ", res)
    // }).catch((err:any)=>{
    //   console.log("something went wrong")
    // })
  }, []);

  // Initialize the crossword puzzle
  useEffect(() => {
    get("/v1?r=g_cwds")
      .then((res) => {
        console.log(res);
        let c: any = {};
        res?.map((res: any) => {
          c[res.word.toUpperCase()] = res.hint;
        });
        console.log("puzzle name", res[0].name);
        setPuzzle(res[0].name);
        const { grid, placements, numberedGrid } = generateCrossword(
          res?.map((l: any) => l.word.toUpperCase()),
          c
        );
        setSolution(grid);
        setPlacements(placements);
        setNumberedGrid(numberedGrid);

        // Initialize user grid with empty cells where solution has letters
        const initialUserGrid = Array(13)
          .fill(null)
          .map((_, rowIndex) =>
            Array(16)
              .fill(null)
              .map((_, colIndex) => (grid[rowIndex][colIndex] ? "" : " "))
          );
        setUserGrid(initialUserGrid);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    let user = Cookies.get("user_id");
    setUser(user || "");
    console.log("########################", puzzle);
    get(`/v1?r=g_rsu&p=${encodeURIComponent(puzzle)}&u=${encodeURIComponent(user || "")}`).then((res) => {
      if (res.length > 0) {
        setHasPlayed(true);
        setMyScore(res[0]);
      }
    });
    return setCompleted(false);
  }, [puzzle]);
  // Start the game when user interacts with the grid
  useEffect(() => {
    if (selectedCell && !gameStarted) {
      setGameStarted(true);
      setTimerActive(true);
    }
  }, [selectedCell, gameStarted]);

  // Update progress
  useEffect(() => {
    if (userGrid.length === 0 || solution.length === 0) return;

    let filledCells = 0;
    let totalCells = 0;

    for (let row = 0; row < 13; row++) {
      for (let col = 0; col < 16; col++) {
        if (solution[row][col]) {
          totalCells++;
          if (userGrid[row][col] != "") {
            filledCells++;
          }
        }
      }
    }

    console.log(userGrid);
    // const newProgress = Math.floor((filledCells / totalCells) * 100);
    const newProgress =
      totalCells === 0 ? 0 : Math.floor((filledCells / totalCells) * 100);

    setProgress(newProgress);

    // Check if puzzle is completed
    if (newProgress === 100 && !completed) {
      let correct = 0;
      userGrid.map((l: any, x) => {
        l.map((j: any, k: number) => {
          if (j == solution[x][k]) {
            correct = correct + 1;
          }
        });
      });
      let score = Math.floor((correct / totalCells) * 100);
      let user = Cookies.get("user_id");
      console.log("correct answers :: ", correct);
      console.log("correct answers :: ", hintsUsed);
      console.log("correct answers :: ", user);
      console.log("correct answers :: ", resetCount);
      console.log("correct answers :: ", elapsedTime);
      console.log("correct answers :: ", correct);
      console.log("correct answers :: ", score);
      console.log("correct answers :: ", totalCells);
      console.log("correct answers :: ", new Date());
      setScore(score);
      post("/v1?r=p_rs", {
        name: user,
        puzzle,
        hints_taken: hintsUsed,
        resets: resetCount,
        time: elapsedTime,
        correct,
        total: totalCells,
        score,
        date: new Date().toUTCString(),
      })
        .then((res) => {
          alert("You have finished this puzzle");

          setCompleted(true);
          setTimerActive(false);
          if (score > 90) setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 6000);
        })
        .catch((err) => {
          alert("an error occured");
        });
    }
  }, [userGrid, solution, completed]);

  // Handle cell selection
  const handleCellClick = (row: number, col: number) => {
    if (solution[row][col] === "") return;
    // Toggle direction if clicking the same cell
    if (selectedCell?.row === row && selectedCell?.col === col) {
      setDirection((prev) => (prev === "across" ? "down" : "across"));
      console.log("setting direction");
    } else {
      setSelectedCell({ row, col });
    }
    console.log(row, col);

    // Focus on the input
    if (gridRefs.current[row][col]) {
      gridRefs.current[row][col]?.focus();
    }
  };

  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (completed) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveToNextCell(row, col, "across");
      setDirection("across");
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveToPrevCell(row, col, "across");
      setDirection("across");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      moveToNextCell(row, col, "down");
      setDirection("down");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveToPrevCell(row, col, "down");
      setDirection("down");
    } else if (e.key === "Backspace") {
      if (userGrid[row][col] === "") {
        e.preventDefault();
        moveToPrevCell(row, col, direction);
      } else {
        console.log(userGrid[row][col], direction);
        const newGrid = [...userGrid];
        setUserGrid(newGrid);
        moveToPrevCell(row, col, direction);
        newGrid[row][col] = "";
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      moveToNextWord();
    } else if (e.key === " ") {
      e.preventDefault();
      setDirection((prev) => (prev === "across" ? "down" : "across"));
    }
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    if (completed) return;

    const value = e.target.value.toUpperCase();
    if (value && /^[A-Z]$/.test(value)) {
      const newGrid = [...userGrid];
      newGrid[row][col] = value;
      setUserGrid(newGrid);

      // Move to next cell
      moveToNextCell(row, col, direction);
    }
  };

  // Move to next cell
  const moveToNextCell = (row: number, col: number, dir: "across" | "down") => {
    let nextRow = row;
    let nextCol = col;

    if (dir === "across") {
      nextCol = col + 1;
      while (nextCol < 16 && solution[nextRow][nextCol] === "") {
        nextCol++;
      }
      if (nextCol < 16) {
        setSelectedCell({ row: nextRow, col: nextCol });
        gridRefs.current[nextRow][nextCol]?.focus();
      }
    } else {
      nextRow = row + 1;
      while (nextRow < 13 && solution[nextRow][nextCol] === "") {
        nextRow++;
      }
      if (nextRow < 13) {
        setSelectedCell({ row: nextRow, col: nextCol });
        gridRefs.current[nextRow][nextCol]?.focus();
      }
    }
  };

  // Move to previous cell
  const moveToPrevCell = (row: number, col: number, dir: "across" | "down") => {
    let prevRow = row;
    let prevCol = col;

    if (dir === "across") {
      prevCol = col - 1;
      while (prevCol >= 0 && solution[prevRow][prevCol] === "") {
        prevCol--;
      }
      if (prevCol >= 0) {
        setSelectedCell({ row: prevRow, col: prevCol });
        gridRefs.current[prevRow][prevCol]?.focus();
      }
    } else {
      prevRow = row - 1;
      while (prevRow >= 0 && solution[prevRow][prevCol] === "") {
        prevRow--;
      }
      if (prevRow >= 0) {
        setSelectedCell({ row: prevRow, col: prevCol });
        gridRefs.current[prevRow][prevCol]?.focus();
      }
    }
  };

  // Move to next word
  const moveToNextWord = () => {
    if (!selectedCell) return;

    const currentPlacement = placements.find(
      (p) =>
        p.direction === direction &&
        selectedCell.row >= p.row &&
        selectedCell.col >= p.col &&
        (p.direction === "across"
          ? selectedCell.row === p.row &&
            selectedCell.col < p.col + p.word.length
          : selectedCell.col === p.col &&
            selectedCell.row < p.row + p.word.length)
    );

    if (!currentPlacement) return;

    const currentIndex = placements.indexOf(currentPlacement);
    const nextIndex = (currentIndex + 1) % placements.length;
    const nextPlacement = placements[nextIndex];

    setSelectedCell({ row: nextPlacement.row, col: nextPlacement.col });
    setDirection(nextPlacement.direction);
    gridRefs.current[nextPlacement.row][nextPlacement.col]?.focus();
  };

  // Use a hint
  const useHint = () => {
    if (!selectedCell || completed || hintsUsed > 4) return;

    const { row, col } = selectedCell;
    if (solution[row][col] === "") return;

    const newGrid = [...userGrid];
    newGrid[row][col] = solution[row][col];
    setUserGrid(newGrid);
    setHintsUsed((prev) => prev + 1);
    // Move to next cell
    moveToNextCell(row, col, direction);
  };

  // Reset the puzzle
  const resetPuzzle = () => {
    setResetCount((t: number) => {
      t = t + 1;
      return t;
    });
    if (userGrid.length === 0 || solution.length === 0) return;

    const initialUserGrid = Array(13)
      .fill(null)
      .map((_, rowIndex) =>
        Array(16)
          .fill(null)
          .map((_, colIndex) => (solution[rowIndex][colIndex] ? "" : " "))
      );
    setUserGrid(initialUserGrid);
    setSelectedCell(null);
    setCompleted(false);
    setHintsUsed(0);
    // setElapsedTime(0)
    setGameStarted(false);
    // setTimerActive(false)
  };

  // Check the puzzle
  const checkPuzzle = () => {
    if (userGrid.length === 0 || solution.length === 0) return;

    let incorrect = 0;
    const newGrid = [...userGrid];

    for (let row = 0; row < 13; row++) {
      for (let col = 0; col < 16; col++) {
        if (solution[row][col] && userGrid[row][col] !== "") {
          if (userGrid[row][col] !== solution[row][col]) {
            newGrid[row][col] = "";
            incorrect++;
          }
        }
      }
    }

    setUserGrid(newGrid);
    return incorrect;
  };

  // Get highlighted cells
  const getHighlightedCells = () => {
    if (!selectedCell) return [];

    const highlighted: { row: number; col: number }[] = [];

    if (direction === "across") {
      // Find the word that contains the selected cell
      const placement = placements.find(
        (p) =>
          p.direction === "across" &&
          selectedCell.row === p.row &&
          selectedCell.col >= p.col &&
          selectedCell.col < p.col + p.word.length
      );

      if (placement) {
        for (let i = 0; i < placement.word.length; i++) {
          highlighted.push({ row: placement.row, col: placement.col + i });
        }
      }
    } else {
      // Find the word that contains the selected cell
      const placement = placements.find(
        (p) =>
          p.direction === "down" &&
          selectedCell.col === p.col &&
          selectedCell.row >= p.row &&
          selectedCell.row < p.row + p.word.length
      );

      if (placement) {
        for (let i = 0; i < placement.word.length; i++) {
          highlighted.push({ row: placement.row + i, col: placement.col });
        }
      }
    }

    return highlighted;
  };

  const highlightedCells = getHighlightedCells();

  // Get across clues
  const acrossClues = placements
    .filter((p) => p.direction === "across")
    .sort((a, b) => {
      const aNum = Number.parseInt(a.clue.split(".")[0]);
      const bNum = Number.parseInt(b.clue.split(".")[0]);
      return aNum - bNum;
    });

  // Get down clues
  const downClues = placements
    .filter((p) => p.direction === "down")
    .sort((a, b) => {
      const aNum = Number.parseInt(a.clue.split(".")[0]);
      const bNum = Number.parseInt(b.clue.split(".")[0]);
      return aNum - bNum;
    });

  return (
    <div className="w-full max-w-6xl mx-auto" >
      {showConfetti && <Confetti />}
      {/* <Confetti/> */}
      {loading && <Loader />}

      {(!hasPlayed ||
        ["Sandra Kyampaire"].includes(user)) && (
        <div
          className="flex flex-col md:flex-row gap-6"
          data-tour-id="dashboard"
          
        >
          <div className="flex-1" style={{
            paddingBottom:'20%'
          }}>
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4 ">
                <div className="flex items-center gap-2">
                  <Timer
                    active={timerActive}
                    elapsedTime={elapsedTime}
                    setElapsedTime={setElapsedTime}
                  />
                  <Badge variant="outline" className="ml-2" data-tour-id="hint">
                    Hints: {5 - hintsUsed}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    data-tour-id="hintbutton"
                    size="sm"
                    variant="outline"
                    onClick={useHint}
                    disabled={completed || hintsUsed > 4}
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Hint
                  </Button>
                  <Button
                    data-tour-id="check"
                    size="sm"
                    variant="outline"
                    onClick={checkPuzzle}
                    disabled={completed}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Check
                  </Button>
                  <Button
                    data-tour-id="reset"
                    size="sm"
                    variant="outline"
                    onClick={resetPuzzle}
                    disabled={completed}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="mb-0" data-tour-id="settings">
                <Progress value={progress} />
                <div className="text-xs text-right mt-1">
                  {progress}% completed
                </div>
              </div>
              <div
                data-tour-id="direction"
                className="mt-[-4%] mb-4 text-xs text-left w-[fit-content]"
              >
                Direction : {direction}
              </div>

              <div
                className="grid grid-cols-16 gap-0 mx-auto max-w-fit"
                data-tour-id="profile"
              >
                {userGrid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const isBlackCell = solution[rowIndex]?.[colIndex] === "";
                    const isSelected =
                      selectedCell?.row === rowIndex &&
                      selectedCell?.col === colIndex;
                    const isHighlighted = highlightedCells.some(
                      (c) => c.row === rowIndex && c.col === colIndex
                    );
                    const cellNumber = numberedGrid[rowIndex]?.[colIndex] || -1;

                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        data-tour-id={!isBlackCell ? "row" : ""}
                        className={`
                        relative w-8 h-8 border border-gray-300 flex items-center justify-center
                        ${isBlackCell ? "bg-black" : "bg-white"}
                        ${isSelected ? "bg-blue-200" : ""}
                        ${isHighlighted && !isSelected ? "bg-blue-100" : ""}
                      `}
                        style={{
                          backgroundColor: isBlackCell ? "#2D3E50" : "white",
                        }}
                        onClick={() =>
                          !isBlackCell && handleCellClick(rowIndex, colIndex)
                        }
                      >
                        {cellNumber > 0 && (
                          <span className="absolute top-0 left-0.5 text-[8px] font-bold">
                            {cellNumber}
                          </span>
                        )}
                        {!isBlackCell && (
                          <input
                            ref={(el) => {
                              if (gridRefs.current) {
                                gridRefs.current[rowIndex][colIndex] = el;
                              }
                            }}
                            type="text"
                            maxLength={1}
                            value={cell}
                            onChange={(e) =>
                              handleInputChange(e, rowIndex, colIndex)
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(e, rowIndex, colIndex)
                            }
                            className={`
                            w-full h-full text-center font-bold uppercase bg-transparent
                            focus:outline-none
                            ${
                              completed &&
                              userGrid[rowIndex][colIndex] ===
                                solution[rowIndex][colIndex]
                                ? "text-green-600"
                                : completed
                                ? "text-red-600"
                                : ""
                            }
                          `}
                            disabled={completed}
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {completed && (
                <div
                  className={`mt-4 p-4 ${
                    score > 90
                      ? "bg-green-100"
                      : score > 40
                      ? "bg-green-100"
                      : "bg-red-100"
                  } rounded-lg text-center`}
                >
                  <h3
                    className={`text-xl font-bold ${
                      score > 90
                        ? "text-green-700"
                        : score > 40
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {score > 90
                      ? "Congratulations!"
                      : score > 40
                      ? "Good Job!"
                      : "There's A Next Time!"}
                  </h3>
                  <p
                    className={`${
                      score > 90
                        ? "text-green-700"
                        : score > 40
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    You completed the puzzle in {Math.floor(elapsedTime / 60)}:
                    {(elapsedTime % 60).toString().padStart(2, "0")} with{" "}
                    {hintsUsed} hints used, and scored {score}%.
                  </p>
                </div>
              )}
            </Card>
          </div>

          <div className="flex-1" style={{
            maxHeight:'88vh'
          }}>
            <Card className="p-4 h-full overflow-auto" style={{
              overflow:'scroll',
            }}>
              <div
                data-tour-id="words"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <h3 className="text-lg font-bold mb-2">Across</h3>
                  <ul className="space-y-2 text-left">
                    {acrossClues.map((clue, index) => (
                      <li
                        key={`across-${index}`}
                        className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded"
                        onClick={() => {
                          setSelectedCell({ row: clue.row, col: clue.col });
                          setDirection("across");
                          gridRefs.current[clue.row][clue.col]?.focus();
                        }}
                      >
                        {clue.clue}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Down</h3>
                  <ul className="space-y-2 text-left">
                    {downClues.map((clue, index) => (
                      <li
                        key={`down-${index}`}
                        className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded"
                        onClick={() => {
                          setSelectedCell({ row: clue.row, col: clue.col });
                          setDirection("down");
                          gridRefs.current[clue.row][clue.col]?.focus();
                        }}
                      >
                        {clue.clue}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {hasPlayed && (
        <div>
          <Button variant={"outline"} className="p-15">
            You already completed this puzzle, see you in the next!
            <br />
            Your score was : {(myScored as any)?.score || 0}%, Your time was :{" "}
            {Math.floor((myScored as any)?.time / 60)}:
            {((myScored as any)?.time % 60).toString().padStart(2, "0")}
          </Button>
        </div>
      )}
    </div>
  );
}
