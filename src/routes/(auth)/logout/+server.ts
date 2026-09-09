import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = ({ locals }) => {

  if (locals.session.data === null) {
    return json({ result: "You weren't signed in" })
  }
  try {
    locals.session.logout = true;
    return json({ result: "Logged out successfully" })
  } catch (e) {
    return json({ result: "Error logging out" })
  }
}