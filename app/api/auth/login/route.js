import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let users = [];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request) {
  try {
    const { phone, password } = await request.json();

    // Validation
    if (!phone || !password) {
      return NextResponse.json(
        { error: 'Утасны дугаар болон нууц үг шаардлагатай' },
        { status: 400 }
      );
    }

    // Find user by phone
    const user = users.find(u => u.phone === phone);

    if (!user) {
      return NextResponse.json(
        { error: 'Хэрэглэгч олдсонгүй' },
        { status: 404 }
      );
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Нууц үг буруу байна' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        phone: user.phone,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success
    const { password: _, ...userWithoutPassword } = user;
    // Always include accounts property for dashboard compatibility
    if (!userWithoutPassword.accounts) {
      userWithoutPassword.accounts = [];
    }
    return NextResponse.json({
      message: 'Амжилттай нэвтэрлээ',
      token,
      user: userWithoutPassword
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Серверийн алдаа' },
      { status: 500 }
    );
  }
}