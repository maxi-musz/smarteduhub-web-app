"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Plus, Search, Trash2 } from "lucide-react";

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: string;
  recipient: string;
  recipientType: "teacher" | "student" | "class";
  status: "sent" | "draft" | "archived";
  date: string;
  priority: "high" | "medium" | "low";
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      subject: "End of Term Examination Schedule",
      content:
        "Please find attached the examination schedule for the upcoming end of term assessments.",
      sender: "Admin",
      recipient: "All Teachers",
      recipientType: "teacher",
      status: "sent",
      date: "2024-02-15",
      priority: "high",
    },
    {
      id: "2",
      subject: "Parent-Teacher Meeting",
      content:
        "Reminder about the upcoming parent-teacher meeting scheduled for next week.",
      sender: "Admin",
      recipient: "Class 10A",
      recipientType: "class",
      status: "sent",
      date: "2024-02-14",
      priority: "medium",
    },
    {
      id: "3",
      subject: "Library Access Update",
      content:
        "New library access protocols will be implemented starting next month.",
      sender: "Admin",
      recipient: "All Students",
      recipientType: "student",
      status: "draft",
      date: "2024-02-13",
      priority: "low",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState<Partial<Message>>({
    subject: "",
    content: "",
    recipient: "",
    recipientType: "teacher",
    priority: "medium",
    status: "draft",
  });

  const handleAddMessage = () => {
    if (!newMessage.subject || !newMessage.content || !newMessage.recipient) {
      alert("Please fill in all required fields");
      return;
    }

    const { ...restNewMessage } = newMessage as Message;
    const message: Message = {
      ...restNewMessage,
    };
    setMessages([...messages, message]);
    setIsAddModalOpen(false);
    setNewMessage({
      subject: "",
      content: "",
      recipient: "",
      recipientType: "teacher",
      priority: "medium",
      status: "draft",
    });
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter((message) => message.id !== id));
  };

  // Filter messages based on search query and status filter
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.recipient.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || message.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Message Management</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Compose New Message</DialogTitle>
                <DialogDescription>
                  Create a new message to send to teachers, students, or classes
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="subject">Subject*</Label>
                  <Input
                    id="subject"
                    value={newMessage.subject}
                    onChange={(e) =>
                      setNewMessage({ ...newMessage, subject: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Message Content*</Label>
                  <Input
                    id="content"
                    value={newMessage.content}
                    onChange={(e) =>
                      setNewMessage({ ...newMessage, content: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Recipient Type</Label>
                    <Select
                      value={newMessage.recipientType}
                      onValueChange={(value: "teacher" | "student" | "class") =>
                        setNewMessage({ ...newMessage, recipientType: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select recipient type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="class">Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="recipient">Recipient*</Label>
                    <Input
                      id="recipient"
                      value={newMessage.recipient}
                      onChange={(e) =>
                        setNewMessage({
                          ...newMessage,
                          recipient: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Priority</Label>
                  <Select
                    value={newMessage.priority}
                    onValueChange={(value: "high" | "medium" | "low") =>
                      setNewMessage({ ...newMessage, priority: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddMessage}>Send Message</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Messages</p>
                <h3 className="text-2xl font-bold">{messages.length}</h3>
              </div>
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Sent Messages</p>
                <h3 className="text-2xl font-bold text-green-600">
                  {messages.filter((m) => m.status === "sent").length}
                </h3>
              </div>
              <MessageCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Draft Messages</p>
                <h3 className="text-2xl font-bold text-yellow-600">
                  {messages.filter((m) => m.status === "draft").length}
                </h3>
              </div>
              <MessageCircle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{message.subject}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[300px]">
                        {message.content}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{message.recipient}</div>
                      <Badge variant="outline" className="mt-1">
                        {message.recipientType}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        message.status === "sent" ? "default" : "destructive"
                      }
                    >
                      {message.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(message.priority)}>
                      {message.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{message.date}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteMessage(message.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMessages;
