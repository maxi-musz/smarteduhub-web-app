"use client";

import { useParams } from "next/navigation";
import { VideoPlayerPage } from "@/components/explore/VideoPlayerPage";

export default function AdminExploreVideoPlayerPage() {
  const params = useParams();
  const videoId = params.videoId as string;

  return <VideoPlayerPage videoId={videoId} basePath="/admin" />;
}


