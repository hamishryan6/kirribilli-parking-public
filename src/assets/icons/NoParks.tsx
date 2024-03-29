type Props = {
    className: string
}

export default function NoParks({ className }: Props) {
    return (
        <svg className={className} viewBox="0 0 40 32">
            <path d="m2.43.32C1.78-.19.83-.07.32.58-.19,1.23-.07,2.17.58,2.68l37,29c.65.51,1.59.39,2.11-.26.51-.65.39-1.59-.26-2.11l-5.42-4.25V6c0-2.21-1.79-4-4-4H10c-1.35,0-2.54.67-3.27,1.69L2.43.32Zm11.76,9.22c.38-.91,1.27-1.54,2.31-1.54h4.5c3.31,0,6,2.69,6,6,0,1.64-.66,3.14-1.74,4.22l-3.21-2.52c.57-.35.95-.98.95-1.7,0-1.11-.89-2-2-2h-3v.52l-3.81-2.99h0Zm-.19,8.46v-.97l-8-6.31v15.27c0,2.21,1.79,4,4,4h20c.14,0,.29,0,.43-.02l-12.43-9.79v1.82c0,1.11-.89,2-2,2s-2-.89-2-2v-4Z" />
        </svg>
    )
}
