import Event from "@/app/(models)/Event";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id).lean().exec();
    if (!deletedEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const event = await Event.findById(id).populate('oc').lean().exec();
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, body, { new: true }).lean().exec();
    if (!updatedEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
