const { User } = require('../models/userModel');

const seedAdmin = async () => {
    try {
        console.log('🔍 Checking for admin user...');
        const adminExists = await User.findOne({ role: 'admin' });
        
        if (!adminExists) {
            console.log('📝 Creating admin user...');
            const admin = await User.create({
                firstName: 'System Admin',
                email: 'admin@medisync.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('✅ Admin user created:', admin.email);
        } else {
            console.log('✅ Admin user already exists:', adminExists.email);
        }
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
    }
};

module.exports = seedAdmin;