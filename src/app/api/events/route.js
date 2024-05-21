import dbConnect from "../../libs/mongodb"; // Adjust path if necessary
import Event from "./../../(models)/Event";
import { NextResponse } from "next/server";

export async function handler(req) {
  const { method } = req;

  // Ensure database connection
  await dbConnect();

  switch (method) {
    case 'GET':
      return getEvents(req);
    case 'POST':
      return createEvent(req);
    default:
      return NextResponse.json({ message: `Method ${method} Not Allowed` }, { status: 405 });
  }
}

async function getEvents(req) {
  try {
    const events = await Event.find().lean().exec();
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

async function createEvent(req) {
  try {
    const body = await req.json();
    const eventData = body;

    // Confirm data exists
    if (!eventData?.name || !eventData.description || !eventData.date || !eventData.department || !eventData.location) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Check for duplicate events
    const duplicate = await Event.findOne({ name: eventData.name }).lean().exec();

    if (duplicate) {
      return NextResponse.json({ message: "Duplicate Event" }, { status: 409 });
    }

    await Event.create(eventData);
    return NextResponse.json({ message: "Event Created." }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export { handler as GET, handler as POST };
