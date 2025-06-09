'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

type Competition = {
  id: number;
  name: string;
  emblemUrl?: string;
};

type Props = {
  competitions: Competition[];
  selectedLeagueId: number | null;
  onSelectLeague: (id: number) => void;
};

export function LeagueSidebar({ competitions, selectedLeagueId, onSelectLeague }: Props) {
  const [open, setOpen] = useState(false);

  const renderList = (
    <ScrollArea className="h-full p-4 space-y-2">
      {competitions.map((comp) => (
        <Button
          key={comp.id}
          variant={comp.id === selectedLeagueId ? 'secondary' : 'ghost'}
          className="w-full justify-start gap-2"
          onClick={() => {
            onSelectLeague(comp.id);
            setOpen(false); // close sheet if mobile
          }}
        >
          {comp.emblemUrl && (
            <Image
              src={comp.emblemUrl}
              alt={comp.name}
              width={20}
              height={20}
              className="rounded-sm object-contain"
            />
          )}
          {comp.name}
        </Button>
      ))}
    </ScrollArea>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen border-r bg-white">
        <div className="p-4 text-lg font-semibold">Leagues</div>
        {renderList}
      </aside>

      {/* Mobile sidebar toggle */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4 text-lg font-semibold">Leagues</div>
          {renderList}
        </SheetContent>
      </Sheet>
    </>
  );
}
