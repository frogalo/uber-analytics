// components/ui/Circle.tsx
interface CircleProps {
  title: string;
  value: string | number;
  description: string;
  unit?: string;
}

export default function Circle({
  title,
  value,
  description,
  unit,
}: CircleProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-full border-2 shadow-md bg-[var(--color-data-5)] border-[var(--color-data-2)]`}
    >
      {title && <div className="text-xl">{title}</div>}
      <div className="text-2xl font-bold">
        {value}
        {unit}
      </div>
      {/* <div className="text-sm text-gray-600">{description}</div> */}
    </div>
  );
}
