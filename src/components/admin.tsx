"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  Trash2,
  Save,
  BarChart3,
  PuzzleIcon,
  FileText,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAxios from "./hooks/useAxios";
import Loader from "./loader";

export default function AdminPage({
  adminCallback,
}: {
  adminCallback: () => void;
}) {
  const [puzzles, setPuzzles] = useState([]);

  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [puzzleName, setPuzzleName] = useState("");
  const [puzzleDifficulty, setPuzzleDifficulty] = useState("");
  const [puzzleDescription, setPuzzleDescription] = useState("");
  const [puzzleCategroy, setPuzzleCategory] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [tab, setTab] = useState("puzzle");

  const [wordPuzzle, setWordPuzzle] = useState("");
  const [hint, setHint] = useState("");
  const { post, get, loading } = useAxios(
    "https://puzzle-gamma-lyart.vercel.app/api"
  );

  const [words, setWords] = useState<any[]>([]);

  const [newWord, setNewWord] = useState({ word: "", hint: "", category: "" });

  useEffect(() => {
    get("/v1?r=g_wds")
      .then((res) => {
        console.log(res);
        if (res.length > 0) {
          setWords(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return setRefresh(false);
  }, [refresh]);
  const handleAddWord = async () => {
    if (newWord.word && newWord.hint) {
      await handleSaveWord();
    }
  };

  const handleRemoveWord = (id: any) => {
    setWords(words.filter((word) => word.id !== id));
  };

  useEffect(() => {
    get("/v1?r=g_pz")
      .then((res) => {
        console.log(res);
        if (res.length > 0) {
          setPuzzles(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return setRefresh(false);
  }, [refresh]);
  const handleSavePuzzle = async () => {
    if (!puzzleDescription || !puzzleDifficulty || !puzzleName)
      return alert("missing fields");
    post("/v1?r=p_pz", {
      name: puzzleName,
      difficulty: puzzleDifficulty,
      description: puzzleDescription,
      category: puzzleCategroy,
    })
      .then((res) => {
        console.log(res);
        alert("puzzle created");
        setPuzzleDescription((t) => "");
        setPuzzleDifficulty((t) => "");
        setPuzzleCategory((t) => "");
        setPuzzleName((t) => "");
        setRefresh(true);
      })
      .catch((err) => {
        console.log(err);
        alert("an error occured");
      });
  };
  const handleSaveWord = async () => {
    if (!newWord.word || !newWord.hint || !wordPuzzle)
      return alert("missing fields");

    console.log(newWord);
    post("/v1?r=p_wds", {
      word: newWord.word,
      hint: newWord.hint,
      puzzle: wordPuzzle,
    })
      .then((res) => {
        console.log(res);
        alert("word created");
        setWordPuzzle((t) => "");

        setWords([...words, { id: words.length + 1, ...newWord }]);
        setNewWord({ word: "", hint: "", category: "" });
        setRefresh(true)
      })
      .catch((err) => {
        console.log(err);
        alert("an error occured");
      });
  };
  return (
    <div className="container mx-auto py-10">
      {loading && <Loader />}
      <div className="flex justify-between items-center mb-[18%]">
        <div>
          <h1 className="text-3xl font-bold">Puzzle Admin Dashboard</h1>
          <p className="text-muted-foreground"></p>
        </div>

        <Button className="bg-[#276D8D] text-white" onClick={adminCallback}>
          <PlusCircle className="mr-2 h-4 w-4 text-white" />
          Close Portal
        </Button>
      </div>
      <br />
      <br />
      <div defaultValue="puzzles" className="space-y-4">
        <div
          className="flex items-center justify-between mb-5"
          style={{
            width: "35%",
            marginBottom: "1%",
          }}
        >
          <Button
            className="flex"
            variant={"outline"}
            onClick={() => {
              setTab("puzzle");
            }}
          >
            <PuzzleIcon className="mr-2 h-4 w-4" />
            <p>Puzzles</p>
          </Button>
          <Button
            className="flex"
            variant={"outline"}
            onClick={() => {
              setTab("word");
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            <p>Words</p>
          </Button>
          <Button
            className="flex"
            variant={"outline"}
            onClick={() => alert("comming soon")}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            <p>Results</p>
          </Button>
        </div>

        {tab === "puzzle" && (
          <div className="puzzle">
            <Card className="p-5">
              <h4>Add Puzzle</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="">
                  <label htmlFor="title" className="text-right w-[100%]">
                    Puzzle Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Enter puzzle title"
                    value={puzzleName}
                    onChange={(e) => {
                      setPuzzleName(e.target.value);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="difficulty">Difficulty</label>
                  <select
                    value={puzzleDifficulty}
                    onChange={(e) => {
                      setPuzzleDifficulty(e.target.value);
                    }}
                  >
                    <option value="">~ select ~</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="title">Puzzle Category</label>
                <Input
                  id="category"
                  placeholder="Enter puzzle category"
                  value={puzzleCategroy}
                  onChange={(e) => {
                    setPuzzleCategory(e.target.value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  placeholder="Enter puzzle description"
                  value={puzzleDescription}
                  onChange={(e) => {
                    setPuzzleDescription(e.target.value);
                  }}
                />
              </div>
              <Button
                className="w-full bg-[#4B4B4B] text-white"
                onClick={() => {
                  handleSavePuzzle();
                }}
                disabled={loading}
              >
                <Save className="mr-2 h-4 w-4 text-white" />
                Save Puzzle
              </Button>
            </Card>

            <Card style={{
              marginTop:'10px'
            }}>
              <CardHeader>
                <CardTitle>Existing Puzzles</CardTitle>
                <CardDescription>
                  Manage your existing word puzzles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Words</TableHead>
                      <TableHead>Completions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {puzzles.map((puzzle: any) => (
                      <TableRow key={puzzle.id}>
                        <TableCell className="font-medium">
                          {puzzle.name}
                        </TableCell>
                        <TableCell>{puzzle.description}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              puzzle.difficulty === "easy"
                                ? "bg-[#D5D8DC]"
                                : puzzle.difficulty === "medium"
                                ? "bg-[#3088AF]"
                                : "bg-[#C47B10]"
                            }`}
                          >
                            {puzzle.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>{puzzle.wordCount}</TableCell>
                        <TableCell>{puzzle.completions}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPuzzle(puzzle as any)}
                            >
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {tab == "word" && (
          <div className="word">
            <Card className="p-4">
              <div className="space-y-2">
                <label htmlFor="puzzle-select">Select Puzzle</label>
                <select
                  value={wordPuzzle}
                  onChange={(e) => setWordPuzzle(e.target.value)}
                  className="border rounded px-2 py-1" // optional styling
                >
                  <option key={'default'} value="" selected>
                    ~ select puzzle ~
                  </option>
                  {puzzles?.map((puzzle: any) => (
                    <option key={puzzle.name} value={puzzle.name.toString()}>
                      {puzzle.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <label htmlFor="word">Word</label>
                    <Input
                      id="word"
                      placeholder="Enter word"
                      value={newWord.word}
                      onChange={(e) =>
                        setNewWord({ ...newWord, word: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="hint">Hint</label>
                    <Input
                      id="hint"
                      placeholder="Enter hint"
                      value={newWord.hint}
                      onChange={(e) =>
                        setNewWord({ ...newWord, hint: e.target.value })
                      }
                    />
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="category">Category (Optional)</Label>
                    <Input
                      id="category"
                      placeholder="Enter category"
                      value={newWord.category}
                      onChange={(e) =>
                        setNewWord({ ...newWord, category: e.target.value })
                      }
                    />
                  </div> */}
                </div>
                <div className=""></div>
                <Button
                  onClick={handleAddWord}
                  disabled={loading}
                  variant={"outline"}
                  className="w-[100%] mt-5"
                  style={{
                    marginTop: "20px",
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Word
                </Button>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-4">Word List</h3>
                <div className="space-y-2" style={{
                  overflow:'scroll',
                  maxHeight:'400px'
                }}>
                  {words.map((word) => (
                    <div
                      key={word.id}
                      className="flex items-center justify-between p-3 border rounded-md mt-[5px]"
                      style={{
                        marginTop:'10px'
                      }}
                    >
                      <div>
                        <p className="font-medium">{word.word}</p>
                        <p className="text-sm text-muted-foreground">
                          Hint: {word.hint}
                        </p>
                        {word.category && (
                          <Badge variant="outline" className="mt-1">
                            {word.category}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveWord(word.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
