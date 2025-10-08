// Script to delete test records from cleaning history
const API_URL = 'https://functions.poehali.dev/31057b18-39ce-40dd-8afe-75b9fa434a82';

async function deleteRecord(id) {
  try {
    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Successfully deleted record with id="${id}"`);
      return true;
    } else {
      console.error(`❌ Failed to delete record with id="${id}":`, data.error);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error deleting record with id="${id}":`, error);
    return false;
  }
}

async function main() {
  console.log('Starting deletion of test records...\n');
  
  // Delete test record id=1
  console.log('Deleting test record with id="1"...');
  await deleteRecord('1');
  
  // Small delay between requests
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Delete test record id=3
  console.log('Deleting test record with id="3"...');
  await deleteRecord('3');
  
  console.log('\n✨ Deletion process completed!');
  console.log('📋 Note: Record id="2" (Савастеева Марина) was kept as requested.');
}

main();
