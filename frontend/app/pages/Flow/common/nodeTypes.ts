import { AgentNode } from "../components/nodes/AgentNode";
import { DecisionNode } from "../components/nodes/DecisionNode";
import { InputNode } from "../components/nodes/InputNode";
import { MergeNode } from "../components/nodes/MergeNode";
import { OutputNode } from "../components/nodes/OutputNode";
import { ParallelNode } from "../components/nodes/ParallelNode";

export const nodeTypes = {
    input: InputNode,
    output: OutputNode,
    agent: AgentNode,
    parallel: ParallelNode,
    merge: MergeNode,
    decision: DecisionNode,
};
