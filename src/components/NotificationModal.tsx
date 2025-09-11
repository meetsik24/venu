'use client';

import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function NotificationModal({ 
  isOpen, 
  onClose, 
  type, 
  title, 
  message, 
  action 
}: NotificationModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500 dark:text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />;
      case 'info':
        return <Info className="w-8 h-8 text-blue-500 dark:text-blue-400" />;
      default:
        return <Info className="w-8 h-8 text-blue-500 dark:text-blue-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/20 border-green-700/50 dark:bg-green-900/20 dark:border-green-700/50';
      case 'error':
        return 'bg-red-900/20 border-red-700/50 dark:bg-red-900/20 dark:border-red-700/50';
      case 'warning':
        return 'bg-yellow-900/20 border-yellow-700/50 dark:bg-yellow-900/20 dark:border-yellow-700/50';
      case 'info':
        return 'bg-blue-900/20 border-blue-700/50 dark:bg-blue-900/20 dark:border-blue-700/50';
      default:
        return 'bg-blue-900/20 border-blue-700/50 dark:bg-blue-900/20 dark:border-blue-700/50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className={`bg-background rounded-lg max-w-md w-full border ${getBgColor()} max-h-[90vh] overflow-y-auto`}>
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <div className="flex-shrink-0 mt-1">
                {getIcon()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold leading-tight">{title}</h3>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 flex-shrink-0 ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Message */}
          <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">{message}</p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            {action && (
              <Button
                variant="outline"
                onClick={action.onClick}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                {action.label}
              </Button>
            )}
            <Button 
              onClick={onClose}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {action ? 'Close' : 'OK'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
