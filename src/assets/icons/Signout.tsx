type Props = {
  className: string
}

export default function Signout({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M23.5594 13.0594C24.1453 12.4734 24.1453 11.5219 23.5594 10.9359L17.5594 4.93594C16.9734 4.35 16.0219 4.35 15.4359 4.93594C14.85 5.52188 14.85 6.47344 15.4359 7.05938L18.8766 10.5H9C8.17031 10.5 7.5 11.1703 7.5 12C7.5 12.8297 8.17031 13.5 9 13.5H18.8766L15.4359 16.9406C14.85 17.5266 14.85 18.4781 15.4359 19.0641C16.0219 19.65 16.9734 19.65 17.5594 19.0641L23.5594 13.0641V13.0594ZM7.5 4.5C8.32969 4.5 9 3.82969 9 3C9 2.17031 8.32969 1.5 7.5 1.5H4.5C2.01562 1.5 0 3.51562 0 6V18C0 20.4844 2.01562 22.5 4.5 22.5H7.5C8.32969 22.5 9 21.8297 9 21C9 20.1703 8.32969 19.5 7.5 19.5H4.5C3.67031 19.5 3 18.8297 3 18V6C3 5.17031 3.67031 4.5 4.5 4.5H7.5Z" />
    </svg>
  )
}