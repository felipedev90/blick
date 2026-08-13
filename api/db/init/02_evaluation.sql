-- ============================================================
-- Tabelas de avaliação: cabeçalho e respostas.
-- ============================================================

CREATE TABLE evaluation (
    id           SERIAL          PRIMARY KEY,
    leader_id    INT             NOT NULL,
    employee_id  INT             NOT NULL,
    week_key     CHAR(7)         NOT NULL,
    created_at   TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_evaluation_leader
        FOREIGN KEY (leader_id) REFERENCES employee(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_evaluation_employee
        FOREIGN KEY (employee_id) REFERENCES employee(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    -- Um líder não pode avaliar a si mesmo
    CONSTRAINT chk_no_self_evaluation
        CHECK (leader_id <> employee_id),

    -- Uma avaliação por semana para cada par líder-funcionário
    CONSTRAINT uq_evaluation_week
        UNIQUE (leader_id, employee_id, week_key)
);

CREATE INDEX idx_evaluation_employee ON evaluation(employee_id);
CREATE INDEX idx_evaluation_leader ON evaluation(leader_id);

CREATE TABLE evaluation_answer (
    id             SERIAL      PRIMARY KEY,
    evaluation_id  INT         NOT NULL,
    question_key   VARCHAR(50) NOT NULL,
    score          SMALLINT    NOT NULL,

    CONSTRAINT fk_answer_evaluation
        FOREIGN KEY (evaluation_id) REFERENCES evaluation(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT chk_score_range
        CHECK (score BETWEEN 1 AND 4),

    -- Cada pergunta só pode aparecer uma vez por avaliação
    CONSTRAINT uq_answer_question
        UNIQUE (evaluation_id, question_key)
);

CREATE INDEX idx_answer_evaluation ON evaluation_answer(evaluation_id);