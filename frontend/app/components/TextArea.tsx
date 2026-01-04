interface TextAreaProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required: boolean;
    extraDescription?: string;
    rows?: number;
}

export default function TextArea({ label, value, onChange, placeholder, required, extraDescription, rows }: TextAreaProps) {

    return <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            required={required}
            rows={rows === undefined ? 3 : rows}
        />
        {extraDescription && <p className="mt-1 text-sm text-gray-500">{extraDescription}</p>}
    </div>
} 