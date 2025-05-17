type Props = {
  options: {
    name: string;
    value: number;
  }[];
  selected: number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Select(props: Props) {
  return (
    <select className="truncate min-w-0 px-1 py-1 rounded-md outline-none bg-white" value={props.selected} onChange={props.onChange}>
      {props.options.map(option => {
        return <option
          key={option.value}
          value={option.value}
        >{option.name}</option>
      })}
    </select>
  )
}
