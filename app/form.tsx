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
  relationshipToCouple: string;
  userDescription: string;
  coupleDescription: string;
  storyAboutCouple: string;
  roastOrShoutout: string;
}

const generatePrompt = (userData: UserData): string => {
  const genres = [
    "uplifting pop",
    "heartfelt acoustic",
    "light-hearted folk",
    "cheerful country",
    "feel-good rock",
    "sentimental ballad",
  ];
  const randomGenre = genres[Math.floor(Math.random() * genres.length)];

  return `Compose a ${randomGenre} song that incorporates the following:

- A description of the requester: "${userData.userDescription}"
- A description of the couple: "${userData.coupleDescription}"
- A funny or unforgettable story about the bride or groom: "${userData.storyAboutCouple}"
- A playful roast or special shout-out to someone at the wedding: "${userData.roastOrShoutout}"
- The song is being requested by ${userData.name}, who is the ${userData.relationshipToCouple} of the couple.

The song should be humorous and heartfelt, celebrating the occasion and the unique personalities involved. Make sure it's appropriate for all guests at the wedding.`;
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
    relationshipToCouple: "",
    userDescription: "",
    coupleDescription: "",
    storyAboutCouple: "",
    roastOrShoutout: "",
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
        <CardTitle>Wedding Song Generator</CardTitle>
        <CardDescription>
          Share your stories to generate a personalized and humorous song for the
          wedding!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relationshipToCouple">
              Your Relationship to the Couple
            </Label>
            <Input
              id="relationshipToCouple"
              name="relationshipToCouple"
              value={formData.relationshipToCouple}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userDescription">Describe Yourself</Label>
            <Textarea
              id="userDescription"
              name="userDescription"
              value={formData.userDescription}
              onChange={handleInputChange}
              required
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coupleDescription">Describe the Couple</Label>
            <Textarea
              id="coupleDescription"
              name="coupleDescription"
              value={formData.coupleDescription}
              onChange={handleInputChange}
              required
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storyAboutCouple">
              Share a funny or unforgettable story about the bride or groom that
              perfectly captures who they are. Don&apos;t hold back—even the
              embarrassing moments are welcome!
            </Label>
            <Textarea
              id="storyAboutCouple"
              name="storyAboutCouple"
              value={formData.storyAboutCouple}
              onChange={handleInputChange}
              required
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roastOrShoutout">
              Is there someone at the wedding you&apos;d like to playfully roast or
              give a special shout-out to? Share a humorous anecdote or
              something that makes them stand out.
            </Label>
            <Textarea
              id="roastOrShoutout"
              name="roastOrShoutout"
              value={formData.roastOrShoutout}
              onChange={handleInputChange}
              required
              rows={4}
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
