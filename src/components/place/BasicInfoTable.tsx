'use client';

import React from 'react';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Label } from '@/components/ui/label';

interface BasicInfoTableProps {
  description?: string;
  location: { region: string; district?: string };
  createdBy: string;
  createdAt: string;
}

export default function BasicInfoTable({
  description,
  location,
  createdBy,
  createdAt,
}: BasicInfoTableProps) {
  const d = new Date(createdAt);

  // ko-KR 을 명시
  const dateStr = d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">Basic Information</h2>
      <Table>
        <TableBody>
          {description && (
            <TableRow>
              <TableCell>
                <Label>Description</Label>
              </TableCell>
              <TableCell>{description}</TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell>
              <Label>Location</Label>
            </TableCell>
            <TableCell>
              {location.region}
              {location.district && `, ${location.district}`}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Label>Created by</Label>
            </TableCell>
            <TableCell>{createdBy}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Label>Created at</Label>
            </TableCell>
            <TableCell>
              {dateStr}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
}
