// src/app/components/JobCard.tsx
"use client";

import React from "react";
import { MapPin, Briefcase, BadgeDollarSign, Clock, ExternalLink, Building2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { timeAgo, stripHtml } from "@/lib/utils";

export type Job = {
  id?: string | number;
  title: string;
  company: string;
  location?: string;
  jobType?: string;
  salary?: string;
  description?: string;
  source?: string;
  sourceJobId?: string;
  jobUrl?: string;
  postedAt?: string;
  fetchedAt?: string;
};

export const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  return (
    <Card className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-zinc-200 flex flex-col group h-full">
      <CardHeader className="p-5 pb-4 border-b border-zinc-50/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-zinc-900 leading-tight group-hover:text-[#2b7fff] transition-colors line-clamp-2">
              {job.title}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="p-1.5 bg-zinc-100 rounded-md">
                <Building2 className="size-4 text-zinc-500" />
              </div>
              <p className="text-sm font-medium text-zinc-700">{job.company}</p>
            </div>
          </div>
          {job.source && (
            <Badge className="text-xs shrink-0 bg-[#f0f7ff] text-[#2b7fff] border border-[#d6eaff] shadow-sm font-semibold px-2.5 py-0.5">
              {job.source}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2 text-xs font-medium text-zinc-600">
          {job.location && (
            <span className="flex items-center gap-1.5 bg-zinc-100 px-2.5 py-1 rounded-md">
              <MapPin className="size-3.5 text-zinc-500" /> {job.location}
            </span>
          )}
          {job.jobType && (
            <span className="flex items-center gap-1.5 bg-zinc-100 px-2.5 py-1 rounded-md">
              <Briefcase className="size-3.5 text-zinc-500" /> {job.jobType}
            </span>
          )}
          {job.salary && (
            <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-md">
              <BadgeDollarSign className="size-3.5" /> {job.salary}
            </span>
          )}
          {job.postedAt && (
            <span className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md">
              <Clock className="size-3.5" /> {timeAgo(job.postedAt)}
            </span>
          )}
        </div>

        {job.description && (
          <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">
            {stripHtml(job.description)}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto">
        {job.jobUrl ? (
          <a
            href={job.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex justify-center items-center gap-2 text-sm font-semibold text-white bg-[#2b7fff] hover:bg-blue-700 py-2.5 rounded-lg transition-colors"
          >
            Apply Now <ExternalLink className="size-4" />
          </a>
        ) : (
          <span className="w-full text-center text-sm text-zinc-400 py-2.5 bg-zinc-100 rounded-lg">
            No link available
          </span>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
