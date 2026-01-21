"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { SubjectDetailsModal } from "./SubjectDetailsModal";
import { DownloadResultModal } from "./DownloadResultModal";
import {
  StudentResultsData,
  StudentSubjectResult,
} from "@/hooks/student/use-student-results";

interface AcademicResultsTableProps {
  data: StudentResultsData | undefined;
  isLoading: boolean;
  errorMessage: string | null;
}

export function AcademicResultsTable({
  data,
  isLoading,
  errorMessage,
}: AcademicResultsTableProps) {
  const [activeTerm, setActiveTerm] = useState("Current Term");
  const [selectedSubject, setSelectedSubject] =
    useState<StudentSubjectResult | null>(null);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const terms = ["Current Term"];
  const currentResults = data?.subjects ?? [];

  const handleViewDetails = (result: StudentSubjectResult) => {
    setSelectedSubject(result);
    setShowSubjectModal(true);
  };

  const handleDownload = () => {
    setShowDownloadModal(true);
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Academic Results
          </CardTitle>

          {/* Term Selection Badges */}
          <div className="flex gap-2 mt-4">
            {terms.map((term) => (
              <Button
                key={term}
                variant={activeTerm === term ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTerm(term)}
                className="rounded-full"
              >
                {term === "Current Term" ? "Current Term" : term}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-brand-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-brand-border">
                  <TableHead className="font-semibold">Subject</TableHead>
                  <TableHead className="font-semibold">CA</TableHead>
                  <TableHead className="font-semibold">Exam</TableHead>
                  <TableHead className="font-semibold">Total</TableHead>
                  <TableHead className="font-semibold">Percentage</TableHead>
                  <TableHead className="font-semibold">Grade</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-brand-light-accent-1 py-8"
                    >
                      Loading results...
                    </TableCell>
                  </TableRow>
                ) : errorMessage ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-red-600 py-8"
                    >
                      {errorMessage}
                    </TableCell>
                  </TableRow>
                ) : currentResults.length > 0 ? (
                  currentResults.map((result) => (
                    <TableRow
                      key={result.subject_id}
                      className="transition-colors hover:bg-brand-border/30"
                    >
                      <TableCell className="font-medium">
                        {result.subject_name}
                      </TableCell>
                      <TableCell>{result.ca_score ?? "—"}</TableCell>
                      <TableCell>{result.exam_score ?? "—"}</TableCell>
                      <TableCell>
                        {result.total_score}/{result.total_max_score}
                      </TableCell>
                      <TableCell>{result.percentage}%</TableCell>
                      <TableCell>
                        <Badge variant="default">{result.grade}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(result)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDownload}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                      <TableCell
                      colSpan={7}
                      className="text-center text-brand-light-accent-1 py-8"
                    >
                      No results available for {activeTerm.toLowerCase()}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <SubjectDetailsModal
        isOpen={showSubjectModal}
        onClose={() => setShowSubjectModal(false)}
        subject={selectedSubject}
      />

      <DownloadResultModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        term={activeTerm}
      />
    </>
  );
}
