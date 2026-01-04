import { ArrowLeft, Plus } from "lucide-react";
import PrimaryBtn from "./PrimaryBtn";

interface PageHeaderProps {
    headline: string;
    description: string;

    showBack: boolean;
    backAction?: () => void
    backActionText?: string

    showAdd: boolean;
    addAction?: () => void
    addActionText?: string
}

export default function PageHeader({ headline, description, showBack, backAction, backActionText, showAdd, addAction, addActionText }: PageHeaderProps) {

    return <div className="mb-6">
        {showBack &&
            <button
                onClick={backAction}
                className="flex items-center cursor-pointer space-x-2 text-gray-600 hover:text-gray-900 mb-4"
            >
                <ArrowLeft size={20} />
                <span>{backActionText}</span>
            </button>
        }

        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{headline}</h1>
                <p className="text-gray-600 mt-2">{description}</p>
            </div>
            {showAdd &&
                <PrimaryBtn
                    label={addActionText!!} onClick={addAction!!} icon={Plus}
                />
            }
        </div>
    </div>
}