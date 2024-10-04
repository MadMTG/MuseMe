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
  return `Compose a ${userData.style} song in a ${userData.mood} mood that incorporates the following:

- A brief description of the person: "${userData.briefDescription}"
- Key words or phrases to include: "${userData.keyWords}"
- The song is being requested by ${userData.name}, who is the ${userData.relationshipToPerson} of the person.
- Special event or memory to highlight: "${userData.specialEventOrMemory}"

The song should be heartfelt, humorous, and appropriate for all guests.`;
};

const generateSong = async (prompt: string): Promise<SongResponse[]> => {
  const response = await fetch(
    "https://suno-api-sigma-five.vercel.app/api/generate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        make_instrumental: false,
        model: "chirp-v3-5",
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
      await generateSong(prompt);
      // Handle the generated songs as needed
    } catch (err) {
      console.error(err);
      setError("Failed to generate song. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Personalized Song Generator</CardTitle>
        <CardDescription>
          Share details to generate a personalized and memorable song!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Person's Name</Label>
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
                Generating Song...
              </>
            ) : (
              "Generate Song"
            )}
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
