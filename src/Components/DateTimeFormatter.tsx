interface DateTimeFormatterProps {
    children: Date | string;
}

const DateTimeFormatter = ({ children }: DateTimeFormatterProps) => {
    
    const formattedDateTime = typeof children === 'string' ? new Date(children).toLocaleString() : children.toLocaleString();

    return <div>{formattedDateTime}</div>;
};

export default DateTimeFormatter;
