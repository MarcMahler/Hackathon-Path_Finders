// Quick test script for the backend API
const API_BASE_URL = 'http://localhost:3001/api';

async function testInventoryAPI() {
  try {
    console.log('🧪 Testing inventory API...');
    
    // Test 1: Fetch all inventory
    console.log('\n1️⃣ Testing GET /api/inventory');
    const getResponse = await fetch(`${API_BASE_URL}/inventory`);
    const getResult = await getResponse.json();
    console.log(`✅ Found ${getResult.data.length} items`);
    
    // Test 2: Update quantities
    console.log('\n2️⃣ Testing POST /api/inventory/update-quantities');
    const updateData = {
      updates: [
        { id: 'INV-001', quantity: 5 },  // Remove 5 Feldbetten
        { id: 'INV-002', quantity: 3 }   // Remove 3 Schlafsäcke
      ]
    };
    
    const updateResponse = await fetch(`${API_BASE_URL}/inventory/update-quantities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    
    const updateResult = await updateResponse.json();
    console.log('✅ Update result:', updateResult);
    
    // Test 3: Verify changes
    console.log('\n3️⃣ Verifying changes...');
    const verifyResponse = await fetch(`${API_BASE_URL}/inventory`);
    const verifyResult = await verifyResponse.json();
    const feldbetten = verifyResult.data.find(item => item.id === 'INV-001');
    const schlafsaecke = verifyResult.data.find(item => item.id === 'INV-002');
    
    console.log(`📊 Feldbetten (INV-001): ${feldbetten.available} ${feldbetten.unit}`);
    console.log(`📊 Schlafsäcke (INV-002): ${schlafsaecke.available} ${schlafsaecke.unit}`);
    
    console.log('\n🎉 API test completed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

// Run the test
testInventoryAPI();