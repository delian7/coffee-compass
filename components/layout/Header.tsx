import { Button } from '@/components/ui/button';
import { Coffee, MenuIcon } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-md py-4 px-5 flex justify-between items-center z-10 md:hidden">
      <div className="flex items-center">
        <Coffee className="text-coffee-primary text-xl mr-2" />
        <h1 className="font-poppins font-bold text-xl text-coffee-primary">CoffeeMap</h1>
      </div>
      <Button
        variant="default"
        size="icon"
        className="bg-coffee-primary text-white rounded-full p-2 shadow-md hover:bg-opacity-90 transition-colors"
        onClick={onMenuClick}
      >
        <MenuIcon className="h-5 w-5" />
      </Button>
    </header>
  );
}
