type Props = {
    className: string
}

export default function ChevronLeft({ className }: Props) {
    return (
        <svg viewBox="0 0 8 14" className={className}>
            <path d="M0.292139 7.70626C-0.0984859 7.31563 -0.0984859 6.68125 0.292139 6.29063L6.29214 0.290628C6.68276 -0.0999966 7.31714 -0.0999966 7.70776 0.290628C8.09839 0.681253 8.09839 1.31563 7.70776 1.70625L2.41401 7.00001L7.70464 12.2938C8.09526 12.6844 8.09526 13.3188 7.70464 13.7094C7.31401 14.1 6.67964 14.1 6.28901 13.7094L0.289013 7.70938L0.292139 7.70626Z" />
        </svg>
    )
}
