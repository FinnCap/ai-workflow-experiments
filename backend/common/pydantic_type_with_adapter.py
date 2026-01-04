from pydantic import TypeAdapter
from sqlalchemy import Text, TypeDecorator


class PydanticTypeWithAdapter(TypeDecorator):

    impl = Text
    cache_ok = True

    def __init__(self, pydantic_model):
        self.pydantic_model = pydantic_model
        # Create a TypeAdapter for proper union handling
        self.type_adapter = TypeAdapter(pydantic_model)
        super().__init__()

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if hasattr(value, "model_dump_json"):
            return value.model_dump_json()
        return value

    def process_result_value(self, value, dialect):
        if value is None:
            return None

        # Use TypeAdapter to handle discriminated unions
        if isinstance(value, str):
            return self.type_adapter.validate_json(value)
        elif isinstance(value, dict):
            return self.type_adapter.validate_python(value)

        return self.type_adapter.validate_json(value)
