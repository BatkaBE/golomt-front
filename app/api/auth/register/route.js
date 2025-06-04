import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Жишээ database (бодитоор MongoDB эсвэл бусад DB ашиглана)
let users = [];

export async function POST(request) {
  try {
    const { username, password, email, name, phone } = await request.json();

    // Validation
    if (!username || !password || !email || !name || !phone) {
      return NextResponse.json(
        { error: 'Бүх талбарыг бөглөнө үү' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = users.find(user => 
      user.email === email || user.phone === phone
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'Хэрэглэгч аль хэдийн бүртгэлтэй байна' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      name,
      phone,
      password: hashedPassword,
      createdAt: new Date(),
      accounts: [] // Always include accounts property
    };

    users.push(newUser);

    // Return success (exclude password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      message: 'Амжилттай бүртгэгдлээ',
      user: userWithoutPassword
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Серверийн алдаа' },
      { status: 500 }
    );
  }
}