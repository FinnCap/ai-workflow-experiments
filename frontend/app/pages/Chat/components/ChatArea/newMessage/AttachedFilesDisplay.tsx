import { FileText, X } from "lucide-react";
import type { PDFContent } from "~/pages/Chat/common/message-type";



interface AttachedFilesDisplayProps {
    removeAttachedFile: (index: number) => void;
    attachedFiles: PDFContent[]
}

export default function AttachedFilesDisplay(
    { removeAttachedFile, attachedFiles }: AttachedFilesDisplayProps
) {

    return <div className="mb-4 space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Attached Files:</h4>
        <div className="space-y-2">
            {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                        <FileText size={20} className="text-red-600" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">{file.file_name}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => removeAttachedFile(index)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    </div>
}