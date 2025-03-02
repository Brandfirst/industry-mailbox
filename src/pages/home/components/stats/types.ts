
import { LucideIcon } from 'lucide-react';

export type StatData = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export type LogoData = {
  name: string;
  className: string;
};

export type Section = {
  id: string;
  title: string;
  component: React.ReactNode;
};
