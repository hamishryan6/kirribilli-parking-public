type Props = {
    className: string
}

export const Alert = ({ className }: Props) => {
    return (
        <svg className={className} viewBox="0 0 20 20">
            <path id="Vector" d="m17.07,2.93c-1.87-1.88-4.42-2.93-7.07-2.93S4.8,1.05,2.93,2.93C1.05,4.8,0,7.35,0,10s1.05,5.2,2.93,7.07c1.87,1.88,4.42,2.93,7.07,2.93s5.2-1.05,7.07-2.93c1.88-1.87,2.93-4.42,2.93-7.07s-1.05-5.2-2.93-7.07Zm-8.01,3.01c0-.52.42-.94.94-.94s.94.42.94.94v4.37c0,.52-.42.94-.94.94s-.94-.42-.94-.94v-4.37Zm1.82,8.69c-.23.24-.55.37-.88.37s-.65-.13-.88-.37c-.24-.23-.37-.55-.37-.88s.13-.65.37-.88c.23-.24.55-.37.88-.37s.65.13.88.37c.24.23.37.55.37.88s-.13.65-.37.88Z" />
            <path d="m11.25,13.75c0,.33-.13.65-.37.88-.23.24-.55.37-.88.37s-.65-.13-.88-.37c-.24-.23-.37-.55-.37-.88s.13-.65.37-.88c.23-.24.55-.37.88-.37s.65.13.88.37c.24.23.37.55.37.88Z" fill='#FFF' />
            <path d="m10.94,5.94v4.37c0,.52-.42.94-.94.94s-.94-.42-.94-.94v-4.37c0-.52.42-.94.94-.94s.94.42.94.94Z" fill='#FFF' />
        </svg>
    )
}