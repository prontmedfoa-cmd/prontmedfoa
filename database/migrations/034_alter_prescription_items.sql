ALTER TABLE prescription_items

ADD COLUMN medication_id INTEGER;

ALTER TABLE prescription_items

ADD CONSTRAINT fk_prescription_item_medication

FOREIGN KEY (
    medication_id
)

REFERENCES medications(id);