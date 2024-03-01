import {
  SPECIAL_CHARS_REGEX,
  LENGTH_REGEX,
  NUMBER_REGEX,
  UPPERCASE_REGEX,
  LOWERCASE_REGEX,
} from '@/util/validation'
import { AUTH } from '@/util/constants/constants'

interface Props {
  value: string | undefined
  className?: string
}

const rules = [
  { label: AUTH.PASSWORD.errorLength, pattern: LENGTH_REGEX },
  { label: AUTH.PASSWORD.errorUpper, pattern: UPPERCASE_REGEX },
  { label: AUTH.PASSWORD.errorLower, pattern: LOWERCASE_REGEX },
  { label: AUTH.PASSWORD.errorDigit, pattern: NUMBER_REGEX },
  { label: AUTH.PASSWORD.errorSplChar, pattern: SPECIAL_CHARS_REGEX },
]

const PwdChecklist = (props: Props) => {
  return (
    <div>
      {rules.map(rule => {
        const validationClass =
          props.value && props.value.match(rule.pattern)
            ? 'text-green-500'
            : 'text-red-500'
        return (
          <div
            key={rule.label}
            className={`${'text-sm font-light '}${validationClass}`}
          >
            {rule.label}
          </div>
        )
      })}
    </div>
  )
}

export default PwdChecklist
