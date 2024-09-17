"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface SongResponse {
  id: string;
  title: string;
  image_url: string;
  lyric: string;
  audio_url: string;
  video_url: string;
  created_at: string;
  model_name: string;
  status: string;
  gpt_description_prompt: string;
  prompt: string;
  type: string;
  tags: string;
}

const generatePrompt = (userData: any): string => {
  const genres = [
    "pop",
    "rock",
    "country",
    "hip-hop",
    "jazz",
    "classical",
    "electronic",
  ];
  const randomGenre = genres[Math.floor(Math.random() * genres.length)];

  return `A ${randomGenre} song about ${userData.name}, who is ${userData.age} years old and loves ${userData.hobby}. 
  Their favorite color is ${userData.favoriteColor} and their dream job is ${userData.dreamJob}. 
  The song should be upbeat and inspiring, celebrating their unique personality and aspirations.`;
};

const generateSong = async (prompt: string): Promise<SongResponse[]> => {
  const response = await fetch("https://suno-api-sigma-five.vercel.app/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
      make_instrumental: false,
      model: "chirp-v3-5",
      wait_audio: true,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to generate song");
  }

  console.log(response);
  console.log(response.json()); 
  return response.json();
};

export default function KioskForm() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    hobby: "",
    favoriteColor: "",
    dreamJob: "",
  });
  const [songs, setSongs] = useState<SongResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const prompt = generatePrompt(formData);
      const generatedSongs = await generateSong(prompt);
      setSongs(generatedSongs);
    } catch (err) {
      setError("Failed to generate song. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Kiosk Song Generator</CardTitle>
          <CardDescription>
            Fill in your details to generate a personalized song!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hobby">Favorite Hobby</Label>
              <Input
                id="hobby"
                name="hobby"
                value={formData.hobby}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="favoriteColor">Favorite Color</Label>
              <Input
                id="favoriteColor"
                name="favoriteColor"
                value={formData.favoriteColor}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dreamJob">Dream Job</Label>
              <Textarea
                id="dreamJob"
                name="dreamJob"
                value={formData.dreamJob}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Song...
                </>
              ) : (
                "Generate Song"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {songs.length > 0 && (
            <div className="mt-4 w-full">
              <h3 className="font-semibold mb-2">Your Generated Songs:</h3>
              {songs.map((song, index) => (
                <div key={song.id} className="mb-4 p-4 border rounded">
                  <h4 className="font-medium">
                    Song {index + 1}: {song.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Genre: {song.tags}
                  </p>
                  <audio controls src={song.audio_url} className="w-full mb-2">
                    Your browser does not support the audio element.
                  </audio>
                  <details>
                    <summary className="cursor-pointer text-sm text-blue-600">
                      View Lyrics
                    </summary>
                    <p className="mt-2 text-sm whitespace-pre-wrap">
                      {song.lyric}
                    </p>
                  </details>
                </div>
              ))}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
