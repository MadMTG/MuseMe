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
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface LyricResponse {
  lyrics: string;
}

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

interface UserData {
  name: string;
  nickname: string;
  style: string;
  mood: string;
  briefDescription: string;
  keyWords: string;
  relationshipToPerson: string;
  specialEventOrMemory: string;
}

const generatePrompt = (userData: UserData): string => {
  return `
  Name: ${userData.name}
  Nickname: ${userData.nickname}
  Style: ${userData.style}
  Mood: ${userData.mood}
  Brief Description: ${userData.briefDescription}
  Key Words: ${userData.keyWords}
  Relationship: ${userData.relationshipToPerson}
  Special Event: ${userData.specialEventOrMemory}
  `;
};

const generateLyrics = async (prompt: string): Promise<LyricResponse> => {
  const response = await fetch("/api/lyrics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: prompt,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to generate song");
  }
  return response.json();
};

const displayLyrics = (lyrics: string): JSX.Element => {
  // Remove ``` from the start and end of the lyrics
  lyrics = lyrics.replace(/```/g, "");
  const sections = lyrics.trim().split("\n\n");

  return (
    <>
      {sections.map((section, index) => {
        const [title, ...lines] = section.split("\n");
        return (
          <div key={index} className="mb-6">
            <h2 className="text-2xl font-bold mb-2 text-primary">
              {title.replace(/[\[\]]/g, "")}
            </h2>
            {lines.map((line, lineIndex) => (
              <p key={lineIndex} className="text-foreground">
                {line}
              </p>
            ))}
          </div>
        );
      })}
    </>
  );
};

const generateSong = async (
  lyrics: string,
  style: string,
  mood: string
): Promise<SongResponse[]> => {
  const response = await fetch(
    "https://suno-api-sigma-five.vercel.app/api/custom_generate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: lyrics,
        tags: style + ", " + mood,
        make_instrumental: false,
        wait_audio: false,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to generate song");
  }

  return response.json();
};

export default function KioskForm() {
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    style: "",
    mood: "",
    briefDescription: "",
    keyWords: "",
    relationshipToPerson: "",
    specialEventOrMemory: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lyrics, setLyrics] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLyricSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const prompt = generatePrompt(formData);
      const response = await generateLyrics(prompt);
      setLyrics(response.lyrics);
      // Handle the generated songs as needed
    } catch (err) {
      console.error(err);
      setError("Failed to generate song. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSongSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await generateSong(lyrics, formData.style, formData.mood);
      console.log(response);
      // Handle the generated songs as needed
    } catch (err) {
      console.error(err);
      setError("Failed to generate song. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>MuseMe: The Birth Place of Dom the Dominator&apos;s Anthem</CardTitle>
          <CardDescription>
            Speak of glory or speak of shame, we&apos;ll craft a song and give them fame!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLyricSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Person&apos;s Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter the person's name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                placeholder="Enter a nickname (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Input
                id="style"
                name="style"
                value={formData.style}
                onChange={handleInputChange}
                required
                placeholder="Enter the style of the song (e.g., pop, rock)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <Input
                id="mood"
                name="mood"
                value={formData.mood}
                onChange={handleInputChange}
                required
                placeholder="Enter the mood of the song (e.g., happy, sentimental)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="briefDescription">
                Brief Description of Person
              </Label>
              <Textarea
                id="briefDescription"
                name="briefDescription"
                value={formData.briefDescription}
                onChange={handleInputChange}
                required
                rows={3}
                placeholder="Provide a brief description of the person"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyWords">Key Words or Phrases to Include</Label>
              <Textarea
                id="keyWords"
                name="keyWords"
                value={formData.keyWords}
                onChange={handleInputChange}
                required
                rows={3}
                placeholder="Enter key words or phrases to include in the song"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationshipToPerson">
                Your Relationship to the Person
              </Label>
              <Input
                id="relationshipToPerson"
                name="relationshipToPerson"
                value={formData.relationshipToPerson}
                onChange={handleInputChange}
                required
                placeholder="Enter your relationship to the person (e.g., friend, sibling)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialEventOrMemory">
                Special Event or Memory
              </Label>
              <Textarea
                id="specialEventOrMemory"
                name="specialEventOrMemory"
                value={formData.specialEventOrMemory}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Describe a special event or memory to highlight in the song"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Lyrics...
                </>
              ) : (
                "Generate Lyrics"
              )}
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </CardContent>
      </Card>

      {lyrics && (
        <Card className="w-full max-w-3xl mx-auto mt-6">
          <CardHeader>
            <CardTitle>Generated Lyrics</CardTitle>
            <CardDescription>
              Here&apos;s the personalized song lyrics based on the details you
              provided
            </CardDescription>
          </CardHeader>
          <CardContent>
            {displayLyrics(lyrics)}
            <form onSubmit={handleSongSubmit} className="space-y-6">
              <Button className="w-full" disabled={isLoading}>
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
        </Card>
      )}
    </>
  );
}
