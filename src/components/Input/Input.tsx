import './Input.css'

type Props = {
    id: string
    label: string
    placeholder?: string
    value: string
    onChange: (input: string) => void
    size: 'regular' | 'large'
    error?: boolean
    errorMessage?: string
    htmlType?: string
    autoFocus?: boolean
}

export default function Input({ id, label, placeholder, value, onChange, size, error, errorMessage, autoFocus, htmlType }: Props) {

    const renderClassNames = () => {
        let className = ' input__main '

        if (size) className = className + ` input__${size} `
        if (error) className = className + ` input__error `

        return className
    }

    return (
        <div className={renderClassNames()} >
            <label children={label} htmlFor={`input__${id}`} />
            {error && <p className='message-error'>{errorMessage}</p>}
            <input
                type={htmlType}
                autoFocus={autoFocus}
                id={`input__${id}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    )
}
