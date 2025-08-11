import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import Cart from '@/models/cart.model';
import { connectToDB } from '@/lib/mongodb';
import { cookieName } from '@/utils/values';
import { CartItem } from '@/context/cart-context';
import { Types } from 'mongoose';


// Connect to database
await connectToDB();

// ================== TYPES ==================



export interface Variant {
  quantity: number;
  color: string;
}

interface ProductType {
  _id: Types.ObjectId;
  title: string;
  price: number;
  images: string[];
  sku: string[];
}

interface VariantType {
  quantity: number;
  color: string;
}

interface CartItemType {
  product: ProductType;
  variants: VariantType[];
}

interface CartDoc {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  cart: CartItemType[];
}

// ================== API ROUTES ==================
export async function GET(req: NextRequest): Promise<NextResponse> {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: cookieName
  });

  if (!token?.sub) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const existingCart = await Cart.findOne({ userId: token.sub })
      .populate<{ cart: { product: ProductType; variants: VariantType[] }[] }>({
        path: "cart.product",
        select: "_id title price images sku"
      })
      .lean<CartDoc>();

    if (!existingCart) {
      return NextResponse.json(
        { success: true, cart: [] },
        { status: 200 }
      );
    }

    const clientCart = existingCart.cart.map((item) => ({
      product: {
        _id: item.product._id.toString(),
        title: item.product.title,
        price: item.product.price,
        images: item.product.images || [],
        sku: item.product.sku
      },
      variants: item.variants.map((variant) => ({
        quantity: variant.quantity,
        color: variant.color
      }))
    }));

    return NextResponse.json(
      {
        success: true,
        cart: clientCart,
        totalItems: clientCart.reduce(
          (sum, item) =>
            sum +
            item.variants.reduce((vSum, v) => vSum + v.quantity, 0),
          0
        )
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: cookieName
  });

  if (!token?.sub) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { cart }: { cart: CartItem[] } = await req.json();

    if (!Array.isArray(cart)) {
      return NextResponse.json(
        { error: "Cart must be an array" },
        { status: 400 }
      );
    }

    // Merge items with same product._id and combine variants
    const mergedCartMap = new Map<string, CartItem>();

    for (const item of cart) {
      const productId = item.product._id;

      if (!mergedCartMap.has(productId)) {
        // Create new entry if product doesn't exist
        mergedCartMap.set(productId, {
          product: item.product,
          variants: [...item.variants]
        });
      } else {
        // Merge variants if product exists
        const existingItem = mergedCartMap.get(productId)!;

        for (const newVariant of item.variants) {
          const existingVariant = existingItem.variants.find(
            v => v.color === newVariant.color
          );

          if (existingVariant) {
            // Add quantities if variant exists
            existingVariant.quantity += newVariant.quantity;
          } else {
            // Add new variant if color doesn't exist
            existingItem.variants.push(newVariant);
          }
        }
      }
    }

    // Convert to array and transform for database
    const mergedCart = Array.from(mergedCartMap.values());
    const dbCart = mergedCart.map(item => ({
      product: new Types.ObjectId(item.product._id),
      variants: item.variants.map(v => ({
        quantity: v.quantity,
        color: v.color
      }))
    }));

    // Update or create cart
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: token.sub },
      { $set: { cart: dbCart } },
      {
        new: true,
        upsert: true,
        populate: {
          path: 'cart.product',
          select: 'title price images sku'
        }
      }
    );

    // Transform back to client format
    const clientCart = updatedCart.cart.map((item: CartItem) => ({
      product: {
        _id: item.product._id.toString(),
        title: item.product.title,
        price: item.product.price,
        images: item.product.images,
        sku: item.product.sku
      },
      variants: item.variants
    }));

    return NextResponse.json(
      { success: true, cart: clientCart },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to save cart:", error);
    return NextResponse.json(
      { error: "Failed to save cart" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: cookieName
  });

  if (!token?.sub) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    await Cart.findOneAndUpdate(
      { userId: token.sub },
      { $set: { cart: [] } }
    );

    return NextResponse.json(
      { success: true, cart: [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to clear cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}