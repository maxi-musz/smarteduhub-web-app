import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQs() {
  return (
    <section className="pb-20 pt-10 lg:pt-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-heading mb-5">
            Frequently asked questions
          </h2>
          <p className="text-base lg:text-lg text-brand-secondary">
            Everything you need to know about using SmartEdu Hub to manage your
            institution.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="owners" className="w-full">
            {/* Scrollable wrapper for mobile */}
            <div className="w-full overflow-x-auto mb-8">
              <TabsList className="flex w-max gap-2 bg-[#F1F5F9] py-2.5 px-4 sm:grid sm:grid-cols-3 sm:w-full h-auto sm:gap-0 sm:overflow-visible">
                <TabsTrigger
                  value="owners"
                  className="min-w-[250px] sm:min-w-0 px-6 py-3 text-sm whitespace-nowrap data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=inactive]:text-brand-light-accent-1 hover:cursor-pointer"
                >
                  School Owners & Administrators
                </TabsTrigger>
                <TabsTrigger
                  value="teachers"
                  className="min-w-[250px] sm:min-w-0 px-6 py-3 text-sm whitespace-nowrap data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=inactive]:text-brand-light-accent-1 hover:cursor-pointer"
                >
                  Teachers & Educators
                </TabsTrigger>
                <TabsTrigger
                  value="parents"
                  className="min-w-[250px] sm:min-w-0 px-6 py-3 text-sm whitespace-nowrap data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=inactive]:text-brand-light-accent-1 hover:cursor-pointer"
                >
                  Parents & Students
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="owners">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem className="border-b-brand-border" value="setup">
                  <AccordionTrigger className="text-left text-brand-light-accent-2">
                    How long does it take to set up SmartEdu Hub for my
                    institution?
                  </AccordionTrigger>
                  <AccordionContent>
                    Setting up SmartEdu Hub typically takes 1-2 weeks depending
                    on your institution size. Our dedicated support team will
                    guide you through the entire process, including data
                    migration, staff training, and system customization.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  className="border-b-brand-border"
                  value="campuses"
                >
                  <AccordionTrigger className="text-left text-brand-light-accent-2">
                    Can SmartEdu Hub handle multiple campuses or branches?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes! SmartEdu Hub is designed to manage multiple campuses
                    from a single dashboard. You can track performance, manage
                    staff, and monitor operations across all your locations with
                    centralized reporting and analytics.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  className="border-b-brand-border"
                  value="reports"
                >
                  <AccordionTrigger className="text-left text-brand-light-accent-2">
                    What types of reports can I generate?
                  </AccordionTrigger>
                  <AccordionContent>
                    SmartEdu Hub offers comprehensive reporting including
                    student performance analytics, financial reports, attendance
                    tracking, staff productivity metrics, and custom reports
                    tailored to your specific needs.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  className="border-b-brand-border"
                  value="migration"
                >
                  <AccordionTrigger className="text-left text-brand-light-accent-2">
                    How do we handle student or staff data migration?
                  </AccordionTrigger>
                  <AccordionContent>
                    Our technical team handles all data migration securely and
                    efficiently. We support imports from Excel, CSV files, and
                    most existing school management systems. All data is
                    encrypted and handled according to educational privacy
                    standards.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem className="border-b-brand-border" value="limits">
                  <AccordionTrigger className="text-left text-brand-light-accent-2">
                    Is there a limit to the number of students or staff we can
                    add?
                  </AccordionTrigger>
                  <AccordionContent>
                    Our plans are designed to scale with your institution. From
                    small schools to large districts, we offer flexible pricing
                    tiers with no artificial limits on student or staff numbers.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="teachers">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  className="border-b-brand-border"
                  value="curriculum"
                >
                  <AccordionTrigger className="text-left text-brand-light-accent-2">
                    How can I create and manage my digital curriculum?
                  </AccordionTrigger>
                  <AccordionContent>
                    Our intuitive curriculum builder allows you to create
                    lessons, upload materials, set learning objectives, and
                    track student progress. You can organize content by subject,
                    grade level, and learning standards with drag-and-drop
                    simplicity.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  className="border-b-brand-border"
                  value="grading"
                >
                  <AccordionTrigger className="text-left text-brand-light-accent-2">
                    Does the platform help with grading and assessments?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes! SmartEdu Hub includes automated grading for multiple
                    choice and short answer questions, rubric-based grading
                    tools, and detailed analytics to help you understand student
                    performance patterns.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="parents">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  className="border-b-brand-border"
                  value="progress"
                >
                  <AccordionTrigger className="text-left text-brand-light-accent-2">
                    How can I track my child&apos;s progress?
                  </AccordionTrigger>
                  <AccordionContent>
                    Parents have access to a dedicated portal where you can view
                    real-time grades, attendance records, assignment
                    submissions, and teacher feedback. You&apos;ll also receive
                    notifications about important updates and upcoming events.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  className="border-b-brand-border"
                  value="communication"
                >
                  <AccordionTrigger className="text-left text-brand-light-accent-2">
                    How can I communicate with teachers and school staff?
                  </AccordionTrigger>
                  <AccordionContent>
                    Our platform includes secure messaging, scheduled
                    parent-teacher conferences, and announcement systems. You
                    can easily reach out to teachers, view school announcements,
                    and stay connected with your child&apos;s education.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
