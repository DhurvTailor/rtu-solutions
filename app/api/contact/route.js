import {
  addContactSubmission,
  getAllContactSubmissions,
} from "../../../services/contactService";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

// Basic validators
const PHONE_REGEX = /^[6-9]\d{9}$/; // Indian 10-digit mobile
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ROLES = ["student", "teacher", "other"];

// GET — admin only: saari submissions dikhao
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getAllContactSubmissions();
    return Response.json(data);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

// POST — public: form submit
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, role, subject, message } = body;

    // Validation
    if (!name || !phone || !email || !role || !message) {
      return Response.json(
        { message: "Name, phone, email, role aur message zaroori hain" },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return Response.json(
        { message: "Naam sahi se likhein" },
        { status: 400 }
      );
    }

    if (!PHONE_REGEX.test(phone.trim())) {
      return Response.json(
        { message: "10 digit ka valid mobile number dein" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return Response.json(
        { message: "Valid email address dein" },
        { status: 400 }
      );
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return Response.json(
        { message: "Role sahi se select karein" },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return Response.json(
        { message: "Message thoda detail me likhein (min 10 characters)" },
        { status: 400 }
      );
    }

    const result = await addContactSubmission({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      role,
      subject: subject ? subject.trim() : null,
      message: message.trim(),
    });

    return Response.json({
      success: true,
      message: "Aapka message safaltapoorvak bhej diya gaya hai",
      id: result.id,
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}