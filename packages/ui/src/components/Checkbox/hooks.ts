import type { CheckboxRootProps } from "@base-ui/react/checkbox"
import type { HTMLMotionProps } from "motion/react"

export type CheckboxAdvanceProps = CheckboxRootProps & HTMLMotionProps<"button">

export function useCheckBoxHook({ onCheckedChange, ...props }: CheckboxAdvanceProps) {
  "use memo"
  const [isChecked, setIsChecked] = useState(props?.checked ?? props?.defaultChecked ?? false)

  useEffect(() => {
    if (props?.checked !== undefined) setIsChecked(props.checked)
  }, [props?.checked])

  type Parmas = Parameters<Exclude<typeof onCheckedChange, undefined>>
  function handleCheckedChange(...args: Parmas) {
    setIsChecked(args[0])
    onCheckedChange?.(...args)
  }

  return { isChecked, setIsChecked, handleCheckedChange }
}
