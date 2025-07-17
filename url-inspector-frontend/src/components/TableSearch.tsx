interface TableSearchProps {
  value: string;
  onChange: (v: string) => void;
}

export default function TableSearch({ value, onChange }: TableSearchProps) {
  return (
    <input
      className="border px-2 py-1 rounded text-sm w-full sm:w-64"
      placeholder="Search..."
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}