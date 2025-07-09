// src/components/place/BasicInfoTable.tsx
'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';

interface BasicInfoTableProps {
  description?: string;
  location: { region: string; district?: string };
  createdBy: string;
  createdAt: Date;
}

export default function BasicInfoTable({
  description,
  location,
  createdBy,
  createdAt,
}: BasicInfoTableProps) {
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
            <TableCell>{createdAt.toLocaleDateString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
}
