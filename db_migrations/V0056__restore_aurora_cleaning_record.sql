-- Восстанавливаем запись уборки для номера 2019 (Aurora)
INSERT INTO t_p9202093_hotel_design_site.cleaning_history 
  (room_number, housekeeper_name, cleaned_at, payment_amount, payment_status, created_at)
VALUES 
  ('2019', 'Шарова Диана', '2025-10-23 20:00:00', 2000.00, 'unpaid', CURRENT_TIMESTAMP);