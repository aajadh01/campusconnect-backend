// seed-admin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const exists = await User.findOne({ registeredId: 'admin01' });
    if (exists) {
      console.log('✅ Admin already exists');
      process.exit(0);
    }

    const admin = new User({
      registeredId: '11831',
      fullName: 'Admin User',
      password: 'admin123',
      role: 'admin',
    });

    await admin.save();
    console.log('✅ Admin created successfully: admin01 / admin123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
    process.exit(1);
  }
})();
