interface SectionHeaderProps {
    label: string;
    description: string
}

export default function SectionHeader({ label, description }: SectionHeaderProps) {

    return <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{label}</h2>
        <p className="text-gray-600">{description}</p>
    </div>

}