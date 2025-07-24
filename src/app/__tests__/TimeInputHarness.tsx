import React from 'react';
import { TimeInput } from '@/components/ui/form/TimeInput';

export function TimeInputHarness() {
  const [time, setTime] = React.useState('00:00');
  const [error, setError] = React.useState<string>();
  
  // Simulated Supabase schema validation
  const validateTimeFormat = (value: string): boolean => {
    const timeRegex = /^[0-5]?[0-9]:[0-5][0-9]$/;
    return timeRegex.test(value);
  };

  const handleTimeChange = (value: string) => {
    setTime(value);
    if (!validateTimeFormat(value)) {
      setError('Invalid time format. Use MM:SS');
    } else {
      setError(undefined);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-lg font-semibold mb-4">TimeInput Test Harness</h1>
      
      <div className="space-y-4">
        {/* Basic TimeInput */}
        <div>
          <h2 className="text-sm font-medium mb-2">Basic Usage</h2>
          <TimeInput
            value={time}
            onChange={handleTimeChange}
            label="Exercise Duration"
            error={error}
          />
          <div className="mt-1 text-sm text-gray-500">
            Current value: {time}
          </div>
        </div>

        {/* With Max Time */}
        <div>
          <h2 className="text-sm font-medium mb-2">With Maximum Time (5 minutes)</h2>
          <TimeInput
            value={time}
            onChange={handleTimeChange}
            maxTimeSeconds={300}
            label="Limited Duration"
          />
        </div>

        {/* Without Scrubbing */}
        <div>
          <h2 className="text-sm font-medium mb-2">Without Scrubbing</h2>
          <TimeInput
            value={time}
            onChange={handleTimeChange}
            allowScrubbing={false}
            label="No Scrub Duration"
          />
        </div>

        {/* Disabled State */}
        <div>
          <h2 className="text-sm font-medium mb-2">Disabled State</h2>
          <TimeInput
            value={time}
            onChange={handleTimeChange}
            disabled
            label="Disabled Duration"
          />
        </div>

        {/* Loading State */}
        <div>
          <h2 className="text-sm font-medium mb-2">Loading State</h2>
          <TimeInput
            value={time}
            onChange={handleTimeChange}
            loading
            label="Loading Duration"
          />
        </div>
      </div>

      {/* Debug Panel */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-sm font-medium mb-2">Debug Information</h2>
        <pre className="text-xs">
          {JSON.stringify({
            currentValue: time,
            isValid: validateTimeFormat(time),
            error,
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
