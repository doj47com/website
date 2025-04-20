type Props = {
  value: string;
  onChange: (x: string) => void;
  placeholder?: string;
};

export default function SearchBox(props: Props) {
  return (
    <div className="max-w-md mb-2">
      <div className="relative">
        <input
          type="text"
          placeholder={props.placeholder || "Search..."}
          className="w-full px-4 py-2 rounded-2xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
    </div>
  )
}

