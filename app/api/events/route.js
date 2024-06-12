import { getEvents } from "@/components/lib";

const events = getEvents().map(({ name, id }) => ({
    name: name,
    link: `/event/${id}`,
}));

export async function GET(req) {
    return Response.json(events);
}
