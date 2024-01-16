import { DotLottiePlayer } from '@dotlottie/react-player'
import './Button.css'
import loadingSpinner from './../../assets/animations/white-spinner.json'

type Props = {
    label: string
    onClick: () => void
    styling: 'primary' | 'secondary' | 'tertiary'
    size: 'regular' | 'small'
    highlight?: string
    heighlightPosition?: 'before' | 'after'
    disabled?: boolean
    destructive?: boolean
    loading?: boolean
}

export default function Button({ label, onClick, styling, size, highlight, heighlightPosition, disabled, destructive, loading }: Props) {

    const renderClassNames = () => {
        let className = ' button__main '

        if (styling) className = className + ` button__${styling} `
        if (size) className = className + ` button__${size} `
        if (disabled) className = className + ` button__disabled `
        if (loading) className = className + ` button__loading `
        if (destructive) className = className + ` button__destructive `

        return className
    }

    const renderContent = () => {
        if (loading) return (
            <DotLottiePlayer
                src={loadingSpinner}
                autoplay
                loop
                style={{
                    width: 'calc(var(--medium-font-size) + 10px)'
                }}
            />
        )
        if (!highlight) return label
        if (heighlightPosition === 'before') {
            return (
                <>
                    <span className='button__highlight'>{highlight}</span>
                    {label}
                </>
            )
        } else return (
            <>
                {label}
                <span className='button__highlight'>{highlight}</span>
            </>
        )
    }

    return (
        <button
            children={renderContent()}
            className={renderClassNames()}
            onClick={onClick}
            disabled={disabled}
        />
    )
}
