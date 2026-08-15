import type { FieldValues, Path, UseFormRegister } from 'react-hook-form'

const SCORE_OPTIONS = [1, 2, 3, 4] as const

type ScoreRadioGroupProps<T extends FieldValues> = {
  name: Path<T>
  register: UseFormRegister<T>
}

export function ScoreRadioGroup<T extends FieldValues>({
  name,
  register,
}: ScoreRadioGroupProps<T>) {
  return (
    <div className="flex gap-2">
      {SCORE_OPTIONS.map((score) => (
        <label
          key={score}
          className="flex flex-1 cursor-pointer items-center justify-center rounded-md border border-border py-2 text-sm text-text-muted transition-colors duration-300  hover:border-accent hover:text-accent has-checked:border-accent has-checked:text-accent has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
        >
          <input type="radio" value={score} {...register(name)} className="sr-only" />
          {score}
        </label>
      ))}
    </div>
  )
}
