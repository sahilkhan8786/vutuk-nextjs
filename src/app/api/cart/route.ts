import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import Cart from '@/models/cart.model';
import { connectToDB } from '@/lib/mongodb';
import { cookieName } from '@/utils/values';

export async function GET(req: NextRequest) {
  await connectToDB();

    const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET,
        cookieName:cookieName
    });

  if (!token || !token.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existingCart = await Cart.findOne({ userId: token.sub }).populate('products.productId');

  return NextResponse.json({ success: true, data: existingCart || { products: [] } });
}

export async function POST(req: NextRequest) {
  await connectToDB();

    const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET,
        cookieName: cookieName
    });

  if (!token || !token.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
  }

  // Validate each product item
  for (const item of body) {
    if (
      !item.productId ||
      !item.sku ||
      typeof item.quantity !== 'number' ||
      typeof item.price !== 'number'
    ) {
      return NextResponse.json({ error: 'Invalid product data' }, { status: 400 });
    }
  }

  // Upsert (update if exists, else create)
  const updatedCart = await Cart.findOneAndUpdate(
    { userId: token.sub },
    { $set: { products: body } },
    { new: true, upsert: true }
  );

  return NextResponse.json({ success: true, data: updatedCart });
}
