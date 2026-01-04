interface InputFieldProps<T extends string | number> {
    label: string;
    value: T;
    onChange: (value: T) => void;
    placeholder?: string;
    required: boolean;
    extraDescription?: string;
    type?: T extends number ? 'number' : 'text';
    min?: number;
    max?: number;
    step?: number;
}

export default function InputField<T extends string | number>({
    label,
    value,
    onChange,
    placeholder,
    required,
    extraDescription,
    type = 'text' as any,
    min,
    max,
    step
}: InputFieldProps<T>) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'number') {
            onChange(parseFloat(e.target.value) as T);
        } else {
            onChange(e.target.value as T);
        }
    };

    return <div>
        <label className={`block text-sm font-medium text-gray-800 ${!extraDescription ? 'mb-1' : ''}`}>
            {label}
        </label>
        {extraDescription && <p className="mt-1 text-xs text-gray-500 mb-1">{extraDescription}</p>}
        <input
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required={required}
        />
    </div>
}