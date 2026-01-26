"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Camera, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import dynamic from "next/dynamic";

// Dynamically import react-pdf components with no SSR
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    )
  }
);

const Page = dynamic(
  () => import("react-pdf").then((mod) => mod.Page),
  { ssr: false }
);

export interface CustomPdfViewerProps {
  pdfUrl: string;
  initialPage?: number;
  onSnapshot?: (imageDataUrl: string, caption?: string, metadata?: { page: number; coordinates?: { x: number; y: number; width: number; height: number } }) => void;
  className?: string;
}

interface SelectionRect {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export function CustomPdfViewer({
  pdfUrl,
  initialPage = 1,
  onSnapshot,
  className = "",
}: CustomPdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [workerReady, setWorkerReady] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  const pageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);

  // Set up PDF.js worker
  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== "undefined") {
      // Use dynamic import to avoid SSR issues
      Promise.all([
        import("react-pdf").then((mod) => mod.pdfjs),
      ]).then(([pdfjs]) => {
        // Use the worker file from public folder (most reliable for Next.js)
        // The file is automatically copied during build via postinstall script
        pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;
        
        // Set worker ready after a small delay to ensure worker is initialized
        setTimeout(() => {
          setWorkerReady(true);
        }, 50);
      }).catch((err) => {
        console.error("[CustomPdfViewer] Failed to load react-pdf:", err);
        setError(`Failed to initialize PDF viewer: ${err.message || "Unknown error"}`);
      });
    }
  }, []);

  useEffect(() => {
    setPageNumber(initialPage);
  }, [initialPage]);

  // Reset error state when PDF URL changes
  useEffect(() => {
    if (pdfUrl && workerReady) {
      setError(null);
    }
  }, [pdfUrl, workerReady]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log("[CustomPdfViewer] PDF loaded successfully, pages:", numPages, "URL:", pdfUrl);
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("[CustomPdfViewer] Error loading PDF:", error);
    console.error("[CustomPdfViewer] PDF URL:", pdfUrl);
    setError(`Failed to load PDF: ${error.message || "Unknown error"}`);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(numPages, prev + 1));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(3, prev + 0.2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.2));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Handle selection mode
  const handleStartSnapshot = () => {
    setIsSelectionMode(true);
    setSelectionRect(null);
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectionRect(null);
    setIsDragging(false);
  };

  // Mouse handlers for selection
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelectionMode || !selectionRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    const rect = selectionRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    setSelectionRect({
      startX,
      startY,
      endX: startX,
      endY: startY,
    });
  }, [isSelectionMode]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelectionMode || !isDragging || !selectionRect || !selectionRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    const rect = selectionRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    
    setSelectionRect({
      ...selectionRect,
      endX,
      endY,
    });
  }, [isSelectionMode, isDragging, selectionRect]);

  const handleMouseUp = useCallback(async () => {
    if (!isSelectionMode || !isDragging || !selectionRect || !pageRef.current || !onSnapshot) {
      setIsDragging(false);
      return;
    }

    setIsDragging(false);
    
    // Calculate the selection area
    const left = Math.min(selectionRect.startX, selectionRect.endX);
    const top = Math.min(selectionRect.startY, selectionRect.endY);
    const width = Math.abs(selectionRect.endX - selectionRect.startX);
    const height = Math.abs(selectionRect.endY - selectionRect.startY);

    // Only capture if selection is large enough
    if (width < 10 || height < 10) {
      setIsSelectionMode(false);
      setSelectionRect(null);
      return;
    }

    setIsCapturing(true);
    try {
      // Capture the entire page first
      const canvas = await html2canvas(pageRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Create a new canvas for the selected area
      const selectedCanvas = document.createElement("canvas");
      selectedCanvas.width = width * 2; // Scale factor
      selectedCanvas.height = height * 2;
      const ctx = selectedCanvas.getContext("2d");
      
      if (ctx) {
        // Draw the selected portion
        ctx.drawImage(
          canvas,
          left * 2, top * 2, width * 2, height * 2, // Source
          0, 0, width * 2, height * 2 // Destination
        );
        
        const imageDataUrl = selectedCanvas.toDataURL("image/png");
        
        // Send with metadata (page number and coordinates)
        const metadata = {
          page: pageNumber,
          coordinates: {
            x: left,
            y: top,
            width: width,
            height: height,
          }
        };
        
        onSnapshot(imageDataUrl, `Page ${pageNumber} - Selected area`, metadata);
      }

      // Reset selection mode
      setIsSelectionMode(false);
      setSelectionRect(null);
    } catch (error) {
      console.error("Error capturing snapshot:", error);
    } finally {
      setIsCapturing(false);
    }
  }, [isSelectionMode, isDragging, selectionRect, pageNumber, onSnapshot]);

  // Calculate selection rectangle for display
  const getSelectionStyle = () => {
    if (!selectionRect) return {};
    
    const left = Math.min(selectionRect.startX, selectionRect.endX);
    const top = Math.min(selectionRect.startY, selectionRect.endY);
    const width = Math.abs(selectionRect.endX - selectionRect.startX);
    const height = Math.abs(selectionRect.endY - selectionRect.startY);

    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    };
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="flex items-center gap-2">
          {/* Navigation */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1 || !workerReady}
            className="h-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-gray-700 min-w-[100px] text-center">
            {pageNumber} / {numPages || "..."}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages || !workerReady}
            className="h-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Zoom Controls */}
          <div className="h-6 w-px bg-gray-300 mx-2" />
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={scale <= 0.5 || !workerReady}
            className="h-8"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-gray-600 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={scale >= 3 || !workerReady}
            className="h-8"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          {/* Rotate */}
          <div className="h-6 w-px bg-gray-300 mx-2" />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotate}
            disabled={!workerReady}
            className="h-8"
            title="Rotate"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Snapshot Button */}
        {onSnapshot && (
          <div className="flex items-center gap-2">
            {isSelectionMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelSelection}
                className="h-8"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button
              variant={isSelectionMode ? "default" : "default"}
              size="sm"
              onClick={isSelectionMode ? handleCancelSelection : handleStartSnapshot}
              disabled={isCapturing || !workerReady}
              className={`h-8 ${
                isSelectionMode 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "bg-brand-primary hover:bg-brand-primary-hover text-white"
              }`}
            >
              {isCapturing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Capturing...
                </>
              ) : isSelectionMode ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel Selection
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Take Snapshot
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* PDF Viewer */}
      <div 
        ref={containerRef}
        className={`flex-1 overflow-auto bg-gray-100 p-4 flex items-center justify-center relative ${
          isSelectionMode ? "cursor-crosshair" : ""
        }`}
      >
        {!isClient || !workerReady ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary mb-2" />
            <p className="text-sm text-gray-600">
              {!isClient ? "Initializing PDF viewer..." : "Loading PDF worker..."}
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => {
              setError(null);
            }} variant="outline">
              Retry
            </Button>
          </div>
        ) : pdfUrl ? (
          <div
            ref={selectionRef}
            className="relative"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              if (isDragging) {
                handleMouseUp();
              }
            }}
          >
            <div 
              ref={pageRef}
              className="bg-white shadow-lg"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <Document
                key={pdfUrl}
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex flex-col items-center justify-center p-8 min-w-[600px] min-h-[800px]">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-primary mb-2" />
                    <p className="text-sm text-gray-600">Loading document...</p>
                  </div>
                }
                options={{
                  cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.530/cmaps/`,
                  cMapPacked: true,
                  standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.530/standard_fonts/`,
                  httpHeaders: pdfUrl?.startsWith('http') ? {} : undefined,
                }}
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  rotate={0}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="border border-gray-200"
                />
              </Document>
            </div>
            
            {/* Selection overlay */}
            {isSelectionMode && selectionRect && (
              <div
                className="absolute border-2 border-brand-primary bg-brand-primary/10 pointer-events-none z-20"
                style={getSelectionStyle()}
              />
            )}
            
            {/* Selection mode instruction */}
            {isSelectionMode && !selectionRect && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-brand-primary text-white px-4 py-2 rounded-lg shadow-lg z-20 pointer-events-none">
                <p className="text-sm font-medium">Click and drag to select the area you want to capture</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8">
            <p className="text-sm text-gray-600">No PDF URL provided</p>
          </div>
        )}
      </div>
    </div>
  );
}
