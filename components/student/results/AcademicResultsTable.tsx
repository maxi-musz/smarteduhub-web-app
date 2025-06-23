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

interface AcademicResult {
  id: string;
  date: string;
  subject: string;
  ca1: number;
  ca2: number;
  ca3: number;
  exam: number | string;
  total: number | string;
  grade: string;
}

const mockResults: Record<string, AcademicResult[]> = {
  "Current Term": [
    {
      id: "1",
      date: "2025-04-15",
      subject: "Mathematics",
      ca1: 7,
      ca2: 9,
      ca3: 10,
      exam: "Not taken",
      total: "Not available yet",
      grade: "Not available yet",
    },
    {
      id: "2",
      date: "2025-04-15",
      subject: "English Language",
      ca1: 8,
      ca2: 7,
      ca3: 9,
      exam: "Not taken",
      total: "Not available yet",
      grade: "Not available yet",
    },
    {
      id: "3",
      date: "2025-04-15",
      subject: "Civic Education",
      ca1: 9,
      ca2: 8,
      ca3: 8,
      exam: "Not taken",
      total: "Not available yet",
      grade: "Not available yet",
    },
    {
      id: "4",
      date: "2025-04-15",
      subject: "Physics",
      ca1: 6,
      ca2: 7,
      ca3: 8,
      exam: "Not taken",
      total: "Not available yet",
      grade: "Not available yet",
    },
    {
      id: "5",
      date: "2025-04-15",
      subject: "Biology",
      ca1: 9,
      ca2: 10,
      ca3: 9,
      exam: "Not taken",
      total: "Not available yet",
      grade: "Not available yet",
    },
    {
      id: "6",
      date: "2025-04-15",
      subject: "Chemistry",
      ca1: 5,
      ca2: 6,
      ca3: 7,
      exam: "Not taken",
      total: "Not available yet",
      grade: "Not available yet",
    },
    {
      id: "7",
      date: "2025-04-15",
      subject: "Further Mathematics",
      ca1: 8,
      ca2: 9,
      ca3: 10,
      exam: "Not taken",
      total: "Not available yet",
      grade: "Not available yet",
    },
    {
      id: "8",
      date: "2025-04-15",
      subject: "Geography",
      ca1: 7,
      ca2: 8,
      ca3: 9,
      exam: "Not taken",
      total: "Not available yet",
      grade: "Not available yet",
    },
    {
      id: "9",
      date: "2025-04-15",
      subject: "Computer Science",
      ca1: 7,
      ca2: 8,
      ca3: 9,
      exam: "Not taken",
      total: "Not available yet",
      grade: "Not available yet",
    },
  ],
  "Previous Term": [
    {
      id: "10",
      date: "2024-12-15",
      subject: "Mathematics",
      ca1: 8,
      ca2: 9,
      ca3: 9,
      exam: 65,
      total: 91,
      grade: "A",
    },
    {
      id: "11",
      date: "2024-12-15",
      subject: "English Language",
      ca1: 7,
      ca2: 8,
      ca3: 8,
      exam: 58,
      total: 81,
      grade: "B+",
    },
  ],
  All: [],
};

// Combine all results for "All" tab
mockResults["All"] = [
  ...mockResults["Current Term"],
  ...mockResults["Previous Term"],
];

export function AcademicResultsTable() {
  const [activeTerm, setActiveTerm] = useState("Current Term");
  const [selectedSubject, setSelectedSubject] = useState<AcademicResult | null>(
    null
  );
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const terms = ["Current Term", "Previous Term", "All"];
  const currentResults = mockResults[activeTerm] || [];

  const handleViewDetails = (result: AcademicResult) => {
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
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Subject</TableHead>
                  <TableHead className="font-semibold">CA1 (10)</TableHead>
                  <TableHead className="font-semibold">CA2 (10)</TableHead>
                  <TableHead className="font-semibold">CA3 (10)</TableHead>
                  <TableHead className="font-semibold">Exam (70)</TableHead>
                  <TableHead className="font-semibold">Total (100)</TableHead>
                  <TableHead className="font-semibold">Grade</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentResults.length > 0 ? (
                  currentResults.map((result) => (
                    <TableRow
                      key={result.id}
                      className="transition-colors hover:bg-brand-border/30"
                    >
                      <TableCell>{result.date}</TableCell>
                      <TableCell className="font-medium">
                        {result.subject}
                      </TableCell>
                      <TableCell>{result.ca1}</TableCell>
                      <TableCell>{result.ca2}</TableCell>
                      <TableCell>{result.ca3}</TableCell>
                      <TableCell>{result.exam}</TableCell>
                      <TableCell>{result.total}</TableCell>
                      <TableCell>
                        {result.grade === "Not available yet" ? (
                          <Badge variant="secondary">{result.grade}</Badge>
                        ) : (
                          <Badge variant="default">{result.grade}</Badge>
                        )}
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
                      colSpan={9}
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
