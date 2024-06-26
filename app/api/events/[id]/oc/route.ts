
import { NextResponse } from "next/server";
import User from "../../../../../models/User";
import Event from "../../../../../models/Event";

export async function POST(req, { params }) {
  const { id } = params;
  const { userEmail } = await req.json();

  try {
    const user = await User.findOne({ email: userEmail }).exec();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const event = await Event.findById(id).exec();
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    if (event.status === "Full") {
      return NextResponse.json({ message: "Event is full" }, { status: 400 });
    }

    if (event.oc.some((oc) => oc.id.equals(user._id))) {
      return NextResponse.json(
        { message: "User already applied" },
        { status: 400 }
      );
    }

    event.oc.push({ id: user._id, name: user.name });
    await event.save();

    return NextResponse.json(
      { message: "User added to event OC" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  const { userId } = await req.json();

  try {
    // Find the user by ID
    const user = await User.findById(userId).exec();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Find the event by ID
    const event = await Event.findById(id).exec();
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Check if the user is in the OC array
    const userIndex = event.oc.indexOf(user._id);
    if (userIndex === -1) {
      return NextResponse.json(
        { message: "User not in event OC" },
        { status: 400 }
      );
    }

    // Remove the user from the OC array
    event.oc.splice(userIndex, 1);
    await event.save();

    return NextResponse.json(
      { message: "User removed from event OC" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
