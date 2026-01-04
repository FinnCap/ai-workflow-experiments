from typing import List, Optional
from uuid import UUID, uuid4

from fastapi import Depends
from sqlalchemy.orm import Session

from common.base import get_db
from common.decorators.transactional import transactional
from common.enum.node_type import NodeType
from flow.model.flow_edge_model import FlowEdgeModel
from flow.model.flow_model import FlowModel
from flow.model.flow_node_model import FlowNodeModel
from flow.repository.flow_edge_repository import FlowEdgeRepository
from flow.repository.flow_repository import FlowRepository
from flow.repository.flow_node_repository import FlowNodeRepository
from flow.web.form.create_flow_form import CreateFlowForm, EdgeForm, NodeForm
from flow.web.form.update_flow_form import UpdateFlowForm


class FlowService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db
        self.flow_repository = FlowRepository(session=db)
        self.node_repository = FlowNodeRepository(session=db)
        self.edge_repository = FlowEdgeRepository(session=db)

    @transactional
    def create_flow(self, form: CreateFlowForm) -> FlowModel:
        # Create flow
        flow = FlowModel(
            id=uuid4(),
            name=form.name,
            description=form.description,
        )

        flow = self.flow_repository.create(flow)

        # Create nodes and edges if provided
        self._create_nodes_and_edges(flow.id, form.nodes, form.edges)
        return flow

    @transactional
    def update_flow(self, flow_id: UUID, form: UpdateFlowForm) -> Optional[FlowModel]:
        flow = self.flow_repository.get_by_id(flow_id)
        if not flow:
            return None

        # Update basic fields
        if form.name is not None:
            flow.name = form.name
        if form.description is not None:
            flow.description = form.description

        # Update graph if nodes and edges provided
        if form.nodes is not None or form.edges is not None:
            # Delete existing nodes and edges
            self.edge_repository.delete_by_flow_id(flow_id)
            self.node_repository.delete_by_flow_id(flow_id)

            assert form.nodes != None
            assert form.edges != None
            # Create new ones
            self._create_nodes_and_edges(flow_id, form.nodes, form.edges)

        return self.flow_repository.update(flow)

    def get_flow(self, flow_id: UUID) -> Optional[FlowModel]:
        return self.flow_repository.get_by_id(flow_id)

    def get_all_flows(self) -> List[FlowModel]:
        return self.flow_repository.get_all()

    @transactional
    def delete_flow(self, flow_id: UUID) -> bool:
        return self.flow_repository.delete(flow_id)

    def _create_nodes_and_edges(
        self,
        flow_id: UUID,
        node_forms: List[NodeForm] | None,
        edge_forms: List[EdgeForm] | None,
    ):
        # Create node mapping from React Flow ID to database model
        react_flow_to_node = {}
        nodes = []

        node_forms = node_forms if node_forms != None else []
        for node_form in node_forms:
            node = FlowNodeModel(
                id=uuid4(),
                react_flow_id=node_form.react_flow_id,  # Store the React Flow ID
                flow_id=flow_id,
                node_type=NodeType(node_form.type),
                position=node_form.position,
                data=node_form.data,
                agent_id=node_form.agent_id,
            )

            react_flow_to_node[node_form.react_flow_id] = node
            nodes.append(node)

        self.node_repository.create_bulk(nodes)

        # Create edges using the React Flow IDs to find the correct database IDs
        edges = []
        edge_forms = edge_forms if edge_forms != None else []
        for edge_form in edge_forms:
            if (
                edge_form.source in react_flow_to_node
                and edge_form.target in react_flow_to_node
            ):
                edge = FlowEdgeModel(
                    id=uuid4(),
                    react_flow_id=edge_form.react_flow_id,  # Store the React Flow ID
                    flow_id=flow_id,
                    source_node_id=react_flow_to_node[edge_form.source].id,
                    target_node_id=react_flow_to_node[edge_form.target].id,
                    label=edge_form.label,
                    react_flow_source_handle=edge_form.source_handle,
                    react_flow_target_handle=edge_form.target_handle,
                )
                edges.append(edge)

        self.edge_repository.create_bulk(edges)
