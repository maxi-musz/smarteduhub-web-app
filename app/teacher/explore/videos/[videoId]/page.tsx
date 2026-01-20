"use client";

import { useParams } from "next/navigation";
import { VideoPlayerPage } from "@/components/explore/video/VideoPlayerPage";

export default function TeacherExploreVideoPlayerPage() {
  const params = useParams();
  const videoId = params.videoId as string;

  return <VideoPlayerPage videoId={videoId} basePath="/teacher" />;
}

