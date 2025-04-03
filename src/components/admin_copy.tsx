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

  const [wordPuzzle, setWordPuzzle] = useState("");
  const [hint, setHint] = useState("");
  const { post, get, loading } = useAxios(
    "https://vercel-functions-eta.vercel.app/api"
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

    console.log(newWord)
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
      })
      .catch((err) => {
        console.log(err);
        alert("an error occured");
      });
  };
  return (
    <div className="container mx-auto py-10">
      {loading && <Loader/>}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Puzzle Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Create and manage word puzzles
          </p>
        </div>
        <Button className="bg-[#276D8D]" onClick={adminCallback}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Close Portal
        </Button>
      </div>

      <Tabs defaultValue="puzzles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="puzzles">
            <PuzzleIcon className="mr-2 h-4 w-4" />
            Puzzles
          </TabsTrigger>
          <TabsTrigger value="words">
            <FileText className="mr-2 h-4 w-4" />
            Words
          </TabsTrigger>
          <TabsTrigger value="results">
            <BarChart3 className="mr-2 h-4 w-4" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="puzzles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Puzzle</CardTitle>
              <CardDescription>
                Set up a new word puzzle for your users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Puzzle Title</Label>
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
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={puzzleDifficulty}
                    onValueChange={(e) => {
                      setPuzzleDifficulty(e);
                    }}
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Puzzle Category</Label>
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
                <Label htmlFor="description">Description</Label>
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
                className="w-full bg-[#4B4B4B]"
                onClick={() => {
                  handleSavePuzzle();
                }}
                disabled={loading}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Puzzle
              </Button>
            </CardContent>
          </Card>

          <Card>
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
        </TabsContent>

        <TabsContent value="words" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Words to Puzzle</CardTitle>
              <CardDescription>
                Create words for your selected puzzle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="puzzle-select">Select Puzzle</Label>
                <Select
                value={wordPuzzle}
                  onValueChange={(e) => {
                    setWordPuzzle(e);
                  }}
                >
                  <SelectTrigger id="puzzle-select">
                    <SelectValue placeholder="Select a puzzle" />
                  </SelectTrigger>
                  <SelectContent>
                    {puzzles.map((puzzle: any) => (
                      <SelectItem key={puzzle.name} value={puzzle.name.toString()}>
                        {puzzle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="word">Word</Label>
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
                    <Label htmlFor="hint">Hint</Label>
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
                <Button onClick={handleAddWord} disabled={loading}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Word
                </Button>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-4">Word List</h3>
                <div className="space-y-2">
                  {words.map((word) => (
                    <div
                      key={word.id}
                      className="flex items-center justify-between p-3 border rounded-md"
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Puzzle Results</CardTitle>
              <CardDescription>
                View statistics and results for your puzzles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Completions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">435</div>
                    <p className="text-xs text-muted-foreground">
                      +22% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Completion Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3m 42s</div>
                    <p className="text-xs text-muted-foreground">
                      -18s from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Success Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <p className="text-xs text-muted-foreground">
                      +5% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Puzzle</TableHead>
                    <TableHead>Completions</TableHead>
                    <TableHead>Avg. Time</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Most Missed Word</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Animal Kingdom
                    </TableCell>
                    <TableCell>145</TableCell>
                    <TableCell>2m 58s</TableCell>
                    <TableCell>82%</TableCell>
                    <TableCell>platypus</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Space Exploration
                    </TableCell>
                    <TableCell>87</TableCell>
                    <TableCell>4m 12s</TableCell>
                    <TableCell>65%</TableCell>
                    <TableCell>nebula</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Food & Cuisine
                    </TableCell>
                    <TableCell>203</TableCell>
                    <TableCell>3m 05s</TableCell>
                    <TableCell>89%</TableCell>
                    <TableCell>quinoa</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}