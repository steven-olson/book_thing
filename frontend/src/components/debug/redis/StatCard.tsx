"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
}

export const StatCard = ({ label, value, subValue }: StatCardProps) => {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
      <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
        {value}
      </p>
      {subValue && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          {subValue}
        </p>
      )}
    </div>
  );
};
