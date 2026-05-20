export interface Step {
  title: string
  body: string
}

export function StepByStepBlock({ steps }: { steps: Step[] }) {
  return (
    <ol className="flex flex-col gap-0">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-4 border-2 border-cc-black -mt-[2px] first:mt-0 p-5 bg-cc-white">
          <span
            aria-hidden="true"
            className="flex items-center justify-center w-12 h-12 bg-cc-magenta text-white font-bold text-xl shrink-0"
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="flex flex-col gap-1">
            <h4 className="text-lg font-bold leading-tight">{s.title}</h4>
            <p className="text-base leading-relaxed">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
