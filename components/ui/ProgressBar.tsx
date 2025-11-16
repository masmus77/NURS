import React from 'react';
import { ProgramStatus } from '../../types';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  status: ProgramStatus;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ status }) => {
  const statusConfig = {
    [ProgramStatus.NotStarted]: { width: 'w-[5%]', color: 'bg-red-500', text: '0%' },
    [ProgramStatus.InProgress]: { width: 'w-1/2', color: 'bg-yellow-500', text: '50%' },
    [ProgramStatus.Completed]: { width: 'w-full', color: 'bg-green-500', text: '100%' },
  };

  const { width, color, text } = statusConfig[status];

  return (
    <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
            <div
                className={cn('h-2.5 rounded-full transition-all duration-500 ease-in-out', color, width)}
            ></div>
        </div>
        <span className="text-sm font-medium text-gray-600 w-10 text-right">{text}</span>
    </div>
  );
};

export default ProgressBar;
