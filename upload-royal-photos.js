// Скрипт для автоматического добавления фото в "Королевский люкс"
const API_URL = 'https://functions.poehali.dev/a629b99f-4972-4b9b-a55e-469c3d770ca7';
const APARTMENT_ID = 'royal';

const photos = [
  'https://cdn.poehali.dev/files/6c3840e0-1758-453e-bc73-a2d331c5e2af.jpeg',
  'https://cdn.poehali.dev/files/57eaed2b-e0ce-406d-8ddc-0c34a04fa78c.jpeg',
  'https://cdn.poehali.dev/files/4b575036-9929-4dce-bc15-3102f3337404.jpeg',
  'https://cdn.poehali.dev/files/c33fd2a6-b0de-4060-a57a-e53a2bf7062c.jpeg',
  'https://cdn.poehali.dev/files/a352fb3c-8650-4fdf-8a93-30507db8c015.jpeg'
];

async function uploadPhotos() {
  try {
    console.log('🔍 Загружаю текущие данные...');
    
    // Получаем текущие данные
    const response = await fetch(`${API_URL}?apartment_id=${APARTMENT_ID}`);
    const currentData = await response.json();
    
    console.log('📊 Текущие данные:', currentData);
    
    // Объединяем существующие фото с новыми
    const existingPhotos = currentData?.images || [];
    const allPhotos = [...new Set([...existingPhotos, ...photos])];
    
    console.log(`📸 Всего фотографий: ${allPhotos.length}`);
    
    // Сохраняем данные
    const saveResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apartment_id: APARTMENT_ID,
        title: currentData?.title || 'Королевский люкс',
        description: currentData?.description || 'Премиум апартаменты с уникальным дизайном',
        images: allPhotos,
        pdf_files: currentData?.pdf_files || [],
        videos: currentData?.videos || [],
        instruction_text: currentData?.instruction_text || '',
        important_notes: currentData?.important_notes || '',
        contact_info: currentData?.contact_info || '',
        wifi_info: currentData?.wifi_info || '',
        parking_info: currentData?.parking_info || '',
        house_rules: currentData?.house_rules || ''
      })
    });
    
    const result = await saveResponse.json();
    
    if (result.success) {
      console.log('✅ УСПЕШНО! Фотографии добавлены в "Королевский люкс"');
      console.log(`📸 Всего фотографий в галерее: ${allPhotos.length}`);
    } else {
      console.error('❌ Ошибка:', result.message);
    }
    
  } catch (error) {
    console.error('❌ Ошибка при загрузке:', error);
  }
}

// Запускаем загрузку
uploadPhotos();
