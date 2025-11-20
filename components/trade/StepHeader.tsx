export function StepHeader({ step, title }: { step: number; title: string }) {
  return (
    <div className="mb-10">
      <p className="text-sm text-gray-400">Step {step} of 6</p>
      <h1 className="text-3xl font-bold mt-1">{title}</h1>
    </div>
  );
}
