'use client';
import React from 'react';
import { format } from 'date-fns';

interface ReviewItemProps {
  content: string;
  userTags: string[];
  createdAt: Date;
}

export function ReviewItem({ content, userTags, createdAt }: ReviewItemProps) {
  return (
    <div className="space-y-1 border-b pb-4">
      <div className="flex flex-wrap gap-2">
        {userTags.map((tag) => (
          <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
            #{tag}
          </span>
        ))}
      </div>
      <p className="mt-1 whitespace-pre-wrap">{content}</p>
      <p className="text-xs text-muted-foreground">
        {format(createdAt, 'yyyy.MM.dd HH:mm')}
      </p>
    </div>
  );
}
