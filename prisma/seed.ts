import { PrismaClient, Role, AnnouncementSeverity } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Spain Visa Portal database...");

  // 1. Initial Admin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@spainvisa-portal.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminSpain2026!Secure";
  const adminName = process.env.ADMIN_NAME || "Super Administrator";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: adminName,
      role: Role.SUPER_ADMIN,
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: Role.SUPER_ADMIN,
      mustChangePassword: false,
    },
  });
  console.log(`✓ Admin user created/updated: ${admin.email}`);

  // 2. Visa Types & Categories
  const schengenVisa = await prisma.visaType.upsert({
    where: { code: "SCHENGEN" },
    update: {},
    create: {
      code: "SCHENGEN",
      name: "Schengen Visa",
      tagline: "Short Stay Visa (Maximum 90 days within any 180-day period)",
      maxStay: "90 days within 180-day period",
      overview:
        "Schengen visas allow travelers to enter Spain and all other 28 Schengen member countries for short visits, tourism, business, transit, or visiting family. Stays cannot exceed 90 days in any 180-day rolling period. If Spain is your primary destination or port of longest stay, you must submit your application to the Embassy or Consulate General of Spain through authorized BLS Application Centres.",
      photoSpecifications:
        "Photographs must be in color, 35mm x 45mm, taken within the last 6 months against a plain light/white/off-white background. The face must be in clear focus, full frontal view, neutral non-smiling expression with mouth closed, eyes open and clearly visible. Sunglasses, colored contact lenses, or hats/head coverings are prohibited except for verified religious purposes with facial features fully exposed.",
      processingTime:
        "Standard processing time is a minimum of 15 calendar days from the date the application is received at the Embassy or Consulate General of Spain. During peak travel seasons (April-July), processing may extend up to 45 calendar days. Early submission is highly recommended.",
      jurisdictionInfo:
        "Jurisdiction is determined by your continuous lawful residence in India during the last 6 months. Northern, Eastern, and Southern states belong to New Delhi Jurisdiction. Western & Central states belong to Mumbai Jurisdiction.",
      formDownloadUrl: "https://www.exteriores.gob.es/Documents/DocumentosPosteriores/Formulario_Schengen_EN.pdf",
    },
  });

  const nationalVisa = await prisma.visaType.upsert({
    where: { code: "NATIONAL" },
    update: {},
    create: {
      code: "NATIONAL",
      name: "National Visa",
      tagline: "Long Stay Visa (Stays exceeding 90 days)",
      maxStay: "Over 90 days / Residence / Study / Work",
      overview:
        "National (Type D) visas authorize foreign nationals to reside, study, conduct research, or work in Spain for periods exceeding 90 days. All national visas are subject to initial authorization and approval by the Spanish Ministry of Foreign Affairs, European Union and Cooperation, as well as competent Spanish immigration bodies.",
      photoSpecifications:
        "Identical to Schengen photo requirements: recent passport-sized color photograph (35x45 mm), white background, neutral facial expression, clear focus without glare or spectacles reflection.",
      processingTime:
        "Processing time for National Visas varies by visa category, generally ranging from 1 month to 3 months depending on authorization from Spanish administrative authorities.",
      jurisdictionInfo:
        "Applicants must submit their National Visa applications to the corresponding Consulate General or Embassy according to their permanent official residence in India, Nepal, or Sri Lanka.",
      formDownloadUrl: "https://www.exteriores.gob.es/Documents/DocumentosPosteriores/Formulario_Nacional_EN.pdf",
    },
  });

  // Schengen categories
  const schengenCategories = [
    {
      name: "Tourist Visa",
      slug: "tourist-visa",
      description: "For individuals travelling to Spain for tourism, leisure, sightseeing, or holiday visits.",
      documentsRequired:
        "Original passport (valid at least 3 months beyond intended departure, 2 blank pages), completed signed Schengen application form, 2 recent photographs, roundtrip flight reservation, proof of accommodation/hotel booking, travel medical insurance (€30,000 minimum coverage), personal bank statements (last 6 months, bank seal & sign), ITR acknowledgement (last 3 years), employment letter / leave approval or business registration.",
      standardFee: 9599,
      childFee: 4799,
      blsServiceFee: 1802,
    },
    {
      name: "Business Visa",
      slug: "business-visa",
      description: "For commercial meetings, trade conferences, corporate events, or business negotiations in Spain.",
      documentsRequired:
        "Original passport, completed application form, official invitation letter from the Spanish host company (in Spanish, signed, mentioning purpose and duration), covering letter from Indian employer, company registration documents, recent 6 months company and personal bank statements, roundtrip itinerary, confirmed hotel booking, and €30,000 travel health insurance.",
      standardFee: 9599,
      childFee: 4799,
      blsServiceFee: 1802,
    },
    {
      name: "Airport Transit Visa",
      slug: "airport-transit-visa",
      description: "For transiting through the international transit area of Spanish airports en route to a non-Schengen destination.",
      documentsRequired:
        "Original passport, visa or entry permit for the destination country, onward confirmed air tickets, valid travel medical insurance, proof of financial solvency.",
      standardFee: 9599,
      childFee: 4799,
      blsServiceFee: 1802,
    },
    {
      name: "Transit Visa for Seamen",
      slug: "transit-visa-seamen",
      description: "For mariners and seafarers boarding or disembarking a vessel docked in a Spanish port.",
      documentsRequired:
        "Seaman's discharge book / CDC, continuous discharge certificate, letter from Spanish shipping agent detailing vessel name, IMO number, port and boarding dates, letter from Indian crewing agency, travel insurance.",
      standardFee: 9599,
      childFee: 4799,
      blsServiceFee: 1802,
    },
    {
      name: "Relative of EEA/EU Citizens",
      slug: "relative-eea-eu",
      description: "For spouse, registered partner, or dependent direct descendants/ascendants of an EU/EEA or Swiss citizen.",
      documentsRequired:
        "Proof of EU/EEA citizenship of family member (copy of passport/DNI), authenticated proof of family relationship (Marriage certificate / Birth certificate officially apostilled and translated into Spanish), proof of accompanying or joining the EU national in Spain.",
      standardFee: 0,
      childFee: 0,
      blsServiceFee: 1802,
    },
  ];

  for (const cat of schengenCategories) {
    await prisma.visaCategory.upsert({
      where: { id: `cat-${cat.slug}` },
      update: {
        standardFee: cat.standardFee,
        childFee: cat.childFee,
        blsServiceFee: cat.blsServiceFee,
        description: cat.description,
        documentsRequired: cat.documentsRequired,
      },
      create: {
        id: `cat-${cat.slug}`,
        visaTypeId: schengenVisa.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        documentsRequired: cat.documentsRequired,
        standardFee: cat.standardFee,
        childFee: cat.childFee,
        blsServiceFee: cat.blsServiceFee,
      },
    });
  }

  // National categories
  const nationalCategories = [
    { name: "Adoption Visa", slug: "adoption-visa", desc: "For minors legally adopted by Spanish citizens or legal residents." },
    { name: "Digital Nomad Visa", slug: "digital-nomad-visa", desc: "For remote workers and international teleworkers residing in Spain under Law 28/2022." },
    { name: "Employee Visa", slug: "employee-visa", desc: "For individuals holding initial work authorization granted by Spanish labor authorities." },
    { name: "Entrepreneur Visa", slug: "entrepreneur-visa", desc: "For innovative startup founders endorsed by ENISA and Spanish commercial offices." },
    { name: "Internship Visa", slug: "internship-visa", desc: "For students or graduates undertaking professional internships with Spanish entities." },
    { name: "Residence Visa – Family of Spanish Citizens", slug: "residence-family-spanish", desc: "For family members of Spanish citizens applying for initial residency." },
    { name: "Highly Qualified Professionals / Intra-Company Transfers", slug: "highly-qualified-ict", desc: "For executives, specialists, and researchers under UGE authorization." },
    { name: "Family Regrouping with EU National", slug: "family-regrouping-eu", desc: "For family members joining EU/EEA citizens for long-term residency." },
    { name: "Family Regrouping – General", slug: "family-regrouping-general", desc: "For relatives of non-EU foreign residents who have obtained residence renewal." },
    { name: "Student Visa >90 days", slug: "student-visa-long", desc: "For full-time university studies, exchange programs, or long-term academic research." },
    { name: "Entrepreneurial Support Act Visas", slug: "entrepreneurial-support-act", desc: "Visas granted under Law 14/2013 for investors, entrepreneurs, and researchers." },
    { name: "Work & Residence Permit Visa", slug: "work-residence-permit", desc: "Standard employment contract visa with approved labor authorization." },
    { name: "Work & Residence Permit Visa – Fixed Period", slug: "work-residence-fixed", desc: "Seasonal or temporary employment visas for specified contract durations." },
    { name: "Work & Residence Permit – Self-employed", slug: "work-self-employed", desc: "For autonomous commercial or professional business operators in Spain." },
    { name: "Work & Residence Permit – Transnational Services", slug: "work-transnational", desc: "For service providers temporarily assigned to Spain from foreign corporations." },
    { name: "Residence Visa with Work Permit Exemption", slug: "residence-work-exempt", desc: "For clergy, media correspondents, artists, or university professors." },
    { name: "Work and Temporary Residence Visa for Research", slug: "residence-research", desc: "For accredited scientists and researchers under hosting agreements." },
    { name: "Non-Lucrative Residence Visa", slug: "non-lucrative-visa", desc: "For individuals with independent passive income or retirement funds seeking residence without work." },
    { name: "Recovery of Long-Term Residence", slug: "recovery-long-term", desc: "For previous long-term Spanish residency card holders seeking re-authorization." },
    { name: "Loss/Theft of Residence Permit Card", slug: "loss-theft-permit-card", desc: "Expedited return visa for residents who lost their TIE card outside Spain." },
  ];

  for (const nCat of nationalCategories) {
    await prisma.visaCategory.upsert({
      where: { id: `cat-${nCat.slug}` },
      update: {
        name: nCat.name,
        description: nCat.desc,
      },
      create: {
        id: `cat-${nCat.slug}`,
        visaTypeId: nationalVisa.id,
        name: nCat.name,
        slug: nCat.slug,
        description: nCat.desc,
        documentsRequired:
          "Completed National Visa application form, original passport valid for at least 1 year, medical certificate confirming applicant is free from quarantine diseases, police clearance certificate (PCC) with apostille and sworn Spanish translation, proof of financial means, health insurance from an authorized Spanish provider, official authorization approval from competent Spanish authority.",
        standardFee: 9599,
        childFee: 4799,
        blsServiceFee: 1802,
      },
    });
  }

  // 3. Centres (13 centres)
  const centres = [
    {
      code: "DEL",
      name: "New Delhi",
      country: "India",
      address: "1st Floor, Shivaji Stadium Metro Station, Concourse Level, Baba Kharak Singh Marg, Connaught Place, New Delhi - 110001",
      submissionHours: "09:00 - 15:30 (Monday - Friday)",
      passportCollectionHours: "15:00 - 17:00 (Monday - Friday)",
      phone: "+91 120 6641000",
      email: "feedback.del@blsspainvisa.com",
      mapUrl: "https://maps.google.com/?q=Shivaji+Stadium+Metro+Station+New+Delhi",
    },
    {
      code: "BOM",
      name: "Mumbai",
      country: "India",
      address: "Ground Floor, Earnest House, NCPA Marg, Nariman Point, Mumbai, Maharashtra 400021",
      submissionHours: "08:30 - 15:00 (Monday - Friday)",
      passportCollectionHours: "14:30 - 16:30 (Monday - Friday)",
      phone: "+91 22 67003888",
      email: "feedback.bom@blsspainvisa.com",
      mapUrl: "https://maps.google.com/?q=Earnest+House+Nariman+Point+Mumbai",
    },
    {
      code: "BLR",
      name: "Bengaluru",
      country: "India",
      address: "Unit No. 302 & 303, 3rd Floor, Prestige Atrium, Central Street, Shivaji Nagar, Bengaluru, Karnataka 560001",
      submissionHours: "09:00 - 15:00 (Monday - Friday)",
      passportCollectionHours: "15:00 - 17:00 (Monday - Friday)",
      phone: "+91 120 6641000",
      email: "feedback.blr@blsspainvisa.com",
      mapUrl: "https://maps.google.com/?q=Prestige+Atrium+Bengaluru",
    },
    {
      code: "MAA",
      name: "Chennai",
      country: "India",
      address: "Fagun Mansions, 3rd Floor, No. 74, Ethiraj Salai, Egmore, Chennai, Tamil Nadu 600008",
      submissionHours: "09:00 - 15:00 (Monday - Friday)",
      passportCollectionHours: "15:00 - 17:00 (Monday - Friday)",
      phone: "+91 120 6641000",
      email: "feedback.maa@blsspainvisa.com",
      mapUrl: "https://maps.google.com/?q=Fagun+Mansions+Egmore+Chennai",
    },
    {
      code: "CCU",
      name: "Kolkata",
      country: "India",
      address: "Rene Tower, 4th Floor, Building No. 1842, Rajdanga Main Road, Kasba, Kolkata, West Bengal 700107",
      submissionHours: "09:00 - 14:30 (Monday - Friday)",
      passportCollectionHours: "14:30 - 16:30 (Monday - Friday)",
      phone: "+91 120 6641000",
      email: "feedback.ccu@blsspainvisa.com",
      mapUrl: "https://maps.google.com/?q=Rene+Tower+Kasba+Kolkata",
    },
    {
      code: "HYD",
      name: "Hyderabad",
      country: "India",
      address: "8-2-684/3/25&26, Ground Floor, Krishe Sapphire, Madhapur, Hitech City, Hyderabad, Telangana 500081",
      submissionHours: "09:00 - 15:00 (Monday - Friday)",
      passportCollectionHours: "15:00 - 16:30 (Monday - Friday)",
      phone: "+91 120 6641000",
      email: "feedback.hyd@blsspainvisa.com",
      mapUrl: "https://maps.google.com/?q=Krishe+Sapphire+Madhapur+Hyderabad",
    },
    {
      code: "AMD",
      name: "Ahmedabad",
      country: "India",
      address: "Unit No. 101, 1st Floor, Addor Aspire, Near University Ground, Panjrapole, Ahmedabad, Gujarat 380015",
      submissionHours: "09:00 - 15:00 (Monday - Friday)",
      passportCollectionHours: "15:00 - 16:30 (Monday - Friday)",
      phone: "+91 120 6641000",
      email: "feedback.amd@blsspainvisa.com",
      mapUrl: "https://maps.google.com/?q=Addor+Aspire+Panjrapole+Ahmedabad",
    },
    {
      code: "KTM",
      name: "Kathmandu",
      country: "Nepal",
      address: "3rd Floor, Shreenath Complex, Durbar Marg, Kathmandu, Nepal",
      submissionHours: "09:30 - 14:30 (Sunday - Thursday)",
      passportCollectionHours: "15:00 - 16:30 (Sunday - Thursday)",
      phone: "+977 1 4220088",
      email: "feedback.ktm@blsspainvisa.com",
      mapUrl: "https://maps.google.com/?q=Durbar+Marg+Kathmandu+Nepal",
    },
    {
      code: "COK",
      name: "Kochi",
      country: "India",
      address: "1st Floor, Coastal Chambers, Panampilly Nagar, Kochi, Kerala 682036",
      submissionHours: "09:00 - 14:30 (Monday - Friday)",
      passportCollectionHours: "14:30 - 16:30 (Monday - Friday)",
      phone: "+91 120 6641000",
      email: "feedback.cok@blsspainvisa.com",
      mapUrl: "https://maps.google.com/?q=Panampilly+Nagar+Kochi",
    },
    {
      code: "PNY",
      name: "Puducherry",
      country: "India",
      address: "No. 42, Romain Rolland Street, White Town, Puducherry 605001",
      submissionHours: "09:00 - 14:00 (Monday - Friday)",
      passportCollectionHours: "14:00 - 16:00 (Monday - Friday)",
      phone: "+91 120 6641000",
      email: "feedback.pny@blsspainvisa.com",
      mapUrl: "https://maps.google.com/?q=Romain+Rolland+Street+Puducherry",
    },
    {
      code: "IXC",
      name: "Chandigarh",
      country: "India",
      address: "Elante Offices, Unit No. 210, 2nd Floor, Industrial Area Phase 1, Chandigarh 160002",
      submissionHours: "09:00 - 15:00 (Monday - Friday)",
      passportCollectionHours: "15:00 - 16:30 (Monday - Friday)",
      phone: "+91 120 6641000",
      email: "feedback.ixc@blsspainvisa.com",
      mapUrl: "https://maps.google.com/?q=Elante+Offices+Chandigarh",
    },
    {
      code: "JUC",
      name: "Jalandhar",
      country: "India",
      address: "Lower Ground Floor, Midland Financial Centre, GT Road, Jalandhar, Punjab 144001",
      submissionHours: "09:00 - 15:00 (Monday - Friday)",
      passportCollectionHours: "15:00 - 16:30 (Monday - Friday)",
      phone: "+91 120 6641000",
      email: "feedback.juc@blsspainvisa.com",
      mapUrl: "https://maps.google.com/?q=Midland+Financial+Centre+Jalandhar",
    },
    {
      code: "CMB",
      name: "Colombo",
      country: "Sri Lanka",
      address: "Level 4, Access Towers, No. 278, Union Place, Colombo 02, Sri Lanka",
      submissionHours: "09:00 - 14:30 (Monday - Friday)",
      passportCollectionHours: "15:00 - 16:30 (Monday - Friday)",
      phone: "+94 11 2300400",
      email: "feedback.cmb@blsspainvisa.com",
      mapUrl: "https://maps.google.com/?q=Access+Towers+Union+Place+Colombo",
    },
  ];

  for (const c of centres) {
    await prisma.centre.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }

  // 4. Additional Services
  const services = [
    { title: "Courier Delivery", description: "Secure courier dispatch of passport directly to your designated home or office address.", price: 650 },
    { title: "B&W Photocopy", description: "Per-page high quality monochrome photocopying service available at the centre.", price: 10 },
    { title: "SMS Status Alerts", description: "Real-time automated SMS updates dispatched across every critical stage of processing.", price: 150 },
    { title: "Call Back Service", description: "Dedicated customer service representative call back within 2 business hours for queries.", price: 200 },
    { title: "Premium Lounge Service", description: "Priority submission, personal officer assistance, refreshments, and private lounge comfort.", price: 3200 },
    { title: "Document Printing", description: "Direct printing from email or storage drive for missing supporting documentation.", price: 25 },
    { title: "Form Filling Assistance", description: "Professional assistance by our staff in completing your official visa application form.", price: 1000 },
    { title: "Flexi Passport Collection", description: "Collect your processed passport outside standard collection windows at your convenience.", price: 500 },
    { title: "Doorstep Visa Service", description: "Complete application submission and document collection conducted at your residence or corporate premises.", price: 5500 },
    { title: "Prime Time Appointment", description: "Schedule your application submission during early morning or evening outside standard hours.", price: 3000 },
    { title: "Photo Booth Service", description: "ICAO compliant Schengen specification biometric passport photographs taken on site.", price: 350 },
    { title: "Courier Assurance", description: "Extended protection coverage for transit of valuable original passports and documents.", price: 400 },
    { title: "Doctor on Call Assistance", description: "Telephonic medical consultation support for Schengen mandatory health travel requirements.", price: 1500 },
    { title: "BLS Mandatory Service Charge", description: "Standard official logistics and administrative handling charge per applicant.", price: 1802 },
  ];

  for (const s of services) {
    const existing = await prisma.additionalService.findFirst({ where: { title: s.title } });
    if (!existing) {
      await prisma.additionalService.create({
        data: s,
      });
    }
  }

  // 5. FAQs
  const faqs = [
    {
      category: "General",
      question: "What is a Visa?",
      answer: "A visa is an official document or endorsement placed in a passport issued by an authorized government diplomatic mission (Embassy or Consulate), granting authorization to enter, stay, or leave the territory of that sovereign state under specified terms and time limits.",
      sortOrder: 1,
    },
    {
      category: "General",
      question: "What is a Schengen Visa?",
      answer: "A Schengen visa is a short-stay authorization permitting travel throughout the 29 European countries comprising the Schengen Area. It allows a maximum stay of 90 days within any rolling 180-day period for purposes such as tourism, business, visiting friends/family, or cultural exchange.",
      sortOrder: 2,
    },
    {
      category: "General",
      question: "What is a National Visa?",
      answer: "A National (Type D) visa is a long-term authorization issued for stays exceeding 90 days in Spain. It is required for purposes including full-time academic studies, salaried employment, self-employment, non-lucrative residency, research, and family reunification.",
      sortOrder: 3,
    },
    {
      category: "General",
      question: "Can I apply for Spain if travelling to Rome and Paris as well?",
      answer: "Under Schengen regulations, you must apply at the Embassy/Consulate of the country that constitutes your main destination in terms of length or purpose of stay. If you plan to spend the highest number of days in Spain, you must apply through Spain. If durations are exactly equal across member states, you must apply at the first country of entry.",
      sortOrder: 4,
    },
    {
      category: "General",
      question: "Does BLS prepare or decide applications?",
      answer: "No. BLS International is purely an outsourced administrative and logistics service provider authorized to collect documents and biometric data. BLS personnel play zero role in assessing, approving, or rejecting visa applications. The assessment and final decision rest exclusively with the Embassy or Consulate General of Spain.",
      sortOrder: 5,
    },
    {
      category: "Application",
      question: "How early can I apply for my Schengen Visa?",
      answer: "You can submit your application up to 6 months prior to your intended date of travel (up to 9 months for seafarers), but no later than 15 calendar days before departure.",
      sortOrder: 6,
    },
    {
      category: "Application",
      question: "What is the standard processing time?",
      answer: "Normal processing time is at least 15 calendar days from receipt at the diplomatic mission. In individual cases requiring secondary verification, this period may be extended up to 45 calendar days.",
      sortOrder: 7,
    },
    {
      category: "Documents & Fees",
      question: "What are the accepted modes of fee payment?",
      answer: "Visa fees and BLS service charges may be paid at the application centre via debit card, credit card, UPI / QR code payment, or demand draft drawn in favor of BLS International Services Ltd. Cash transactions may be subject to centre limitations.",
      sortOrder: 8,
    },
    {
      category: "Tracking & Delivery",
      question: "How can I track the status of my visa application?",
      answer: "You can track your application online using your unique Application Reference Number (provided on your receipt) and Date of Birth on our Track Application page or through official BLS tracking channels.",
      sortOrder: 9,
    },
  ];

  for (const f of faqs) {
    const existing = await prisma.fAQ.findFirst({ where: { question: f.question } });
    if (!existing) {
      await prisma.fAQ.create({ data: f });
    }
  }

  // 6. Public Holidays
  const holidays = [
    { country: "India", year: 2026, date: new Date("2026-01-26"), name: "Republic Day", description: "Indian National Holiday" },
    { country: "India", year: 2026, date: new Date("2026-03-04"), name: "Holi", description: "Festival of Colors" },
    { country: "India", year: 2026, date: new Date("2026-04-03"), name: "Good Friday", description: "Christian Holy Day" },
    { country: "India", year: 2026, date: new Date("2026-05-01"), name: "Labour Day", description: "International Workers' Day" },
    { country: "India", year: 2026, date: new Date("2026-08-15"), name: "Independence Day", description: "Indian Independence Day" },
    { country: "India", year: 2026, date: new Date("2026-10-02"), name: "Mahatma Gandhi Jayanti", description: "National Holiday" },
    { country: "India", year: 2026, date: new Date("2026-10-12"), name: "Fiesta Nacional de España", description: "Spain National Day" },
    { country: "India", year: 2026, date: new Date("2026-11-08"), name: "Diwali (Deepavali)", description: "Festival of Lights" },
    { country: "India", year: 2026, date: new Date("2026-12-06"), name: "Spanish Constitution Day", description: "Día de la Constitución" },
    { country: "India", year: 2026, date: new Date("2026-12-25"), name: "Christmas Day", description: "Navidad" },

    { country: "Nepal", year: 2026, date: new Date("2026-01-11"), name: "Prithvi Jayanti", description: "National Unity Day" },
    { country: "Nepal", year: 2026, date: new Date("2026-01-30"), name: "Martyrs Day", description: "Shahid Diwas" },
    { country: "Nepal", year: 2026, date: new Date("2026-03-04"), name: "Holi Purnima", description: "Spring Festival" },
    { country: "Nepal", year: 2026, date: new Date("2026-04-14"), name: "Nepali New Year", description: "Bikram Sambat" },
    { country: "Nepal", year: 2026, date: new Date("2026-10-12"), name: "Spain National Day", description: "Fiesta Nacional" },

    { country: "Sri Lanka", year: 2026, date: new Date("2026-01-15"), name: "Tamil Thai Pongal", description: "Harvest Festival" },
    { country: "Sri Lanka", year: 2026, date: new Date("2026-02-04"), name: "National Day", description: "Independence Day Sri Lanka" },
    { country: "Sri Lanka", year: 2026, date: new Date("2026-04-13"), name: "Sinhala & Tamil New Year", description: "Aluth Avurudda" },
    { country: "Sri Lanka", year: 2026, date: new Date("2026-05-01"), name: "Vesak Full Moon Poya", description: "Buddhist Holy Day" },
    { country: "Sri Lanka", year: 2026, date: new Date("2026-10-12"), name: "Spain National Day", description: "Fiesta Nacional" },
  ];

  for (const h of holidays) {
    const existing = await prisma.holiday.findFirst({
      where: { country: h.country, name: h.name, year: h.year },
    });
    if (!existing) {
      await prisma.holiday.create({ data: h });
    }
  }

  // 7. Useful Links
  const usefulLinks = [
    {
      title: "Embassy of Spain — New Delhi",
      description: "Official diplomatic mission of the Kingdom of Spain to India, Nepal, and Sri Lanka.",
      url: "https://www.exteriores.gob.es/Embajadas/nuevadelhi/en/Paginas/index.aspx",
      category: "Embassy",
      sortOrder: 1,
    },
    {
      title: "Consulate General of Spain — Mumbai",
      description: "Consular jurisdiction covering Maharashtra, Goa, Gujarat, MP, Chhattisgarh, and UTs.",
      url: "https://www.exteriores.gob.es/Consulados/mumbai/en/Paginas/index.aspx",
      category: "Consulate",
      sortOrder: 2,
    },
    {
      title: "Economic & Commercial Office (ICEX)",
      description: "Trade promotion and commercial facilitation between Spain and the Indian subcontinent.",
      url: "https://www.icex.es",
      category: "Trade",
      sortOrder: 3,
    },
    {
      title: "Cervantes Institute — New Delhi",
      description: "Official cultural center promoting Spanish language teaching and Hispanic culture.",
      url: "https://nuevadelhi.cervantes.es/en/default.shtm",
      category: "Culture",
      sortOrder: 4,
    },
    {
      title: "Commercial Office of Spain — Mumbai",
      description: "Regional commercial section assisting bilateral investment and corporate partnerships.",
      url: "https://www.spainbusiness.com",
      category: "Trade",
      sortOrder: 5,
    },
    {
      title: "Tourist Office of Spain (Turespaña) — Mumbai",
      description: "National tourism board providing official travel planning information for Spain.",
      url: "https://www.spain.info/en/",
      category: "Tourism",
      sortOrder: 6,
    },
  ];

  for (const l of usefulLinks) {
    const existing = await prisma.usefulLink.findFirst({ where: { title: l.title } });
    if (!existing) {
      await prisma.usefulLink.create({ data: l });
    }
  }

  // 8. Active Announcements
  const announcements = [
    {
      title: "Official Demonstration & Prototype Notice",
      message: "This platform is an operational prototype and technical demonstration portal. Official visa decisions and final issuance remain solely with the diplomatic missions of Spain.",
      severity: AnnouncementSeverity.INFO,
      isPublished: true,
    },
    {
      title: "Fraud & Agent Warning",
      message: "BLS International and the Embassy of Spain do not charge any unauthorized fees. Beware of fraudulent agents claiming guaranteed visa approvals or selling unauthorized appointments.",
      severity: AnnouncementSeverity.WARNING,
      isPublished: true,
    },
    {
      title: "Mandatory Health Insurance Requirement",
      message: "All Schengen visa applicants must submit proof of travel medical insurance with minimum coverage of €30,000 including medical repatriation, valid across the entire Schengen territory.",
      severity: AnnouncementSeverity.INFO,
      isPublished: true,
    },
  ];

  for (const a of announcements) {
    const existing = await prisma.announcement.findFirst({ where: { title: a.title } });
    if (!existing) {
      await prisma.announcement.create({ data: a });
    }
  }

  // 9. Site Settings
  const settings = [
    { key: "bls_appointment_url", value: "https://india.blsspainvisa.com/book_appointment.php", description: "Official BLS appointment booking external portal" },
    { key: "bls_reprint_url", value: "https://india.blsspainvisa.com/reprint_appointment.php", description: "Official BLS appointment letter reprint portal" },
    { key: "bls_cancel_url", value: "https://india.blsspainvisa.com/cancel_appointment.php", description: "Official BLS appointment cancellation portal" },
    { key: "bls_tracking_url", value: "https://india.blsspainvisa.com/track_application.php", description: "Official BLS Embassy visa tracking external portal" },
    { key: "contact_email", value: "info.india@blsspainvisa.com", description: "General support email" },
    { key: "contact_phone", value: "+91 120 6641000", description: "Helpline phone number" },
    { key: "portal_brand_name", value: "BLS Biometric", description: "Official website brand name" },
    { key: "site_disclaimer", value: "Prototype / Demonstration Visa Application Service Portal. Not an official Embassy website.", description: "Legal status indicator" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
