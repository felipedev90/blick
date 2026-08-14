class SelfEvaluationError(Exception):
    """Levantado quando um líder tenta avaliar a si mesmo."""


class NotSubordinateError(Exception):
    """Levantado quando o avaliado não está na hierarquia do líder."""


class EmployeeNotFoundError(Exception):
    """Levantado quando um employee_id ou leader_id não existe."""
    

class NoCurrentEvaluationError(Exception):
    """Levantado quando o funcionário ainda não possui avaliação na semana atual."""