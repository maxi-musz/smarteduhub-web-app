import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileImage, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";

interface DownloadResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  term: string;
  studentId?: string;
  academicSessionId?: string;
}

export function DownloadResultModal({
  isOpen,
  onClose,
  term,
  studentId,
  academicSessionId,
}: DownloadResultModalProps) {
  const { toast } = useToast();
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const canDownloadPdf = Boolean(studentId && academicSessionId);

  const handleDownloadPNG = () => {
    toast({
      title: "Not available",
      description: "PNG download is not available. Use PDF to download your report card.",
      variant: "default",
    });
  };

  const handleDownloadPDF = async () => {
    if (!studentId || !academicSessionId) {
      toast({
        title: "Cannot download",
        description: "Session or student information is missing. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    setIsDownloadingPdf(true);
    try {
      const params = new URLSearchParams({ studentId, academicSessionId });
      const blob = await authenticatedApi.getBlob(`/result/download-pdf?${params.toString()}`);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-card-${studentId}-${academicSessionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Download started",
        description: `Your ${term.toLowerCase()} report card has been downloaded.`,
      });
      onClose();
    } catch (err) {
      const message =
        err instanceof AuthenticatedApiError
          ? err.message
          : "Failed to download PDF. Please try again.";
      toast({
        title: "Download failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Results
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-muted-foreground">
            You&apos;re about to download the full result for{" "}
            {term.toLowerCase()}.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadPNG}
            className="flex items-center gap-2"
          >
            <FileImage className="h-4 w-4" />
            Download PNG
          </Button>
          <Button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2"
            disabled={!canDownloadPdf || isDownloadingPdf}
          >
            <FileText className="h-4 w-4" />
            {isDownloadingPdf ? "Downloading…" : "Download PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
