"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Badge } from "../ui/badge";
import { logSessionDuration } from "@/lib/actions";
import { toast } from "sonner";
import { playSound } from "@/lib/helpers";
import { Volume2, VolumeX } from "lucide-react";

const presetSeconds = {
  rest: 1 * 60,
  "25min": 25 * 60,
  "45min": 45 * 60,
  "90min": 90 * 60,
};

const initialSeconds = presetSeconds["rest"];

type TimerStatus =
  | "not started"
  | "running"
  | "paused"
  | "completed"
  | "stopped";

export default function Timer() {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<TimerStatus>("not started");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [soundOn, setSoundOn] = useState(true);

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
    if (status === "completed" && startTime) {
      playSound("/sounds/success.mp3", soundOn);
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
  }, [status, startTime]);

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
      playSound("/sounds/click.mp3", soundOn);
      setSeconds(initialSeconds); // Only reset for a new session
      setIsRunning(true);
      setStatus("running");
      setStartTime(new Date());
    } else if (status === "paused") {
      playSound("/sounds/resume.mp3", soundOn);
      setIsRunning(true);
      setStatus("running");
      // Do NOT reset seconds or startTime here
    } else if (status === "running") {
      playSound("/sounds/pause.mp3", soundOn);

      setIsRunning(false);
      setStatus("paused");
    }
  }

  function handleReset() {
    playSound("/sounds/reset.mp3", soundOn);
    setIsRunning(false);
    setSeconds(initialSeconds);
    setStatus("not started");
    setStartTime(null);
  }

  function handleSelectPreset(seconds: number) {
    playSound("/sounds/click.mp3", soundOn);
    setIsRunning(false);
    setSeconds(seconds);
    setStatus("not started");
    setStartTime(null);
  }

  async function handleEnd() {
    playSound("/sounds/success.mp3", soundOn);
    setIsRunning(false);
    // setSeconds(initialSeconds);
    setStatus("stopped");

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
