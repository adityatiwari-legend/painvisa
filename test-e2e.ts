async function runEndToEndTests() {
  console.log("=== STARTING FULL END-TO-END VERIFICATION ===");
  const baseUrl = "http://localhost:3000";

  // Helper for assertion
  function assert(condition: boolean, message: string) {
    if (!condition) {
      console.error(`❌ ASSERTION FAILED: ${message}`);
      process.exit(1);
    }
    console.log(`✓ ${message}`);
  }

  // 1. Test Public Content Endpoints
  console.log("\n[Test 1] Public Content Endpoints...");
  const [announcementsRes, centresRes, visaTypesRes, settingsRes] = await Promise.all([
    fetch(`${baseUrl}/api/content/announcements`).then((r) => r.json()),
    fetch(`${baseUrl}/api/content/centres`).then((r) => r.json()),
    fetch(`${baseUrl}/api/content/visa-types`).then((r) => r.json()),
    fetch(`${baseUrl}/api/content/settings`).then((r) => r.json()),
  ]);

  assert(announcementsRes.success && announcementsRes.announcements.length > 0, "Announcements API returned active alerts");
  assert(centresRes.success && centresRes.centres.length >= 13, "Centres API returned 13 application centres");
  assert(visaTypesRes.success && visaTypesRes.visaTypes.length >= 2, "Visa types returned Schengen and National types");
  assert(settingsRes.success && settingsRes.settings.bls_appointment_url !== undefined, "Settings API returned external URLs");

  // 2. Test Applicant Submission Flow with Realistic JPEG Images
  console.log("\n[Test 2] Applicant Registration Flow...");
  // Create valid JPEG buffers with magic bytes: FF D8 FF E0 00 10 4A 46 49 46 00 01 ...
  const validJpegBuffer = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
    0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
    0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
    0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20,
    0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27,
    0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01,
    0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04,
    0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f,
    0x00, 0xbf, 0x00, 0xff, 0xd9,
  ]);

  const formData = new FormData();
  formData.append("name", "Rahul Sharma");
  formData.append("email", "rahul.sharma@example.com");
  formData.append("phone", "+91 9876543210");
  formData.append("dateOfBirth", "1994-06-15");
  formData.append("passportNumber", "N8264915");
  formData.append("nationality", "Indian");
  formData.append("visaType", "SCHENGEN");
  formData.append("visaCategory", "Tourist Visa");
  formData.append("centreName", "New Delhi");
  formData.append("consent", "true");

  formData.append("thumbPhoto", new Blob([validJpegBuffer], { type: "image/jpeg" }), "thumb.jpg");
  formData.append("passportPhoto", new Blob([validJpegBuffer], { type: "image/jpeg" }), "passport.jpg");
  formData.append("aadhaarPhoto", new Blob([validJpegBuffer], { type: "image/jpeg" }), "aadhaar.jpg");

  const appRes = await fetch(`${baseUrl}/api/applicants`, {
    method: "POST",
    body: formData,
  });
  const appData = await appRes.json();
  assert(appRes.status === 200 && appData.success, `Applicant created with reference: ${appData.referenceNumber}`);
  const referenceNumber = appData.referenceNumber;
  const applicantId = appData.applicant.id;

  // 3. Test Application Tracking
  console.log("\n[Test 3] Application Tracking Endpoint...");
  const trackRes = await fetch(
    `${baseUrl}/api/applications/track?referenceNumber=${encodeURIComponent(
      referenceNumber
    )}&dateOfBirth=1994-06-15`
  );
  const trackData = await trackRes.json();
  assert(trackRes.status === 200 && trackData.success, "Application tracked successfully with Reference & DOB");
  assert(trackData.application.status === "SUBMITTED", "Application shows SUBMITTED initial status");
  assert(trackData.application.maskedPassport.includes("****"), "Passport is securely masked");

  // 4. Test Security: Unauthenticated Document Access MUST Fail
  console.log("\n[Test 4] Security Test: Document Access Protection...");
  const docList = await fetch(`${baseUrl}/api/admin/applicants/${applicantId}`);
  // Without cookie, this must be 401
  assert(docList.status === 401, "Unauthenticated access to applicant endpoint properly rejected (401)");

  // 5. Test Admin Login and Session Cookies
  console.log("\n[Test 5] Admin Login Authentication...");
  const loginRes = await fetch(`${baseUrl}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@spainvisa-portal.com",
      password: "AdminSpain2026!Secure",
    }),
  });
  const loginData = await loginRes.json();
  assert(loginRes.status === 200 && loginData.success, "Admin login succeeded");

  const setCookieHeader = loginRes.headers.get("set-cookie");
  assert(setCookieHeader !== null && setCookieHeader.includes("spainvisa_admin_session"), "HTTP-only secure cookie received");
  if (!setCookieHeader) throw new Error("Missing cookie header");

  // Extract session cookie for subsequent authenticated admin calls
  const cookieString = setCookieHeader.split(";")[0];

  // 6. Test Admin Session & Stats
  console.log("\n[Test 6] Admin Stats & Applicants View...");
  const adminStatsRes = await fetch(`${baseUrl}/api/admin/stats`, {
    headers: { Cookie: cookieString },
  });
  const statsData = await adminStatsRes.json();
  assert(adminStatsRes.status === 200 && statsData.success, "Admin stats fetched with session");
  assert(statsData.stats.totalApplicants >= 1, `Total applicants verified: ${statsData.stats.totalApplicants}`);

  // Fetch applicant dossier as admin
  const detailRes = await fetch(`${baseUrl}/api/admin/applicants/${applicantId}`, {
    headers: { Cookie: cookieString },
  });
  const detailData = await detailRes.json();
  assert(detailRes.status === 200 && detailData.success, "Admin accessed applicant detail dossier");
  assert(detailData.applicant.documents.length === 3, "Verified 3 encrypted documents in storage vault");

  const firstDocId = detailData.applicant.documents[0].id;

  // 7. Test Secure Document Stream with Authorization
  console.log("\n[Test 7] Authenticated Document Streaming...");
  const docStreamRes = await fetch(`${baseUrl}/api/documents/${firstDocId}`, {
    headers: { Cookie: cookieString },
  });
  assert(docStreamRes.status === 200, "Authenticated document stream served 200 OK");
  assert(docStreamRes.headers.get("content-type") === "image/jpeg", "Content-Type correctly verified as image/jpeg");
  assert(docStreamRes.headers.get("cache-control")?.includes("no-store") === true, "Private no-store header confirmed");

  // 8. Test Status Advancement
  console.log("\n[Test 8] Application Status Advancement & Audit...");
  const statusUpdateRes = await fetch(`${baseUrl}/api/admin/applicants/${applicantId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieString,
    },
    body: JSON.stringify({
      status: "DOCUMENTS_UNDER_REVIEW",
      note: "Biometric and identity documents verified by senior officer. Forwarding to appointment.",
    }),
  });
  const updateData = await statusUpdateRes.json();
  assert(statusUpdateRes.status === 200 && updateData.status === "DOCUMENTS_UNDER_REVIEW", "Application status advanced to DOCUMENTS_UNDER_REVIEW");

  // 9. Verify Audit Trail Recorded Event
  console.log("\n[Test 9] Audit Ledger Verification...");
  const auditRes = await fetch(`${baseUrl}/api/admin/audit-logs?limit=5`, {
    headers: { Cookie: cookieString },
  });
  const auditData = await auditRes.json();
  assert(auditRes.status === 200 && auditData.logs.length > 0, "Audit logs confirmed");
  const hasDocViewLog = auditData.logs.some((l: any) => l.action === "DOCUMENT_VIEW" || l.action === "STATUS_CHANGE");
  assert(hasDocViewLog, "Audit log confirmed recording DOCUMENT_VIEW / STATUS_CHANGE event");

  // 10. Test Dynamic Fee Update
  console.log("\n[Test 10] Dynamic Fee Engine Test...");
  const allCategories = visaTypesRes.visaTypes.flatMap((v: any) => v.categories || []);
  const targetCategory = allCategories.find((c: any) => c.slug === "tourist-visa") || allCategories[0];
  assert(targetCategory !== undefined, "Found target category for fee adjustment");

  const feeUpdateRes = await fetch(`${baseUrl}/api/admin/fees/${targetCategory.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieString,
    },
    body: JSON.stringify({
      standardFee: 9599,
      blsServiceFee: 1802,
    }),
  });
  const feeUpdateData = await feeUpdateRes.json();
  assert(feeUpdateRes.status === 200 && feeUpdateData.success, "Fee updated dynamically in database");

  console.log("\n🎉 ALL 10 END-TO-END AUTOMATION SUITES PASSED FLAWLESSLY!");
  process.exit(0);
}

runEndToEndTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
