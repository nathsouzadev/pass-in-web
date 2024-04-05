import { ComponentProps } from "react";

interface TableDataProps extends ComponentProps<"td"> {}

export function TableData(props: TableDataProps) {
    return(
        <td {...props} className={`py-3 px-4 text-sm text-zinc-300 ${props.className}`}/>
    )
}