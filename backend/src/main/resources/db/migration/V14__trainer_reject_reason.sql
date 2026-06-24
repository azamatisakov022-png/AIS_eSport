-- Причина отказа по заявке тренера (согласованность с остальными модулями; QA-ревью).
ALTER TABLE trainer_applications ADD COLUMN reject_reason TEXT;
