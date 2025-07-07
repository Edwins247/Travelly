'use client';

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';   // shadcn 템플릿
import { MessageCircleQuestionMark, Mail, Phone } from 'lucide-react';      // 무료 아이콘

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-6 text-sm text-muted-foreground">
      <div className="container mx-auto flex flex-col gap-6 px-4 md:flex-row md:items-start md:justify-between">
        {/* ───────────── Brand / Copyright ───────────── */}
        <div className="space-y-2">
          <Link href="/" className="text-lg font-semibold text-foreground">
            Travelly
          </Link>
          <p>© {new Date().getFullYear()} Travelly. All rights reserved.</p>
        </div>

        {/* ───────────── Quick Links ───────────── */}
        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex gap-4">
            <Link href="/terms">이용약관</Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/privacy" className="text-destructive">
              개인정보처리방침
            </Link>
          </div>

          {/* ───────────── Icon Row ───────────── */}
          <div className="flex gap-3">
            <Link href="https://github.com/your-org/travelly" aria-label="Phone-Call">
              <Phone className="h-5 w-5 hover:text-foreground" />
            </Link>
            <Link href="mailto:team@travel.ly" aria-label="E-mail">
              <Mail className="h-5 w-5 hover:text-foreground" />
            </Link>
            <Link href="https://www.figma.com/file/xxx" aria-label="FAQ">
              <MessageCircleQuestionMark className="h-5 w-5 hover:text-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
