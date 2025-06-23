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

interface DownloadResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  term: string;
}

export function DownloadResultModal({
  isOpen,
  onClose,
  term,
}: DownloadResultModalProps) {
  const { toast } = useToast();

  const handleDownloadPNG = () => {
    toast({
      title: "Download Started",
      description: `Downloading ${term.toLowerCase()} results as PNG...`,
    });
    onClose();
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Download Started",
      description: `Downloading ${term.toLowerCase()} results as PDF...`,
    });
    onClose();
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
          >
            <FileText className="h-4 w-4" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
