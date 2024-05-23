import { NextResponse } from "next/server";
import User from "../../../../models/User";


export async function GET(req) {
    try {
        const users = await User.find().lean().exec();
        return NextResponse.json(users);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const { name, email } = await req.json();
        const user = await User.findByIdAndUpdate(id, { name, email }, { new: true }).lean().exec();
        return NextResponse.json(user);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        const user = await User.findByIdAndDelete(id).lean().exec();
        return NextResponse.json(user);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
}