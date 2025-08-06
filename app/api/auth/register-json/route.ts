import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const schoolName = formData.get("schoolName") as string;
    const schoolEmail = formData.get("schoolEmail") as string;
    const schoolPhone = formData.get("schoolPhone") as string;
    const schoolAddress = formData.get("schoolAddress") as string;
    const schoolType = formData.get("schoolType") as string;
    const schoolOwnership = formData.get("schoolOwnership") as string;

    // Extract files
    const cacFile = formData.get("cac") as File;
    const utilityFile = formData.get("utility") as File;
    const taxIdFile = formData.get("taxId") as File;

    // Validate required fields
    if (
      !schoolName ||
      !schoolEmail ||
      !schoolPhone ||
      !schoolAddress ||
      !schoolType ||
      !schoolOwnership
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All school information fields are required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Validate required files
    if (!cacFile || !utilityFile) {
      return NextResponse.json(
        {
          success: false,
          message: "CAC document and utility bill are required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Convert files to base64
    const cacBase64 = Buffer.from(await cacFile.arrayBuffer()).toString(
      "base64"
    );
    const utilityBase64 = Buffer.from(await utilityFile.arrayBuffer()).toString(
      "base64"
    );
    const taxIdBase64 = taxIdFile
      ? Buffer.from(await taxIdFile.arrayBuffer()).toString("base64")
      : null;

    // Create JSON payload with base64 encoded files
    const jsonPayload = {
      school_name: schoolName,
      school_email: schoolEmail,
      school_phone: schoolPhone,
      school_address: schoolAddress,
      school_type: schoolType,
      school_ownership: schoolOwnership,
      files: {
        cac_or_approval_letter: {
          data: cacBase64,
          name: cacFile.name,
          type: cacFile.type,
          size: cacFile.size,
        },
        utility_bill: {
          data: utilityBase64,
          name: utilityFile.name,
          type: utilityFile.type,
          size: utilityFile.size,
        },
        ...(taxIdBase64 && {
          tax_cert: {
            data: taxIdBase64,
            name: taxIdFile.name,
            type: taxIdFile.type,
            size: taxIdFile.size,
          },
        }),
      },
    };

    // Send to backend API as JSON
    const response = await fetch(
      "https://smart-edu-hub.onrender.com/api/v1/auth/onboard-school",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonPayload),
      }
    );

    const data = await response.json();

    if (response.ok && data.statusCode === 201 && data.success === true) {
      return NextResponse.json(
        {
          success: true,
          message: "School registration successful",
          statusCode: 201,
          data: data.data,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Registration failed",
          statusCode: response.status,
          error: data.error,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
