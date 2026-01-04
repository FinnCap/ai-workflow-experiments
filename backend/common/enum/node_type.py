import enum


class NodeType(enum.Enum):
    INPUT = "input"
    OUTPUT = "output"
    AGENT = "agent"
    DECISION = "decision"
    PARALLEL = "parallel"
    MERGE = "merge"
