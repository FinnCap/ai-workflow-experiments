export default function LineObject({ halfHeight = false }) {
    return (
        <>
            <div className={`absolute -left-4 top-0 w-px bg-gray-300 ${halfHeight ? 'bottom-1/2' : 'bottom-[-8px]'}`}></div>
            <div className="absolute -left-4 top-1/2 w-4 h-px bg-gray-300"></div>
        </>
    );
}