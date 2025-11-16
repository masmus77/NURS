import React from 'react';
import { ProgramStatus } from '../../types';
import { cn } from '../../lib/utils';
import { Circle, Loader2, CheckCircle2 } from 'lucide-react';

interface StatusIndicatorProps {
  status: ProgramStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const statusConfig = {
    [ProgramStatus.NotStarted]: { 
        icon: <Circle className="h-4 w-4" />, 
        text: 'Not Started', 
        textColor: 'text-red-700',
        bgColor: 'bg-red-100',
    },
    [ProgramStatus.InProgress]: { 
        icon: <Loader2 className="h-4 w-4 animate-spin" />, 
        text: 'In Progress', 
        textColor: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
    },
    [ProgramStatus.Completed]: { 
        icon: <CheckCircle2 className="h-4 w-4" />, 
        text: 'Completed', 
        textColor: 'text-green-700',
        bgColor: 'bg-green-100',
    },
  };

  const { icon, text, textColor, bgColor } = statusConfig[status];

  return (
    <div className={cn('inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-sm font-medium', bgColor, textColor)}>
      {icon}
      <span>{text}</span>
    </div>
  );
};

export default StatusIndicator;
