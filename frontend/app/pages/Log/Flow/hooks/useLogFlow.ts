import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { LogService } from '../../common/log-service';
import type { FlowLogDetailResponse } from '../../common/log-type';

export function useLogFlow() {
    const navigate = useNavigate();
    const { flowExecutionId } = useParams();
    const [flowDetail, setFlowDetail] = useState<FlowLogDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (flowExecutionId) {
            loadFlowDetail();
        }
    }, [flowExecutionId]);

    const loadFlowDetail = async () => {
        try {
            setIsLoading(true);
            const data = await LogService.getFlowLogDetails(flowExecutionId!);
            setFlowDetail(data);
        } catch (err) {
            setError('Failed to load flow log details');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleNodeExpansion = (nodeId: string) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        setExpandedNodes(newExpanded);
    };

    const copyToClipboard = async (text: string, itemId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedItems(prev => new Set(prev).add(itemId));
            setTimeout(() => {
                setCopiedItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(itemId);
                    return newSet;
                });
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const navigateBack = () => {
        navigate("/log")
    }

    return {
        isLoading,
        error,

        flowDetail,
        copiedItems,

        copyToClipboard,

        toggleNodeExpansion,
        expandedNodes,

        navigateBack
    };
}