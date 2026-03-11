"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Badge } from "../ui/badge";
import { logSessionDuration } from "@/lib/actions";
import { toast } from "sonner";
import { Volume2, VolumeX } from "lucide-react";

const presetSeconds = {
  rest: 1 * 60,
  "25min": 25 * 60,
  "45min": 45 * 60,
  "90min": 90 * 60,
};

const initialSeconds = presetSeconds["25min"];

type TimerStatus =
  | "not started"
  | "running"
  | "paused"
  | "completed"
  | "stopped";

export default function Timer({ allCompleted }: { allCompleted: boolean }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<TimerStatus>("not started");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [soundOn, setSoundOn] = useState(true);

  const clickAudio = useRef<HTMLAudioElement | null>(null);
  const successAudio = useRef<HTMLAudioElement | null>(null);
  const pauseAudio = useRef<HTMLAudioElement | null>(null);
  const resumeAudio = useRef<HTMLAudioElement | null>(null);
  const resetAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickAudio.current = new Audio("/sounds/click.mp3");
    successAudio.current = new Audio("/sounds/success.mp3");
    pauseAudio.current = new Audio("/sounds/pause.mp3");
    resumeAudio.current = new Audio("/sounds/resume.mp3");
    resetAudio.current = new Audio("/sounds/reset.mp3");
    // Optionally call .load() on each
  }, []);

  function playSound(
    ref: React.RefObject<HTMLAudioElement | null>,
    soundOn: boolean,
  ) {
    if (!soundOn || !ref.current) return;
    ref.current.currentTime = 0;
    ref.current.play();
  }

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            setIsRunning(false);
            setStatus("completed");
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  useEffect(() => {
    if (allCompleted) {
      setIsRunning(false);
      setStatus("paused");
      playSound(successAudio, soundOn);
      toast.success(
        "all tasks completed! end the timer and take a break! or reset the timer. you do you!",
        {
          position: "top-center",
          duration: 4000,
        },
      );
    }
  }, [allCompleted]);

  useEffect(() => {
    if (status === "completed" && startTime) {
      playSound(successAudio, soundOn);
      const endTime = new Date();
      const duration = Math.floor(
        (endTime.getTime() - startTime.getTime()) / 1000,
      );
      (async () => {
        try {
          const { success, error } = await logSessionDuration(duration);
          if (success) {
            toast.success("Session duration logged successfully");
          } else {
            toast.error(`Failed to log session duration: ${error}`);
          }
        } catch (e) {
          toast.error(
            "An unexpected error occurred while logging session duration",
          );
        }
        setStartTime(null);
      })();
    }
  }, [status, startTime, soundOn]);

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  function handleStartPause() {
    if (
      status === "not started" ||
      status === "stopped" ||
      status === "completed"
    ) {
      playSound(clickAudio, soundOn);
      // setSeconds(initialSeconds); // Only reset for a new session
      setIsRunning(true);
      setStatus("running");
      setStartTime(new Date());
    } else if (status === "paused") {
      playSound(resumeAudio, soundOn);
      setIsRunning(true);
      setStatus("running");
      // Do NOT reset seconds or startTime here
    } else if (status === "running") {
      playSound(pauseAudio, soundOn);

      setIsRunning(false);
      setStatus("paused");
    }
  }

  function handleReset() {
    playSound(resetAudio, soundOn);
    setIsRunning(false);
    setSeconds(initialSeconds);
    setStatus("not started");
    setStartTime(null);
  }

  function handleSelectPreset(seconds: number) {
    playSound(clickAudio, soundOn);
    setIsRunning(false);
    setSeconds(seconds);
    setStatus("not started");
    setStartTime(null);
  }

  async function handleEnd() {
    playSound(successAudio, soundOn);
    setIsRunning(false);
    // setSeconds(initialSeconds);
    setStatus("stopped");
    setSeconds(initialSeconds);

    if (startTime) {
      const endTime = new Date();
      const duration = Math.floor(
        (endTime.getTime() - startTime.getTime()) / 1000,
      );
      try {
        const { success, error } = await logSessionDuration(duration);
        if (success) {
          toast.success("Session duration logged successfully");
        } else {
          toast.error(`Failed to log session duration: ${error}`);
        }
      } catch (e) {
        toast.error(
          "An unexpected error occurred while logging session duration",
        );
      }
    }

    setStartTime(null);
  }

  return (
    <div className="flex flex-col items-center justify-center my-8 gap-3 relative">
      <Button
        className="absolute top-13 right-8 text-muted-foreground"
        variant="ghost"
        size="icon"
        aria-label={soundOn ? "Mute sound" : "Unmute sound"}
        onClick={() => setSoundOn((prev) => !prev)}
      >
        {soundOn ? <Volume2 /> : <VolumeX />}
      </Button>

      <ButtonGroup>
        {Object.entries(presetSeconds).map(([key, value]) => (
          <Button
            className={seconds === value ? "bg-primary/80" : ""}
            key={key}
            onClick={() => handleSelectPreset(value)}
          >
            <span>{key}</span>
          </Button>
        ))}
      </ButtonGroup>
      <p className="text-4xl font-bold">
        {seconds > 0 ? formatTime(seconds) : "00:00"}
      </p>
      {status !== "not started" && <Badge variant="outline">{status}</Badge>}
      <div className="flex flex-row gap-2">
        <Button onClick={handleStartPause}>
          {status === "running"
            ? "Pause"
            : status === "stopped" || status === "completed"
              ? "Restart"
              : "Start"}
        </Button>
        <Button onClick={handleReset} disabled={status === "not started"}>
          Reset
        </Button>
        {(status === "paused" || status === "running") && (
          <Button variant="destructive" onClick={handleEnd}>
            End
          </Button>
        )}
      </div>
    </div>
  );
}
