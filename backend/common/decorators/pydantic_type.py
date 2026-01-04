from sqlalchemy import Text, TypeDecorator


class PydanticType(TypeDecorator):

    impl = Text
    cache_ok = True

    def __init__(self, pydantic_model):
        self.pydantic_model = pydantic_model
        super().__init__()

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, self.pydantic_model):
            return value.model_dump_json()
        return value

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        # Handle both string (from database) and dict (already parsed)
        if isinstance(value, str):
            return self.pydantic_model.model_validate_json(value)
        elif isinstance(value, dict):
            return self.pydantic_model.model_validate(value)
        return self.pydantic_model.model_validate_json(value)
