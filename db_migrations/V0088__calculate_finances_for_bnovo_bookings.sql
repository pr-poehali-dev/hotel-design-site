-- Обновить финансовые показатели для всех бронирований из Bnovo
-- Используем ставку комиссии по умолчанию 20% и комиссию агрегатора 25%

UPDATE t_p9202093_hotel_design_site.bookings
SET 
    aggregator_commission = 25.0,
    tax_and_bank_commission = ROUND((total_amount - (total_amount * 0.25)) * 0.07, 2),
    remainder_before_management = ROUND(total_amount - (total_amount * 0.25) - ((total_amount - (total_amount * 0.25)) * 0.07), 2),
    management_commission = ROUND((total_amount - (total_amount * 0.25) - ((total_amount - (total_amount * 0.25)) * 0.07)) * 0.20, 2),
    remainder_before_expenses = ROUND((total_amount - (total_amount * 0.25) - ((total_amount - (total_amount * 0.25)) * 0.07)) * 0.80, 2),
    operating_expenses = 3500.00,
    owner_funds = GREATEST(0, ROUND((total_amount - (total_amount * 0.25) - ((total_amount - (total_amount * 0.25)) * 0.07)) * 0.80 - 3500, 2))
WHERE source = 'bnovo' 
  AND status = 'confirmed'
  AND (owner_funds IS NULL OR owner_funds = 0);