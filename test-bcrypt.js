const bcrypt = require('bcryptjs');

async function testBcrypt() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('Password original:', password);
  console.log('Hash generado:', hash);
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('¿Coincide?', isValid);
  
  // Probar con hash que debería estar en BD
  const testHash = '$2a$10$abcdefghijklmnopqrstuvwxyz123456789';
  const isValidTest = await bcrypt.compare('admin123', testHash);
  console.log('¿Coincide con hash de prueba?', isValidTest);
}

testBcrypt();