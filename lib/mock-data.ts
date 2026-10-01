export interface CentreItem {
  id: string;
  code: string;
  name: string;
  country: string;
  address: string;
  submissionHours: string;
  passportCollectionHours: string;
  phone: string;
  email: string;
  mapUrl?: string;
  isActive: boolean;
}

export interface VisaCategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  documentsRequired: string;
  standardFee: number;
  childFee: number | null;
  blsServiceFee: number;
  isActive: boolean;
  displayOrder: number;
}

export interface VisaTypeItem {
  id: string;
  code: string;
  name: string;
  tagline: string | null;
  maxStay: string;
  overview: string;
  photoSpecifications: string;
  processingTime: string;
  jurisdictionInfo: string | null;
  formDownloadUrl: string | null;
  categories: VisaCategoryItem[];
}

export const DEFAULT_CENTRES: CentreItem[] = [
  {
    id: "del",
    code: "DEL",
    name: "New Delhi",
    country: "India",
    address: "1st Floor, Shivaji Stadium Metro Station, Concourse Level, Baba Kharak Singh Marg, Connaught Place, New Delhi - 110001",
    submissionHours: "09:00 - 15:30 (Monday - Friday)",
    passportCollectionHours: "15:00 - 17:00 (Monday - Friday)",
    phone: "+91 120 6641000",
    email: "feedback.del@blsspainvisa.com",
    mapUrl: "https://maps.google.com/?q=Shivaji+Stadium+Metro+Station+New+Delhi",
    isActive: true,
  },
  {
    id: "bom",
    code: "BOM",
    name: "Mumbai",
    country: "India",
    address: "Ground Floor, Earnest House, NCPA Marg, Nariman Point, Mumbai, Maharashtra 400021",
    submissionHours: "08:30 - 15:00 (Monday - Friday)",
    passportCollectionHours: "14:30 - 16:30 (Monday - Friday)",
    phone: "+91 22 67003888",
    email: "feedback.bom@blsspainvisa.com",
    mapUrl: "https://maps.google.com/?q=Earnest+House+Nariman+Point+Mumbai",
    isActive: true,
  },
  {
    id: "blr",
    code: "BLR",
    name: "Bengaluru",
    country: "India",
    address: "Unit No. 302 & 303, 3rd Floor, Prestige Atrium, Central Street, Shivaji Nagar, Bengaluru, Karnataka 560001",
    submissionHours: "09:00 - 15:00 (Monday - Friday)",
    passportCollectionHours: "15:00 - 17:00 (Monday - Friday)",
    phone: "+91 120 6641000",
    email: "feedback.blr@blsspainvisa.com",
    mapUrl: "https://maps.google.com/?q=Prestige+Atrium+Bengaluru",
    isActive: true,
  },
  {
    id: "maa",
    code: "MAA",
    name: "Chennai",
    country: "India",
    address: "Fagun Mansions, 3rd Floor, No. 74, Ethiraj Salai, Egmore, Chennai, Tamil Nadu 600008",
    submissionHours: "09:00 - 15:00 (Monday - Friday)",
    passportCollectionHours: "15:00 - 17:00 (Monday - Friday)",
    phone: "+91 120 6641000",
    email: "feedback.maa@blsspainvisa.com",
    mapUrl: "https://maps.google.com/?q=Fagun+Mansions+Egmore+Chennai",
    isActive: true,
  },
  {
    id: "ccu",
    code: "CCU",
    name: "Kolkata",
    country: "India",
    address: "Rene Tower, 4th Floor, Building No. 1842, Rajdanga Main Road, Kasba, Kolkata, West Bengal 700107",
    submissionHours: "09:00 - 14:30 (Monday - Friday)",
    passportCollectionHours: "14:30 - 16:30 (Monday - Friday)",
    phone: "+91 120 6641000",
    email: "feedback.ccu@blsspainvisa.com",
    mapUrl: "https://maps.google.com/?q=Rene+Tower+Kasba+Kolkata",
    isActive: true,
  },
  {
    id: "hyd",
    code: "HYD",
    name: "Hyderabad",
    country: "India",
    address: "8-2-684/3/25&26, Ground Floor, Krishe Sapphire, Madhapur, Hitech City, Hyderabad, Telangana 500081",
    submissionHours: "09:00 - 15:00 (Monday - Friday)",
    passportCollectionHours: "15:00 - 16:30 (Monday - Friday)",
    phone: "+91 120 6641000",
    email: "feedback.hyd@blsspainvisa.com",
    mapUrl: "https://maps.google.com/?q=Krishe+Sapphire+Madhapur+Hyderabad",
    isActive: true,
  },
  {
    id: "amd",
    code: "AMD",
    name: "Ahmedabad",
    country: "India",
    address: "Unit No. 101, 1st Floor, Addor Aspire, Near University Ground, Panjrapole, Ahmedabad, Gujarat 380015",
    submissionHours: "09:00 - 15:00 (Monday - Friday)",
    passportCollectionHours: "15:00 - 16:30 (Monday - Friday)",
    phone: "+91 120 6641000",
    email: "feedback.amd@blsspainvisa.com",
    mapUrl: "https://maps.google.com/?q=Addor+Aspire+Panjrapole+Ahmedabad",
    isActive: true,
  },
  {
    id: "ixc",
    code: "IXC",
    name: "Chandigarh",
    country: "India",
    address: "Elante Offices, Unit No. 210, 2nd Floor, Industrial Area Phase 1, Chandigarh 160002",
    submissionHours: "09:00 - 15:00 (Monday - Friday)",
    passportCollectionHours: "15:00 - 16:30 (Monday - Friday)",
    phone: "+91 120 6641000",
    email: "feedback.ixc@blsspainvisa.com",
    mapUrl: "https://maps.google.com/?q=Elante+Offices+Chandigarh",
    isActive: true,
  },
  {
    id: "juc",
    code: "JUC",
    name: "Jalandhar",
    country: "India",
    address: "Lower Ground Floor, Midland Financial Centre, GT Road, Jalandhar, Punjab 144001",
    submissionHours: "09:00 - 15:00 (Monday - Friday)",
    passportCollectionHours: "15:00 - 16:30 (Monday - Friday)",
    phone: "+91 120 6641000",
    email: "feedback.juc@blsspainvisa.com",
    mapUrl: "https://maps.google.com/?q=Midland+Financial+Centre+Jalandhar",
    isActive: true,
  },
  {
    id: "pny",
    code: "PNY",
    name: "Puducherry",
    country: "India",
    address: "No. 42, Romain Rolland Street, White Town, Puducherry 605001",
    submissionHours: "09:00 - 14:00 (Monday - Friday)",
    passportCollectionHours: "14:00 - 16:00 (Monday - Friday)",
    phone: "+91 120 6641000",
    email: "feedback.pny@blsspainvisa.com",
    mapUrl: "https://maps.google.com/?q=Romain+Rolland+Street+Puducherry",
    isActive: true,
  },
  {
    id: "cok",
    code: "COK",
    name: "Kochi",
    country: "India",
    address: "1st Floor, Coastal Chambers, Panampilly Nagar, Kochi, Kerala 682036",
    submissionHours: "09:00 - 14:30 (Monday - Friday)",
    passportCollectionHours: "14:30 - 16:30 (Monday - Friday)",
    phone: "+91 120 6641000",
    email: "feedback.cok@blsspainvisa.com",
    mapUrl: "https://maps.google.com/?q=Panampilly+Nagar+Kochi",
    isActive: true,
  },
  {
    id: "ktm",
    code: "KTM",
    name: "Kathmandu",
    country: "Nepal",
    address: "3rd Floor, Shreenath Complex, Durbar Marg, Kathmandu, Nepal",
    submissionHours: "09:30 - 14:30 (Sunday - Thursday)",
    passportCollectionHours: "15:00 - 16:30 (Sunday - Thursday)",
    phone: "+977 1 4220088",
    email: "feedback.ktm@blsspainvisa.com",
    mapUrl: "https://maps.google.com/?q=Durbar+Marg+Kathmandu+Nepal",
    isActive: true,
  },
  {
    id: "cmb",
    code: "CMB",
    name: "Colombo",
    country: "Sri Lanka",
    address: "Level 4, Access Towers, No. 278, Union Place, Colombo 02, Sri Lanka",
    submissionHours: "09:00 - 14:30 (Monday - Friday)",
    passportCollectionHours: "15:00 - 16:30 (Monday - Friday)",
    phone: "+94 11 2300400",
    email: "feedback.cmb@blsspainvisa.com",
    mapUrl: "https://maps.google.com/?q=Access+Towers+Union+Place+Colombo",
    isActive: true,
  },
];

export const DEFAULT_VISA_TYPES: VisaTypeItem[] = [
  {
    id: "schengen",
    code: "SCHENGEN",
    name: "Schengen Visa",
    tagline: "Short Stay Visa (Maximum 90 days within any 180-day period)",
    maxStay: "90 days within 180-day period",
    overview:
      "Schengen visas allow travelers to enter Spain and all other 28 Schengen member countries for short visits, tourism, business, transit, or visiting family. Stays cannot exceed 90 days in any 180-day rolling period.",
    photoSpecifications:
      "Photographs must be in color, 35mm x 45mm, taken within the last 6 months against a plain light/white background with neutral facial expression.",
    processingTime:
      "Standard processing time is a minimum of 15 calendar days from the date received at the Embassy or Consulate General of Spain.",
    jurisdictionInfo:
      "Jurisdiction is determined by your continuous lawful residence in India during the last 6 months. Northern, Eastern, and Southern states belong to New Delhi Jurisdiction. Western & Central states belong to Mumbai Jurisdiction.",
    formDownloadUrl: "https://www.exteriores.gob.es/Documents/DocumentosPosteriores/Formulario_Schengen_EN.pdf",
    categories: [
      {
        id: "cat-tourist-visa",
        name: "Tourist Visa",
        slug: "tourist-visa",
        description: "For individuals travelling to Spain for tourism, leisure, sightseeing, or holiday visits.",
        documentsRequired:
          "Original passport (valid at least 3 months beyond intended departure, 2 blank pages), completed signed Schengen application form, 2 recent photographs, roundtrip flight reservation, proof of accommodation/hotel booking, travel medical insurance (€30,000 minimum coverage), personal bank statements (last 6 months, bank seal & sign), ITR acknowledgement (last 3 years).",
        standardFee: 9599,
        childFee: 4799,
        blsServiceFee: 1802,
        isActive: true,
        displayOrder: 1,
      },
      {
        id: "cat-business-visa",
        name: "Business Visa",
        slug: "business-visa",
        description: "For commercial meetings, trade conferences, corporate events, or business negotiations in Spain.",
        documentsRequired:
          "Original passport, completed application form, official invitation letter from the Spanish host company (in Spanish, signed, mentioning purpose and duration), covering letter from Indian employer, company registration documents, recent 6 months company and personal bank statements, roundtrip itinerary, confirmed hotel booking, and €30,000 travel health insurance.",
        standardFee: 9599,
        childFee: 4799,
        blsServiceFee: 1802,
        isActive: true,
        displayOrder: 2,
      },
      {
        id: "cat-airport-transit-visa",
        name: "Airport Transit Visa",
        slug: "airport-transit-visa",
        description: "For transiting through the international transit area of Spanish airports en route to a non-Schengen destination.",
        documentsRequired:
          "Original passport, visa or entry permit for the destination country, onward confirmed air tickets, valid travel medical insurance, proof of financial solvency.",
        standardFee: 9599,
        childFee: 4799,
        blsServiceFee: 1802,
        isActive: true,
        displayOrder: 3,
      },
      {
        id: "cat-relative-eea-eu",
        name: "Relative of EEA/EU Citizens",
        slug: "relative-eea-eu",
        description: "For spouse, registered partner, or dependent direct descendants/ascendants of an EU/EEA or Swiss citizen.",
        documentsRequired:
          "Proof of EU/EEA citizenship of family member (copy of passport/DNI), authenticated proof of family relationship (Marriage certificate / Birth certificate officially apostilled and translated into Spanish), proof of accompanying or joining the EU national in Spain.",
        standardFee: 0,
        childFee: 0,
        blsServiceFee: 1802,
        isActive: true,
        displayOrder: 4,
      },
      {
        id: "cat-transit-visa-seamen",
        name: "Transit Visa for Seamen",
        slug: "transit-visa-seamen",
        description: "For mariners and seafarers boarding or disembarking a vessel docked in a Spanish port.",
        documentsRequired:
          "Seaman's discharge book / CDC, continuous discharge certificate, letter from Spanish shipping agent detailing vessel name, IMO number, port and boarding dates, letter from Indian crewing agency, travel insurance.",
        standardFee: 9599,
        childFee: 4799,
        blsServiceFee: 1802,
        isActive: true,
        displayOrder: 5,
      },
    ],
  },
  {
    id: "national",
    code: "NATIONAL",
    name: "National Visa",
    tagline: "Long Stay Visa (Stays exceeding 90 days)",
    maxStay: "Over 90 days / Residence / Study / Work",
    overview:
      "National (Type D) visas authorize foreign nationals to reside, study, conduct research, or work in Spain for periods exceeding 90 days.",
    photoSpecifications:
      "Identical to Schengen photo requirements: recent passport-sized color photograph (35x45 mm), white background, neutral facial expression, clear focus.",
    processingTime:
      "Processing time for National Visas varies by visa category, generally ranging from 1 month to 3 months.",
    jurisdictionInfo:
      "Applicants must submit their National Visa applications to the corresponding Consulate General or Embassy according to their permanent official residence.",
    formDownloadUrl: "https://www.exteriores.gob.es/Documents/DocumentosPosteriores/Formulario_Nacional_EN.pdf",
    categories: [
      {
        id: "cat-student-visa-long",
        name: "Student Visa >90 days",
        slug: "student-visa-long",
        description: "For full-time university studies, exchange programs, or long-term academic research.",
        documentsRequired:
          "Admission letter from authorized educational institution in Spain, proof of academic qualifications, medical certificate, police clearance certificate (apostilled), proof of financial resources, Spanish health insurance.",
        standardFee: 9599,
        childFee: 4799,
        blsServiceFee: 1802,
        isActive: true,
        displayOrder: 1,
      },
      {
        id: "cat-digital-nomad-visa",
        name: "Digital Nomad Visa",
        slug: "digital-nomad-visa",
        description: "For remote workers and international teleworkers residing in Spain under Law 28/2022.",
        documentsRequired:
          "Contract with foreign enterprise (at least 3 months old), proof company has operated for >1 year, teleworking authorization letter, university degree or 3 years relevant experience, clean police record (apostilled), financial solvency (>200% Spanish minimum wage), Spanish health insurance.",
        standardFee: 9599,
        childFee: 4799,
        blsServiceFee: 1802,
        isActive: true,
        displayOrder: 2,
      },
      {
        id: "cat-work-residence-permit",
        name: "Work & Residence Permit Visa",
        slug: "work-residence-permit",
        description: "Standard employment contract visa with approved labor authorization from Spanish authorities.",
        documentsRequired:
          "Official initial employment authorization copy, employment contract copy, medical certificate, apostilled criminal record certificate, original valid passport.",
        standardFee: 9599,
        childFee: 4799,
        blsServiceFee: 1802,
        isActive: true,
        displayOrder: 3,
      },
      {
        id: "cat-non-lucrative-visa",
        name: "Non-Lucrative Residence Visa",
        slug: "non-lucrative-visa",
        description: "For individuals with independent passive income or retirement funds seeking residence without work.",
        documentsRequired:
          "Proof of sustained passive income (minimum 400% IPREM per annum), comprehensive private medical insurance in Spain, medical fitness certificate, apostilled criminal record check.",
        standardFee: 9599,
        childFee: 4799,
        blsServiceFee: 1802,
        isActive: true,
        displayOrder: 4,
      },
      {
        id: "cat-entrepreneur-visa",
        name: "Entrepreneur Visa",
        slug: "entrepreneur-visa",
        description: "For innovative startup founders endorsed by ENISA and Spanish commercial offices.",
        documentsRequired:
          "Favorable ENISA innovation evaluation report, detailed business plan, proof of investment funds, police clearance, health insurance.",
        standardFee: 9599,
        childFee: 4799,
        blsServiceFee: 1802,
        isActive: true,
        displayOrder: 5,
      },
      {
        id: "cat-family-regrouping-general",
        name: "Family Regrouping – General",
        slug: "family-regrouping-general",
        description: "For relatives of non-EU foreign residents who have obtained residence renewal.",
        documentsRequired:
          "Initial residence permit authorization copy, proof of family ties (apostilled/translated), sponsor's NIE and passport copy, medical and police certificates.",
        standardFee: 9599,
        childFee: 4799,
        blsServiceFee: 1802,
        isActive: true,
        displayOrder: 6,
      },
    ],
  },
];

export const DEFAULT_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "Official Demonstration & Prototype Notice",
    message: "This platform is an operational prototype and technical demonstration portal. Official visa decisions and final issuance remain solely with the diplomatic missions of Spain.",
    severity: "INFO" as const,
    isPublished: true,
  },
  {
    id: "ann-2",
    title: "Fraud & Agent Warning",
    message: "BLS International and the Embassy of Spain do not charge any unauthorized fees. Beware of fraudulent agents claiming guaranteed visa approvals or selling unauthorized appointments.",
    severity: "WARNING" as const,
    isPublished: true,
  },
  {
    id: "ann-3",
    title: "Mandatory Health Insurance Requirement",
    message: "All Schengen visa applicants must submit proof of travel medical insurance with minimum coverage of €30,000 including medical repatriation, valid across the entire Schengen territory.",
    severity: "INFO" as const,
    isPublished: true,
  },
];

export const DEFAULT_SETTINGS: Record<string, string> = {
  bls_appointment_url: "https://india.blsspainvisa.com/book_appointment.php",
  bls_reprint_url: "https://india.blsspainvisa.com/reprint_appointment.php",
  bls_cancel_url: "https://india.blsspainvisa.com/cancel_appointment.php",
  bls_tracking_url: "https://india.blsspainvisa.com/track_application.php",
  contact_email: "info.india@blsspainvisa.com",
  contact_phone: "+91 120 6641000",
  portal_brand_name: "BLS Biometric",
  site_disclaimer: "Prototype / Demonstration Visa Application Service Portal. Not an official Embassy website.",
};

export const DEFAULT_SERVICES = [
  { id: "1", title: "Courier Delivery", description: "Secure courier dispatch of passport directly to your designated home or office address.", price: 650, isActive: true },
  { id: "2", title: "B&W Photocopy", description: "Per-page high quality monochrome photocopying service available at the centre.", price: 10, isActive: true },
  { id: "3", title: "SMS Status Alerts", description: "Real-time automated SMS updates dispatched across every critical stage of processing.", price: 150, isActive: true },
  { id: "4", title: "Call Back Service", description: "Dedicated customer service representative call back within 2 business hours for queries.", price: 200, isActive: true },
  { id: "5", title: "Premium Lounge Service", description: "Priority submission, personal officer assistance, refreshments, and private lounge comfort.", price: 3200, isActive: true },
  { id: "6", title: "Document Printing", description: "Direct printing from email or storage drive for missing supporting documentation.", price: 25, isActive: true },
  { id: "7", title: "Form Filling Assistance", description: "Professional assistance by our staff in completing your official visa application form.", price: 1000, isActive: true },
  { id: "8", title: "Photo Booth Service", description: "ICAO compliant Schengen specification biometric passport photographs taken on site.", price: 350, isActive: true },
  { id: "9", title: "BLS Mandatory Service Charge", description: "Standard official logistics and administrative handling charge per applicant.", price: 1802, isActive: true },
];

export const DEFAULT_FAQS = [
  {
    id: "f1",
    category: "General",
    question: "What is a Visa?",
    answer: "A visa is an official document or endorsement placed in a passport issued by an authorized government diplomatic mission (Embassy or Consulate), granting authorization to enter, stay, or leave the territory of that sovereign state under specified terms and time limits.",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "f2",
    category: "General",
    question: "What is a Schengen Visa?",
    answer: "A Schengen visa is a short-stay authorization permitting travel throughout the 29 European countries comprising the Schengen Area. It allows a maximum stay of 90 days within any rolling 180-day period for purposes such as tourism, business, visiting friends/family, or cultural exchange.",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "f3",
    category: "General",
    question: "What is a National Visa?",
    answer: "A National (Type D) visa is a long-term authorization issued for stays exceeding 90 days in Spain. It is required for purposes including full-time academic studies, salaried employment, self-employment, non-lucrative residency, research, and family reunification.",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "f4",
    category: "General",
    question: "Can I apply for Spain if travelling to Rome and Paris as well?",
    answer: "Under Schengen regulations, you must apply at the Embassy/Consulate of the country that constitutes your main destination in terms of length or purpose of stay. If you plan to spend the highest number of days in Spain, you must apply through Spain.",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "f5",
    category: "General",
    question: "Does BLS prepare or decide applications?",
    answer: "No. BLS International is purely an outsourced administrative and logistics service provider authorized to collect documents and biometric data. The assessment and final decision rest exclusively with the Embassy or Consulate General of Spain.",
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "f6",
    category: "Application",
    question: "How early can I apply for my Schengen Visa?",
    answer: "You can submit your application up to 6 months prior to your intended date of travel (up to 9 months for seafarers), but no later than 15 calendar days before departure.",
    sortOrder: 6,
    isActive: true,
  },
  {
    id: "f7",
    category: "Application",
    question: "What is the standard processing time?",
    answer: "Normal processing time is at least 15 calendar days from receipt at the diplomatic mission. In individual cases requiring secondary verification, this period may be extended up to 45 calendar days.",
    sortOrder: 7,
    isActive: true,
  },
];

export const DEFAULT_HOLIDAYS = [
  { id: "h1", country: "India", year: 2026, date: "2026-01-26T00:00:00.000Z", name: "Republic Day", description: "Indian National Holiday", isActive: true },
  { id: "h2", country: "India", year: 2026, date: "2026-03-04T00:00:00.000Z", name: "Holi", description: "Festival of Colors", isActive: true },
  { id: "h3", country: "India", year: 2026, date: "2026-04-03T00:00:00.000Z", name: "Good Friday", description: "Christian Holy Day", isActive: true },
  { id: "h4", country: "India", year: 2026, date: "2026-05-01T00:00:00.000Z", name: "Labour Day", description: "International Workers' Day", isActive: true },
  { id: "h5", country: "India", year: 2026, date: "2026-08-15T00:00:00.000Z", name: "Independence Day", description: "Indian Independence Day", isActive: true },
  { id: "h6", country: "India", year: 2026, date: "2026-10-02T00:00:00.000Z", name: "Mahatma Gandhi Jayanti", description: "National Holiday", isActive: true },
  { id: "h7", country: "India", year: 2026, date: "2026-10-12T00:00:00.000Z", name: "Fiesta Nacional de España", description: "Spain National Day", isActive: true },
  { id: "h8", country: "India", year: 2026, date: "2026-11-08T00:00:00.000Z", name: "Diwali (Deepavali)", description: "Festival of Lights", isActive: true },
  { id: "h9", country: "India", year: 2026, date: "2026-12-25T00:00:00.000Z", name: "Christmas Day", description: "Navidad", isActive: true },
];

export const DEFAULT_USEFUL_LINKS = [
  {
    id: "l1",
    title: "Embassy of Spain — New Delhi",
    description: "Official diplomatic mission of the Kingdom of Spain to India, Nepal, and Sri Lanka.",
    url: "https://www.exteriores.gob.es/Embajadas/nuevadelhi/en/Paginas/index.aspx",
    category: "Embassy",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "l2",
    title: "Consulate General of Spain — Mumbai",
    description: "Consular jurisdiction covering Maharashtra, Goa, Gujarat, MP, Chhattisgarh, and UTs.",
    url: "https://www.exteriores.gob.es/Consulados/mumbai/en/Paginas/index.aspx",
    category: "Consulate",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "l3",
    title: "Tourist Office of Spain (Turespaña)",
    description: "National tourism board providing official travel planning information for Spain.",
    url: "https://www.spain.info/en/",
    category: "Tourism",
    sortOrder: 3,
    isActive: true,
  },
];
