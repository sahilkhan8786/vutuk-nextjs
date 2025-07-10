import { connectToDB } from "@/lib/mongodb"
import FavouriteProducts from "@/models/favourites-products.model";
import { cookieName } from "@/utils/values";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    try {
        const token = await getToken({
            req,
            secret: process.env.AUTH_SECRET,
            cookieName: cookieName
        });


        const isAdmin = token?.role === 'admin';
        await connectToDB();
        let favourites;
        if (isAdmin) {
             favourites = await FavouriteProducts.find({}).populate('products');
        } else {
            favourites = await FavouriteProducts.find({userId:token?.sub}).populate('products')
}

        return NextResponse.json({
            status: 'success',
            data: {
                favourites
            }
        })
        
    } catch (error) {
        console.log(error)
        throw error
    }
}


export async function POST(req: Request) {
  try {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      cookieName,
    });

    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDB();
    const body = await req.json(); // expected to be array of productId strings

    // Convert product ID strings to ObjectId
    const productObjectIds = body.map((id: string) => new mongoose.Types.ObjectId(id));

    const haveFavouritesAlready = await FavouriteProducts.findOne({ userId: token.sub });

    if (haveFavouritesAlready) {
      await FavouriteProducts.findByIdAndUpdate(haveFavouritesAlready._id, {
        products: productObjectIds,
        userId: token.sub,
      });
    } else {
      await FavouriteProducts.create({
        products: productObjectIds,
        userId: token.sub,
      });
    }

    return NextResponse.json({
      status: 'success',
      data: productObjectIds,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

  