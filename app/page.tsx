"use client";

import { useEffect, useState } from "react";
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
import { Loader2, X } from "lucide-react";
import { Grid2 } from "@mui/material";
import Form from "./form";
import Image from "next/image";

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

const fetchSongs = async () => {
  const response = await fetch(
    "https://suno-api-sigma-five.vercel.app/api/get"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch songs");
  }

  return response.json();
};

export default function KioskForm() {
  const [songs, setSongs] = useState<SongResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedSong, setExpandedSong] = useState<SongResponse | null>(null);

  const handleSongClick = (song: SongResponse) => {
    setExpandedSong(expandedSong?.id === song.id ? null : song);
  };

  const updateSongs = async () => {
    fetchSongs().then((data) => {
      setSongs(data);
    });
  };

  useEffect(() => {
    updateSongs();
    const intervalId = setInterval(() => {
      updateSongs();
    }, 5000); // 10000 milliseconds = 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 w-full max-w-3xl mx-auto">
      <Form />
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {songs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Your Generated Songs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            {songs.map((song) => (
              <div key={song.id} className="w-full max-w-md">
                <Card
                  className="cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => handleSongClick(song)}
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-center">
                      {song.title}
                    </h3>
                    <p className="text-sm mb-4 text-center">
                      Genre: {song.tags}
                    </p>
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      <Image
                        src={song.image_url}
                        alt={song.title}
                        width={1000}
                        height={1000}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {expandedSong && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setExpandedSong(null)}
        >
          <Card
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2>{expandedSong.title}</h2>
                <Button variant="ghost" onClick={() => setExpandedSong(null)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  {expandedSong.video_url ? (
                    <video
                      src={expandedSong.video_url}
                      controls
                      poster={expandedSong.image_url}
                      className="w-full h-full object-cover rounded"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <>
                      <Image
                        src={expandedSong.image_url}
                        alt={expandedSong.title}
                        width={1000}
                        height={1000}
                        className="w-full h-full object-cover rounded"
                      />
                      <audio
                        controls
                        src={expandedSong.audio_url}
                        className="w-full mb-4"
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </>
                  )}
                </div>
                <p>Genre: {expandedSong.tags}</p>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-xl font-semibold mb-2">Lyrics</h3>
                <p className="whitespace-pre-wrap">{expandedSong.lyric}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
