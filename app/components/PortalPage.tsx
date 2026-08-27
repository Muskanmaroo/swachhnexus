"use client";

import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useState } from "react";
import { INDIA_CITY_COUNT, indiaLocations } from "../data/india-locations";

export type PortalView = "home" | "report" | "track" | "map" | "dashboard" | "future";
type Severity = "Critical" | "High" | "Medium";
type TicketStatus = "Reported" | "Assigned" | "In progress" | "Resolved";
type LanguageCode = "en" | "as" | "bn" | "brx" | "doi" | "gu" | "hi" | "kn" | "ks" | "kok" | "ml" | "mni" | "mr" | "mai" | "ne" | "or" | "pa" | "sa" | "sat" | "sd" | "ta" | "te" | "ur";

type Ticket = {
  id: string;
  issue: string;
  place: string;
  ward: string;
  severity: Severity;
  status: TicketStatus;
  age: string;
  support: number;
};

const tickets: Ticket[] = [
  { id: "SRV-107", issue: "Waterlogged waste", place: "Bhawarkuan Main Road", ward: "Ward 74", severity: "Critical", status: "Reported", age: "4 min", support: 3 },
  { id: "SRV-101", issue: "Clogged drain", place: "Snehlataganj", ward: "Ward 12", severity: "Critical", status: "In progress", age: "28 min", support: 8 },
  { id: "SRV-106", issue: "Overflowing bin", place: "Malwa Mill Square", ward: "Ward 43", severity: "High", status: "Reported", age: "19 min", support: 2 },
  { id: "SRV-102", issue: "Waste dumping", place: "Rajwada", ward: "Ward 18", severity: "High", status: "Assigned", age: "42 min", support: 14 },
  { id: "SRV-098", issue: "Overflowing bin", place: "Juni Indore school gate", ward: "Ward 21", severity: "High", status: "Reported", age: "46 min", support: 5 },
  { id: "SRV-108", issue: "Road litter", place: "Vijay Nagar Square", ward: "Ward 31", severity: "Medium", status: "Reported", age: "1 hr", support: 1 },
  { id: "SRV-092", issue: "Public toilet maintenance", place: "Sarwate Bus Stand", ward: "Ward 08", severity: "Medium", status: "Resolved", age: "2 hr", support: 3 },
];

const issueCategories = [
  ["Overflowing garbage or bin", "Bin full or waste spilling out", "♲"],
  ["Road litter", "Loose rubbish on a street or footpath", "⌁"],
  ["Clogged drain or sewer", "Blocked drain, sewage or bad overflow", "≋"],
  ["Illegal waste dumping", "Waste left on open or public land", "▰"],
  ["Waterlogging", "Stagnant water or flooding near waste", "◒"],
  ["Public toilet issue", "Cleaning, water or maintenance problem", "▣"],
  ["Construction debris", "Rubble blocking a road or public space", "▥"],
  ["Burning waste", "Garbage being burned in the open", "♨"],
  ["Dead animal", "Animal remains requiring safe removal", "!"],
  ["Waste not collected", "Household or community waste pickup missed", "⌛"],
  ["Other", "Problem not listed here", "+"],
] as const;

const navItems: Array<[PortalView, string, string]> = [
  ["home", "Home", "/"],
  ["report", "Report Issue", "/report"],
  ["track", "Track Report", "/track"],
  ["map", "City Map", "/map"],
  ["dashboard", "Officer Dashboard", "/dashboard"],
  ["future", "Future Lab", "/future"],
];

const languages: Array<{code: LanguageCode; name: string; english: string; dir?: "rtl"}> = [
  {code:"en",name:"English",english:"English"}, {code:"as",name:"অসমীয়া",english:"Assamese"},
  {code:"bn",name:"বাংলা",english:"Bengali"}, {code:"brx",name:"बड़ो",english:"Bodo"},
  {code:"doi",name:"डोगरी",english:"Dogri"}, {code:"gu",name:"ગુજરાતી",english:"Gujarati"},
  {code:"hi",name:"हिन्दी",english:"Hindi"}, {code:"kn",name:"ಕನ್ನಡ",english:"Kannada"},
  {code:"ks",name:"کٲشُر",english:"Kashmiri",dir:"rtl"}, {code:"kok",name:"कोंकणी",english:"Konkani"},
  {code:"ml",name:"മലയാളം",english:"Malayalam"}, {code:"mni",name:"মণিপুরী",english:"Manipuri"},
  {code:"mr",name:"मराठी",english:"Marathi"}, {code:"mai",name:"मैथिली",english:"Maithili"},
  {code:"ne",name:"नेपाली",english:"Nepali"}, {code:"or",name:"ଓଡ଼ିଆ",english:"Odia"},
  {code:"pa",name:"ਪੰਜਾਬੀ",english:"Punjabi"}, {code:"sa",name:"संस्कृतम्",english:"Sanskrit"},
  {code:"sat",name:"ᱥᱟᱱᱛᱟᱲᱤ",english:"Santali"}, {code:"sd",name:"سنڌي",english:"Sindhi",dir:"rtl"},
  {code:"ta",name:"தமிழ்",english:"Tamil"}, {code:"te",name:"తెలుగు",english:"Telugu"},
  {code:"ur",name:"اردو",english:"Urdu",dir:"rtl"},
];

const languageCopy: Record<LanguageCode, { nav: string[]; guide: string; help: string; listen: string }> = {
  en:{nav:["Home","Report issue","Track report","City map","Officer dashboard","Future lab"],guide:"Choose a service: report a cleanliness issue, track its status, explore city signals or open the officer dashboard.",help:"Language assistance",listen:"Listen"},
  as:{nav:["মূল পৃষ্ঠা","সমস্যা জনাওক","প্ৰতিবেদন চাওক","নগৰ মানচিত্ৰ","বিষয়া ডেশ্বব'ৰ্ড","ভৱিষ্যৎ পৰিকল্পনা"],guide:"এটা সেৱা বাছক: পৰিচ্ছন্নতাৰ সমস্যা জনাওক, অৱস্থা চাওক, নগৰৰ সংকেত চাওক বা বিষয়া ডেশ্বব'ৰ্ড খোলক।",help:"ভাষা সহায়তা",listen:"শুনক"},
  bn:{nav:["হোম","সমস্যা জানান","রিপোর্ট দেখুন","শহরের মানচিত্র","কর্মকর্তা ড্যাশবোর্ড","ভবিষ্যৎ পরিকল্পনা"],guide:"একটি পরিষেবা বেছে নিন: পরিচ্ছন্নতার সমস্যা জানান, রিপোর্টের অবস্থা দেখুন, শহরের সংকেত দেখুন অথবা কর্মকর্তা ড্যাশবোর্ড খুলুন।",help:"ভাষা সহায়তা",listen:"শুনুন"},
  brx:{nav:["न'","जेंना फोरमाय","रिपर्ट नाय","नोगोर मानचित्र","अफिसार डेसबोर्ड","इयुन परिकल्पना"],guide:"मोनसे सेवाखौ सायख: साफा-सिखोन जेंनाखौ फोरमाय, रिपर्टनि थाखो नाय, नोगोरनि संकेत नाय एबा अफिसार डेसबोर्डखौ खेवन।",help:"राव मदद",listen:"खोनासं"},
  doi:{nav:["घर","शकैत दर्ज करो","रिपोर्ट दा पता लाओ","शैहर नक्शा","अफसर डैशबोर्ड","भविक्ख योजना"],guide:"इक सेवा चुनो: सफाई दी समस्या दर्ज करो, रिपोर्ट दी स्थिति दिक्खो, शैहर दे संकेत दिक्खो जां अफसर डैशबोर्ड खोलो।",help:"भाशा मदद",listen:"सुनो"},
  gu:{nav:["મુખ્ય પાનું","સમસ્યા નોંધાવો","રિપોર્ટ તપાસો","શહેરનો નકશો","અધિકારી ડૅશબોર્ડ","ભાવિ યોજના"],guide:"સેવા પસંદ કરો: સ્વચ્છતાની સમસ્યા નોંધાવો, રિપોર્ટની સ્થિતિ તપાસો, શહેરના સંકેતો જુઓ અથવા અધિકારી ડૅશબોર્ડ ખોલો.",help:"ભાષા સહાય",listen:"સાંભળો"},
  hi:{nav:["मुखपृष्ठ","समस्या दर्ज करें","रिपोर्ट देखें","शहर का नक्शा","अधिकारी डैशबोर्ड","भविष्य योजना"],guide:"एक सेवा चुनें: स्वच्छता की समस्या दर्ज करें, रिपोर्ट की स्थिति देखें, शहर के संकेत देखें या अधिकारी डैशबोर्ड खोलें।",help:"भाषा सहायता",listen:"सुनें"},
  kn:{nav:["ಮುಖಪುಟ","ಸಮಸ್ಯೆ ವರದಿ","ವರದಿ ಸ್ಥಿತಿ","ನಗರ ನಕ್ಷೆ","ಅಧಿಕಾರಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್","ಭವಿಷ್ಯ ಯೋಜನೆ"],guide:"ಸೇವೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ: ಸ್ವಚ್ಛತಾ ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ, ಸ್ಥಿತಿಯನ್ನು ನೋಡಿ, ನಗರದ ಸೂಚನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ ಅಥವಾ ಅಧಿಕಾರಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ.",help:"ಭಾಷಾ ಸಹಾಯ",listen:"ಆಲಿಸಿ"},
  ks:{nav:["گَرٕ","مسئلہ درج کٔرِو","رپورٹ وُچھِو","شہرُک نقشہ","افسر ڈیش بورڈ","مستقبل منصوبہ"],guide:"خدمت ژارِو: صفٲیی ہُند مسئلہ درج کٔرِو، رپورٹٕچ حالت وُچھِو، شہری اشارٕ وُچھِو یا افسر ڈیش بورڈ کھولِو۔",help:"زبان مدد",listen:"بوزِو"},
  kok:{nav:["मुखेल पान","समस्या नोंद करात","अहवाल पळयात","शाराचो नकाशो","अधिकारी डॅशबोर्ड","फुडली येवजण"],guide:"सेवा निवडात: स्वच्छतायेची समस्या नोंद करात, अहवालाची स्थिती पळयात, शाराचे संकेत पळयात वा अधिकारी डॅशबोर्ड उगडात.",help:"भाशा मजत",listen:"आयकात"},
  ml:{nav:["ഹോം","പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക","റിപ്പോർട്ട് പരിശോധിക്കുക","നഗര ഭൂപടം","ഓഫീസർ ഡാഷ്ബോർഡ്","ഭാവി പദ്ധതി"],guide:"ഒരു സേവനം തിരഞ്ഞെടുക്കുക: ശുചിത്വ പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക, റിപ്പോർട്ടിന്റെ നില പരിശോധിക്കുക, നഗര സൂചനകൾ കാണുക അല്ലെങ്കിൽ ഓഫീസർ ഡാഷ്ബോർഡ് തുറക്കുക.",help:"ഭാഷാ സഹായം",listen:"കേൾക്കുക"},
  mni:{nav:["হোম","সমস্যা রিপোর্ট","রিপোর্ট চেক","শহর ম্যাপ","অফিসার ড্যাশবোর্ড","ভবিষ্যৎ পরিকল্পনা"],guide:"সেবা অমা খনবিয়ু: শেংনা-হায়নারবা সমস্যা রিপোর্ট তৌ, রিপোর্টকী ফিভম চেক তৌ, শহরগী সংকেত য়েংউ নত্রগা অফিসার ড্যাশবোর্ড হাংউ।",help:"লোন সাহায্য",listen:"তাবিয়ু"},
  mr:{nav:["मुखपृष्ठ","समस्या नोंदवा","अहवाल तपासा","शहर नकाशा","अधिकारी डॅशबोर्ड","भविष्य योजना"],guide:"सेवा निवडा: स्वच्छतेची समस्या नोंदवा, अहवालाची स्थिती तपासा, शहरातील संकेत पाहा किंवा अधिकारी डॅशबोर्ड उघडा.",help:"भाषा सहाय्य",listen:"ऐका"},
  mai:{nav:["मुखपृष्ठ","समस्या दर्ज करू","रिपोर्ट देखू","शहरक नक्शा","अधिकारी डैशबोर्ड","भविष्य योजना"],guide:"एकटा सेवा चुनू: स्वच्छताक समस्या दर्ज करू, रिपोर्टक स्थिति देखू, शहरक संकेत देखू वा अधिकारी डैशबोर्ड खोलू।",help:"भाषा सहायता",listen:"सुनू"},
  ne:{nav:["गृहपृष्ठ","समस्या रिपोर्ट","रिपोर्ट हेर्नुहोस्","सहर नक्सा","अधिकारी ड्यासबोर्ड","भविष्य योजना"],guide:"सेवा छान्नुहोस्: सरसफाइ समस्या रिपोर्ट गर्नुहोस्, रिपोर्टको अवस्था हेर्नुहोस्, सहरका संकेत हेर्नुहोस् वा अधिकारी ड्यासबोर्ड खोल्नुहोस्।",help:"भाषा सहायता",listen:"सुन्नुहोस्"},
  or:{nav:["ମୁଖ୍ୟ ପୃଷ୍ଠା","ସମସ୍ୟା ଜଣାନ୍ତୁ","ରିପୋର୍ଟ ଦେଖନ୍ତୁ","ସହର ମାନଚିତ୍ର","ଅଧିକାରୀ ଡ୍ୟାସବୋର୍ଡ","ଭବିଷ୍ୟତ ଯୋଜନା"],guide:"ଏକ ସେବା ବାଛନ୍ତୁ: ପରିଚ୍ଛନ୍ନତା ସମସ୍ୟା ଜଣାନ୍ତୁ, ରିପୋର୍ଟ ସ୍ଥିତି ଦେଖନ୍ତୁ, ସହର ସଙ୍କେତ ଦେଖନ୍ତୁ କିମ୍ବା ଅଧିକାରୀ ଡ୍ୟାସବୋର୍ଡ ଖୋଲନ୍ତୁ।",help:"ଭାଷା ସହାୟତା",listen:"ଶୁଣନ୍ତୁ"},
  pa:{nav:["ਮੁੱਖ ਪੰਨਾ","ਸਮੱਸਿਆ ਦਰਜ ਕਰੋ","ਰਿਪੋਰਟ ਵੇਖੋ","ਸ਼ਹਿਰ ਨਕਸ਼ਾ","ਅਧਿਕਾਰੀ ਡੈਸ਼ਬੋਰਡ","ਭਵਿੱਖ ਯੋਜਨਾ"],guide:"ਇੱਕ ਸੇਵਾ ਚੁਣੋ: ਸਫ਼ਾਈ ਦੀ ਸਮੱਸਿਆ ਦਰਜ ਕਰੋ, ਰਿਪੋਰਟ ਦੀ ਸਥਿਤੀ ਵੇਖੋ, ਸ਼ਹਿਰ ਦੇ ਸੰਕੇਤ ਵੇਖੋ ਜਾਂ ਅਧਿਕਾਰੀ ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ।",help:"ਭਾਸ਼ਾ ਸਹਾਇਤਾ",listen:"ਸੁਣੋ"},
  sa:{nav:["मुखपृष्ठम्","समस्यां निवेदयतु","प्रतिवेदनं पश्यतु","नगरमानचित्रम्","अधिकारी फलकम्","भावियोजना"],guide:"सेवां चिनोतु: स्वच्छतासमस्यां निवेदयतु, प्रतिवेदनस्य स्थितिं पश्यतु, नगरसंकेतां पश्यतु अथवा अधिकारीफलकम् उद्घाटयतु।",help:"भाषासहायता",listen:"शृणोतु"},
  sat:{nav:["ᱚᱲᱟᱜ","ᱡᱟᱦᱟᱱ ᱞᱮᱠᱟ","ᱨᱤᱯᱳᱨᱴ ᱧᱮᱞ","ᱱᱚᱜᱚᱨ ᱱᱚᱠᱥᱟ","ᱚᱯᱷᱤᱥᱟᱨ ᱰᱮᱥᱵᱳᱨᱰ","ᱟᱜᱟᱢ ᱯᱚᱱᱛᱷᱟ"],guide:"ᱥᱮᱣᱟ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: ᱥᱟᱯᱷᱟ-ᱥᱟᱯᱷᱤ ᱡᱟᱦᱟᱱ ᱞᱮᱠᱟ ᱢᱮ, ᱨᱤᱯᱳᱨᱴ ᱧᱮᱞ ᱢᱮ, ᱱᱚᱜᱚᱨ ᱱᱚᱠᱥᱟ ᱧᱮᱞ ᱢᱮ ᱟᱨ ᱵᱟᱝ ᱚᱯᱷᱤᱥᱟᱨ ᱰᱮᱥᱵᱳᱨᱰ ᱡᱷᱤᱡ ᱢᱮ᱾",help:"ᱯᱟᱹᱨᱥᱤ ᱜᱚᱲᱚ",listen:"ᱟᱧᱡᱚᱢ ᱢᱮ"},
  sd:{nav:["گھر","مسئلو داخل ڪريو","رپورٽ ڏسو","شهر جو نقشو","آفيسر ڊيش بورڊ","مستقبل جو منصوبو"],guide:"هڪ خدمت چونڊيو: صفائي جو مسئلو داخل ڪريو، رپورٽ جي حالت ڏسو، شهر جا اشارا ڏسو يا آفيسر ڊيش بورڊ کوليو۔",help:"ٻولي مدد",listen:"ٻڌو"},
  ta:{nav:["முகப்பு","பிரச்சினையைப் புகாரளி","அறிக்கையைப் பார்","நகர வரைபடம்","அலுவலர் பலகை","எதிர்காலத் திட்டம்"],guide:"ஒரு சேவையைத் தேர்ந்தெடுக்கவும்: தூய்மை பிரச்சினையைப் புகாரளிக்கவும், அறிக்கையின் நிலையைப் பார்க்கவும், நகர சமிக்ஞைகளைப் பார்க்கவும் அல்லது அலுவலர் பலகையைத் திறக்கவும்.",help:"மொழி உதவி",listen:"கேட்க"},
  te:{nav:["హోమ్","సమస్యను నివేదించండి","నివేదికను చూడండి","నగర పటం","అధికారి డ్యాష్‌బోర్డ్","భవిష్యత్ ప్రణాళిక"],guide:"ఒక సేవను ఎంచుకోండి: పరిశుభ్రత సమస్యను నివేదించండి, నివేదిక స్థితిని చూడండి, నగర సంకేతాలను చూడండి లేదా అధికారి డ్యాష్‌బోర్డ్‌ను తెరవండి.",help:"భాషా సహాయం",listen:"వినండి"},
  ur:{nav:["مرکزی صفحہ","مسئلہ درج کریں","رپورٹ دیکھیں","شہر کا نقشہ","افسر ڈیش بورڈ","مستقبل کا منصوبہ"],guide:"ایک خدمت منتخب کریں: صفائی کا مسئلہ درج کریں، رپورٹ کی حالت دیکھیں، شہر کے اشارے دیکھیں یا افسر ڈیش بورڈ کھولیں۔",help:"زبان کی مدد",listen:"سنیں"},
};

function Header({ view, language, setLanguage, highContrast, setHighContrast, fontLevel, setFontLevel }: {
  view: PortalView;
  language: LanguageCode;
  setLanguage: (value: LanguageCode) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  fontLevel: number;
  setFontLevel: (value: number) => void;
}) {
  const translatedNav = languageCopy[language].nav;
  return <>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <div className="india-rule" aria-hidden="true"><i /><i /><i /></div>
    <div className="utility-bar">
      <div className="portal-shell utility-inner">
        <span><b>स्वच्छ नागरिक मंच</b> · Independent civic innovation prototype</span>
        <div className="access-tools">
          <span className="text-tools" aria-label="Text size controls">
            <button type="button" onClick={() => setFontLevel(Math.max(0, fontLevel - 1))} disabled={fontLevel === 0} aria-label="Decrease text size">A−</button>
            <button type="button" onClick={() => setFontLevel(1)} aria-label="Reset text size">A</button>
            <button type="button" onClick={() => setFontLevel(Math.min(3, fontLevel + 1))} disabled={fontLevel === 3} aria-label="Increase text size">A+</button>
          </span>
          <button type="button" onClick={() => setHighContrast(!highContrast)} aria-pressed={highContrast}>◐ Contrast</button>
          <label className="language-select"><span>文</span><select aria-label="Choose interface language" value={language} onChange={event => setLanguage(event.target.value as LanguageCode)}>{languages.map(item => <option value={item.code} key={item.code}>{item.name} · {item.english}</option>)}</select></label>
          <span className="utility-date">25 August 2026</span>
        </div>
      </div>
    </div>
    <header className="portal-header">
      <div className="portal-shell identity-row">
        <a className="portal-brand" href="/" aria-label="SwachhNexus home">
          <span className="portal-symbol">स</span>
          <span><b>SwachhNexus</b><small>स्वच्छ नेक्सस · Signal → action → proof</small></span>
        </a>
        <div className="header-search"><span>⌕</span><input aria-label="Search this prototype" placeholder="Search services, report ID or help" /><kbd>⌘ K</kbd></div>
        <div className="prototype-seal"><span>✓</span><div><b>TRANSPARENT DEMO</b><small>No official government connection</small></div></div>
      </div>
      <nav className="service-nav" aria-label="Portal sections">
        <div className="portal-shell nav-inner">
          {navItems.map(([key, , href], index) => <a className={view === key ? "active" : ""} href={href} key={key}>{translatedNav[index]}</a>)}
          <span className="city-online"><i /> Indore demo online</span>
        </div>
      </nav>
    </header>
  </>;
}

function LanguageAssist({ language }: { language: LanguageCode }) {
  const meta = languages.find(item => item.code === language) ?? languages[0];
  const content = languageCopy[language];
  function speakGuide() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(content.guide);
    utterance.lang = language;
    window.speechSynthesis.speak(utterance);
  }
  return <aside className="language-assist" dir={meta.dir ?? "ltr"} aria-live="polite">
    <div className="portal-shell language-assist-inner">
      <div className="language-badge"><i>文</i><span><b>{content.help}</b><small>{meta.name} · {meta.english}</small></span></div>
      <p>{content.guide}</p>
      <button type="button" onClick={speakGuide}>◉ {content.listen}</button>
      <span className="language-count">22 scheduled Indian languages + English</span>
    </div>
  </aside>;
}

function Breadcrumb({ view }: { view: PortalView }) {
  if (view === "home") return null;
  const label = navItems.find(([key]) => key === view)?.[1];
  return <div className="breadcrumb"><div className="portal-shell"><a href="/">Home</a><span>›</span><b>{label}</b></div></div>;
}

function PageBanner({ eyebrow, title, text, action }: { eyebrow: string; title: string; text: string; action?: React.ReactNode }) {
  return <section className="page-banner"><div className="portal-shell page-banner-inner"><div><span>{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>{action}</div></section>;
}

function HomeView() {
  const [cityOpen, setCityOpen] = useState("Indore");
  const [lookup, setLookup] = useState("");
  return <>
    <section className="home-hero">
      <div className="portal-shell home-hero-grid">
        <div className="hero-message">
          <span className="hero-label">AI-ASSISTED CIVIC RESPONSE · DEMO CITY: INDORE</span>
          <h1>Cleaner streets start with one clear signal.</h1>
          <p>Report a cleanliness issue, follow the city response, and verify the work—with every step visible.</p>
          <div className="hero-buttons"><a className="portal-button saffron" href="/report">Report an issue <span>→</span></a><a className="portal-button ghost" href="/track">Track my report</a></div>
          <div className="hero-assurance"><span>✓ No login required</span><span>✓ Consent-first location</span><span>✓ 22 Indian languages</span></div>
        </div>
        <div className="hero-command" aria-label="Illustrative city response preview">
          <div className="command-top"><span><i /> CITY OPERATIONS · LIVE DEMO</span><b>25 AUG · 10:42</b></div>
          <div className="command-map">
            <span className="route route-a" /><span className="route route-b" /><span className="route route-c" />
            <button className="command-pin pin-critical" aria-label="Critical signal"><i>!</i></button>
            <button className="command-pin pin-high" aria-label="High signal"><i>2</i></button>
            <button className="command-pin pin-medium" aria-label="Medium signal"><i>3</i></button>
            <div className="map-label ml-a">Rajwada</div><div className="map-label ml-b">Snehlataganj</div>
            <div className="command-card"><span>SRV-101 · CRITICAL</span><b>Clogged drain</b><small>Ward 12 · Team en route</small><div><i /><i /><i className="pending" /><i className="pending" /></div></div>
          </div>
          <div className="command-stats"><div><b>18</b><span>Active signals</span></div><div><b>72%</b><span>Acknowledged</span></div><div><b>3.2h</b><span>Median response</span></div></div>
        </div>
      </div>
    </section>

    <div className="notice-ticker"><div className="portal-shell"><b>● LIVE DEMO UPDATE</b><span>Ward 12 sanitation team acknowledged SRV-101</span><i>•</i><span>Rajwada report supported by 14 citizens</span><a href="/map">View city map →</a></div></div>

    <main id="main-content">
      <section className="portal-shell service-hub">
        <div className="section-heading split"><div><span>CITIZEN SERVICES</span><h2>What would you like to do?</h2></div><p>Simple digital services organised around a citizen’s task—not a department name.</p></div>
        <div className="service-card-grid">
          <a href="/report"><i className="service-icon orange">＋</i><span><b>Report an issue</b><small>Photo, description and location</small></span><em>Start →</em></a>
          <a href="/track"><i className="service-icon blue">⌕</i><span><b>Track a report</b><small>Status, route and resolution proof</small></span><em>Check →</em></a>
          <a href="/map"><i className="service-icon green">⌖</i><span><b>Explore city signals</b><small>Filter reports on the live demo map</small></span><em>Open →</em></a>
          <a href="/dashboard"><i className="service-icon purple">▦</i><span><b>Officer dashboard</b><small>Priority queue and ward intelligence</small></span><em>View →</em></a>
        </div>
      </section>

      <section className="portal-shell pulse-grid">
        <div className="status-lookup panel">
          <span className="panel-tag">QUICK STATUS</span><h2>Already submitted a report?</h2><p>Enter a reference number to see the latest public status.</p>
          <label htmlFor="home-lookup">Report reference number</label><div className="inline-search"><input id="home-lookup" value={lookup} onChange={(e) => setLookup(e.target.value)} placeholder="Try SRV-092" /><a className={!lookup ? "disabled" : ""} href={`/track${lookup ? `?ref=${encodeURIComponent(lookup)}` : ""}`}>Check status</a></div>
          <small>Demo reference: SRV-092 · No phone number or OTP required</small>
        </div>
        <div className="city-index panel">
          <div className="panel-title"><div><span className="panel-tag">CITY SIGNAL INDEX</span><h2>Where citizens are speaking up</h2></div><a href="/map">Full map →</a></div>
          {[{city:"Indore", count:18, places:"Rajwada · Snehlataganj · Juni Indore"},{city:"Mumbai",count:12,places:"Andheri · Bandra · Dadar"},{city:"Delhi",count:9,places:"Karol Bagh · Rohini · Saket"}].map((row, index) => <button className={cityOpen === row.city ? "open" : ""} onClick={() => setCityOpen(cityOpen === row.city ? "" : row.city)} key={row.city}><i>#{index + 1}</i><span><b>{row.city}</b><small>{cityOpen === row.city ? row.places : "View area breakdown"}</small></span><strong>{row.count}<small>signals</small></strong><em>{cityOpen === row.city ? "−" : "+"}</em></button>)}
        </div>
      </section>

      <section className="trust-band"><div className="portal-shell"><div><span>HOW IT WORKS</span><h2>One accountable loop</h2></div>{[["01","Citizen signal","A photo, clear description and confirmed location"],["02","Suggested triage","Category, urgency and duplicate check"],["03","Human action","A ward team owns the final decision"],["04","Public proof","Evidence and citizen feedback close the loop"]].map(([n,t,d]) => <article key={n}><i>{n}</i><b>{t}</b><small>{d}</small></article>)}</div></section>
    </main>
  </>;
}

function ReportView() {
  const [step, setStep] = useState(1);
  const [issueCategory, setIssueCategory] = useState("");
  const [customIssue, setCustomIssue] = useState("");
  const [description, setDescription] = useState("");
  const [locality, setLocality] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [photo, setPhoto] = useState("");
  const [coords, setCoords] = useState<{lat:string;lng:string}|null>(null);
  const [locationNote, setLocationNote] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [cityActive, setCityActive] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const selectedIssue = issueCategory === "Other" ? customIssue.trim() : issueCategory;
  const canDescribe = Boolean(selectedIssue) && (issueCategory !== "Other" || customIssue.trim().length >= 3);
  const canContinue = canDescribe && Boolean(locality.trim() && stateName && city.trim());
  const selectedState = indiaLocations.find(state => state.name === stateName);
  const availableCities = useMemo(() => selectedState?.cities ?? [], [selectedState]);
  const cityMatches = useMemo(() => {
    const query = city.trim().toLocaleLowerCase("en-IN");
    if (!query) return availableCities.slice(0, 60);
    const starts: string[] = [];
    const contains: string[] = [];
    availableCities.forEach(place => {
      const normalized = place.toLocaleLowerCase("en-IN");
      if (normalized.startsWith(query)) starts.push(place);
      else if (normalized.includes(query)) contains.push(place);
    });
    return [...starts, ...contains].slice(0, 60);
  }, [availableCities, city]);
  const exactCityMatch = availableCities.some(place => place.localeCompare(city.trim(), "en-IN", {sensitivity:"base"}) === 0);

  function sample() { setIssueCategory("Overflowing garbage or bin"); setDescription("Garbage is overflowing beside the school gate and blocking the footpath."); setLocality("Rajwada, near the school gate"); setStateName("Madhya Pradesh"); setCity("Indore"); setCoords({lat:"22.719600",lng:"75.857700"}); setPhoto("safe-demo-street-photo.jpg"); setSocialUrl("https://social.example/post/swachhnexus-demo"); }
  function locate() {
    if (!navigator.geolocation) { setLocationNote("Location is not available in this browser. Enter the landmark manually."); return; }
    setLocationNote("Waiting for your browser permission…");
    navigator.geolocation.getCurrentPosition(p => { setCoords({lat:p.coords.latitude.toFixed(6),lng:p.coords.longitude.toFixed(6)}); setLocationNote("Location captured with your consent."); }, () => setLocationNote("Location was not shared. You can continue with the landmark."), {timeout:10000, maximumAge:60000});
  }
  function choosePhoto(e: ChangeEvent<HTMLInputElement>) { const file = e.target.files?.[0]; if (file) setPhoto(file.name); }
  function chooseCity(place: string) { setCity(place); setCityOpen(false); setCityActive(0); }
  function handleCityKeys(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") { setCityOpen(false); return; }
    if (event.key === "ArrowDown") { event.preventDefault(); setCityOpen(true); setCityActive(current => Math.min(current + 1, Math.max(cityMatches.length - 1, 0))); }
    if (event.key === "ArrowUp") { event.preventDefault(); setCityActive(current => Math.max(current - 1, 0)); }
    if (event.key === "Enter" && cityOpen && cityMatches[cityActive]) { event.preventDefault(); chooseCity(cityMatches[cityActive]); }
  }

  return <main id="main-content" className="report-page">
    <PageBanner eyebrow="CITIZEN SERVICE · FORM SNX-01" title="Report a cleanliness issue" text="Send a useful civic signal in three guided steps. Nothing is sent to a real authority in this prototype." action={<div className="report-banner-action"><div className="coverage-orbit"><i>36</i><span><b>States & UTs</b><small>{INDIA_CITY_COUNT.toLocaleString("en-IN")} searchable places</small></span></div><button className="portal-button light" type="button" onClick={sample}>✦ Fill safe demo</button></div>} />
    <div className="portal-shell page-layout">
      <aside className="process-sidebar">
        <span>SERVICE JOURNEY</span>
        {[{n:1,t:"Describe the issue",d:"Tell us what happened"},{n:2,t:"Evidence & location",d:"Add a photo and place"},{n:3,t:"Review & submit",d:"Confirm the suggested route"}].map(s => <button className={step === s.n ? "active" : step > s.n ? "done" : ""} onClick={() => step > s.n && setStep(s.n)} key={s.n}><i>{step > s.n ? "✓" : s.n}</i><span><b>{s.t}</b><small>{s.d}</small></span></button>)}
        <div className="help-box"><b>Need help?</b><p>Use simple words and a nearby landmark. Avoid names, phone numbers, faces and number plates.</p><a href="/future">How privacy works →</a></div>
      </aside>

      <section className="form-workspace panel">
        <div className="workspace-top"><div><span>STEP {step} OF 3</span><h2>{step === 1 ? "What happened?" : step === 2 ? "Add evidence and confirm the place" : submitted ? "Report created" : "Review the suggested civic route"}</h2></div><b>{Math.round(step / 3 * 100)}% complete</b></div>
        <div className="progress-line"><i style={{width:`${step / 3 * 100}%`}} /></div>

        {step === 1 && <div className="form-body">
          <fieldset className="issue-picker"><legend>Choose the problem type <b>*</b></legend><p>Pick a quick category for accurate tagging. If none fits, select <b>Other</b> and write your own.</p><div>{issueCategories.map(([name, help, icon]) => <button className={issueCategory === name ? "selected" : ""} type="button" aria-pressed={issueCategory === name} onClick={() => setIssueCategory(name)} key={name}><i>{icon}</i><span><b>{name}</b><small>{help}</small></span></button>)}</div></fieldset>
          {issueCategory === "Other" && <label className="field"><span>What type of problem is it? <b>*</b></span><input value={customIssue} maxLength={60} onChange={e => setCustomIssue(e.target.value)} placeholder="Type an issue category we missed" /><small>{customIssue.length}/60</small></label>}
          <label className="field"><span>Add more details <em>(optional)</em></span><textarea rows={5} maxLength={300} value={description} onChange={e => setDescription(e.target.value)} placeholder="Example: It is beside the school gate and blocks the footpath. Add anything that will help the response team find it." /><small>{description.length}/300 · Do not include personal information</small></label>
          <div className="social-source"><span>NEW · FUTURE CHANNEL</span><div><i>#</i><label><b>Public social post link (optional)</b><input value={socialUrl} onChange={e => setSocialUrl(e.target.value)} placeholder="Paste a public post shared with #SwachhNexus" /><small>Demo only. No social platform is contacted.</small></label></div></div>
        </div>}

        {step === 2 && <div className="form-body">
          <label className={`upload-zone ${photo ? "ready" : ""}`}><input type="file" accept="image/png,image/jpeg" onChange={choosePhoto} /><i>{photo ? "✓" : "＋"}</i><span><b>{photo || "Add a clear street photo"}</b><small>{photo ? "Local preview ready · not uploaded" : "JPG or PNG · avoid people and number plates"}</small></span><em>{photo ? "Change" : "Choose photo"}</em></label>
          <section className="india-location-panel" aria-labelledby="india-location-title">
            <div className="india-coverage-note"><i>भारत</i><span><b id="india-location-title">Nationwide location directory</b><small>All 28 states and 8 Union Territories · {INDIA_CITY_COUNT.toLocaleString("en-IN")} searchable city, town and urban-locality records</small></span><em>DIRECTORY READY</em></div>
            <div className="field-pair location-fields">
              <label className="field"><span>State or Union Territory <b>*</b></span><select autoComplete="address-level1" value={stateName} onChange={e => {setStateName(e.target.value);setCity("");setCityOpen(false);setCityActive(0);}}><option value="">Choose from all 36 state/UT entries</option>{indiaLocations.map(state => <option value={state.name} key={state.code}>{state.name}</option>)}</select><small>{stateName ? `${availableCities.length.toLocaleString("en-IN")} directory places available` : "Complete national list"}</small></label>
              <label className="field city-field"><span>City, town or urban locality <b>*</b></span><div className="city-combobox"><i aria-hidden="true">⌕</i><input autoComplete="address-level2" role="combobox" aria-autocomplete="list" aria-expanded={cityOpen} aria-controls="india-city-options" aria-activedescendant={cityOpen && cityMatches[cityActive] ? `city-option-${cityActive}` : undefined} value={city} disabled={!stateName} onFocus={() => stateName && setCityOpen(true)} onBlur={() => window.setTimeout(() => setCityOpen(false), 120)} onKeyDown={handleCityKeys} onChange={e => {setCity(e.target.value);setCityOpen(true);setCityActive(0);}} placeholder={stateName ? `Search ${availableCities.length.toLocaleString("en-IN")} places in ${stateName}` : "Choose a state or UT first"} />
                {cityOpen && stateName && <div className="city-results" id="india-city-options" role="listbox" aria-label={`Places in ${stateName}`}>
                  <div className="city-results-head"><span>{city.trim() ? `${cityMatches.length} best matches` : `Popular alphabetical results`}</span><b>Type to search all {availableCities.length.toLocaleString("en-IN")}</b></div>
                  {cityMatches.map((place, index) => <button id={`city-option-${index}`} type="button" role="option" aria-selected={index === cityActive} className={index === cityActive ? "active" : ""} onMouseDown={event => event.preventDefault()} onMouseEnter={() => setCityActive(index)} onClick={() => chooseCity(place)} key={`${stateName}-${place}`}><i>⌖</i><span>{place}</span><small>{stateName}</small></button>)}
                  {!cityMatches.length && <div className="city-no-match"><i>＋</i><span><b>No directory match</b><small>Keep “{city}” as a manual place entry and add a precise landmark below.</small></span></div>}
                </div>}
              </div><small className={exactCityMatch ? "city-directory-status matched" : "city-directory-status"}>{exactCityMatch ? "✓ Matched to the India location directory" : city.trim() ? "Manual entries are accepted when a small locality is not listed" : "Search the full directory or type your place manually"}</small></label>
            </div>
          </section>
          <label className="field"><span>Street, landmark or locality <b>*</b></span><div className="icon-input"><i>⌖</i><input autoComplete="street-address" value={locality} onChange={e => setLocality(e.target.value)} placeholder="Example: Rajwada, near the school gate" /></div></label>
          <div className="location-consent"><button type="button" onClick={locate}>◎ Use my current location</button><div><b>{coords ? `${coords.lat}, ${coords.lng}` : "Location is optional"}</b><small>{locationNote || "Your browser will ask before sharing."}</small>{coords && <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}>Review pin in Google Maps ↗</a>}</div></div>
          <div className="mini-location-map"><span className="mini-road a"/><span className="mini-road b"/><i>⌖</i><b>{coords ? "Pin ready for citizen review" : "Map preview appears after location consent"}</b></div>
        </div>}

        {step === 3 && !submitted && <div className="form-body review-grid">
          <div className="ai-review"><div><span>✦ SIMULATED AI REVIEW</span><b>Human confirmation required</b></div><dl><div><dt>Selected category</dt><dd>{selectedIssue}</dd></div><div><dt>Suggested urgency</dt><dd className="high-text">High</dd></div><div><dt>Suggested route</dt><dd>{stateName} civic sanitation desk</dd></div><div><dt>Location confidence</dt><dd>{coords ? "GPS + landmark" : "Landmark confirmed"}</dd></div></dl></div>
          <div className="duplicate-alert"><i>!</i><div><b>A similar active report is 20 metres away</b><p>SRV-102 · Waste dumping · 14 citizen supporters</p><small>Supporting it helps the ward team see demand without duplicate work.</small></div><button>Support existing</button></div>
          <div className="review-summary"><div><span>YOUR REPORT · {selectedIssue}</span><b>{description || "No extra details added"}</b><small>⌖ {locality}, {city}, {stateName}</small></div><button type="button" onClick={() => setStep(1)}>Edit details</button></div>
        </div>}

        {submitted && <div className="success-receipt" role="status"><i>✓</i><span>REPORT REFERENCE</span><h2>SNX-260825-1042</h2><p>Your simulated report has been created and routed to Ward 18 Sanitation.</p><div><a className="portal-button dark" href="/track?ref=SNX-260825-1042">Open tracking timeline →</a><button type="button" onClick={() => {setSubmitted(false);setStep(1);}}>Create another</button></div><small>Save the reference number. No login or OTP is required in this demo.</small></div>}

        {!submitted && <div className="form-actions"><button type="button" className="back-button" disabled={step === 1} onClick={() => setStep(step - 1)}>← Back</button>{step < 3 ? <button type="button" className="portal-button dark" disabled={step === 1 ? !canDescribe : !canContinue} onClick={() => setStep(step + 1)}>Save & continue →</button> : <button type="button" className="portal-button saffron" onClick={() => setSubmitted(true)}>Confirm & create report →</button>}</div>}
      </section>
    </div>
  </main>;
}

function TrackView() {
  const [reference, setReference] = useState("SRV-092");
  const [searched, setSearched] = useState(true);
  const [compare, setCompare] = useState(50);
  const [feedback, setFeedback] = useState("");
  return <main id="main-content">
    <PageBanner eyebrow="PUBLIC STATUS SERVICE" title="Track and verify a report" text="See where a report was routed, how its status changed, and the evidence used to close it." />
    <section className="portal-shell track-page">
      <div className="track-search panel"><label htmlFor="track-ref">Report reference number</label><div><input id="track-ref" value={reference} onChange={e => setReference(e.target.value)} placeholder="Example: SRV-092" /><button onClick={() => setSearched(Boolean(reference.trim()))}>Check status →</button></div><small>Try SRV-092 · No login, phone number or OTP required</small></div>
      {searched && <>
        <div className="track-summary panel"><div className="reference-head"><div><span>REPORT REFERENCE</span><h2>{reference.toUpperCase()}</h2></div><b>✓ RESOLVED</b></div><div className="ticket-overview"><div><span>Issue</span><b>Public toilet maintenance</b><small>Sarwate Bus Stand, Indore</small></div><div><span>Responsible team</span><b>Ward 08 Sanitation</b><small>Demo routing only</small></div><div><span>Reported</span><b>25 Aug · 08:32</b><small>Resolved in 3h 44m</small></div></div>
          <div className="status-timeline">{[["Reported","08:32","Citizen signal received"],["Assigned","08:41","Routed to Ward 08"],["In progress","09:18","Team reached location"],["Resolved","12:16","Evidence verified"]].map(([s,time,d],i) => <article key={s}><i>✓</i><div><b>{s}</b><span>25 Aug · {time}</span><small>{d}</small></div>{i < 3 && <em />}</article>)}</div></div>
        <div className="proof-card panel"><div className="proof-heading"><div><span>RESOLUTION EVIDENCE</span><h2>Proof closes the loop.</h2><p>Move the slider to compare the reported scene with the resolution evidence.</p></div><b>✓ Verified by ward supervisor</b></div><div className="compare-stage"><div className="photo-scene after-scene"><img src="/evidence-after.jpg" alt="Clean public footpath after waste removal"/><span>RESOLVED · 12:16</span></div><div className="photo-scene before-scene" style={{clipPath:`inset(0 ${100-compare}% 0 0)`}}><img src="/evidence-before.jpg" alt="Overflowing waste blocking a public footpath before cleanup"/><span>REPORTED · 08:32</span></div><div className="compare-line" style={{left:`${compare}%`}}><i>↔</i></div><input aria-label="Compare reported and resolved photos" type="range" min="4" max="96" value={compare} onChange={e => setCompare(Number(e.target.value))} /></div><p className="proof-disclaimer">Demo evidence · AI-generated matched photographs · no real citizen or location data</p><div className="citizen-feedback"><b>Does the evidence show the issue is resolved?</b><div><button className={feedback === "yes" ? "active" : ""} onClick={() => setFeedback("yes")}>✓ Yes, resolved</button><button className={feedback === "review" ? "active warning" : ""} onClick={() => setFeedback("review")}>↻ Request review</button></div>{feedback && <p role="status">✓ {feedback === "yes" ? "Citizen confirmation recorded in the demo." : "Review request added to the simulated queue."}</p>}</div></div>
      </>}
    </section>
  </main>;
}

function MapView() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Ticket>(tickets[1]);
  const filtered = filter === "All" ? tickets : tickets.filter(t => t.status === filter);
  return <main id="main-content" className="map-page">
    <PageBanner eyebrow="CITY SIGNAL MAP · SIMULATED" title="Every signal has a place." text="Explore synthetic cleanliness reports around Indore. Select a marker or filter the public queue." action={<div className="map-legend"><span><i className="critical-bg"/>Critical</span><span><i className="high-bg"/>High</span><span><i className="medium-bg"/>Medium</span></div>} />
    <section className="map-app">
      <aside className="map-sidebar">
        <div className="map-filter">{["All","Reported","Assigned","In progress","Resolved"].map(x => <button className={filter === x ? "active" : ""} onClick={() => setFilter(x)} key={x}>{x}{x === "All" && <b>{tickets.length}</b>}</button>)}</div>
        <div className="map-list">{filtered.map(t => <button className={selected.id === t.id ? "active" : ""} onClick={() => setSelected(t)} key={t.id}><i className={`${t.severity.toLowerCase()}-bg`}/><span><small>{t.id} · {t.age}</small><b>{t.issue}</b><em>⌖ {t.place}</em></span><strong>{t.status}</strong></button>)}</div>
      </aside>
      <div className="large-civic-map" aria-label="Interactive illustrative Indore cleanliness map">
        <span className="grid-road gr-a"/><span className="grid-road gr-b"/><span className="grid-road gr-c"/><span className="grid-road gr-d"/>
        <span className="neighbourhood nh-a">RAJWADA</span><span className="neighbourhood nh-b">SNEHLATAGANJ</span><span className="neighbourhood nh-c">SARWATE</span><span className="neighbourhood nh-d">VIJAY NAGAR</span>
        {tickets.slice(0,6).map((t,i) => <button aria-label={`${t.severity} report ${t.id}`} className={`large-map-pin lmp-${i} ${t.severity.toLowerCase()}-bg ${selected.id === t.id ? "selected" : ""}`} onClick={() => setSelected(t)} key={t.id}><i>{t.support}</i></button>)}
        <div className="map-detail"><div><span className={`${selected.severity.toLowerCase()}-text`}>{selected.severity.toUpperCase()} · {selected.id}</span><button aria-label="Close report details">×</button></div><h3>{selected.issue}</h3><p>⌖ {selected.place}, Indore</p><dl><div><dt>Ward</dt><dd>{selected.ward}</dd></div><div><dt>Status</dt><dd>{selected.status}</dd></div><div><dt>Citizen support</dt><dd>{selected.support}</dd></div></dl><a href={`/track?ref=${selected.id}`}>Open public timeline →</a></div>
        <div className="map-controls"><button>＋</button><button>−</button><button>◎</button></div><div className="map-north">N<br/>↑</div>
      </div>
    </section>
  </main>;
}

function DashboardView() {
  const [queue, setQueue] = useState(tickets.slice(0,6));
  const [severity, setSeverity] = useState("All priorities");
  const [selected, setSelected] = useState(queue[0]);
  const shown = severity === "All priorities" ? queue : queue.filter(t => t.severity === severity);
  const advance = (id:string) => {
    const order:TicketStatus[] = ["Reported","Assigned","In progress","Resolved"];
    setQueue(current => current.map(t => t.id === id ? {...t,status:order[Math.min(order.indexOf(t.status)+1,3)]} : t));
    setSelected(current => current.id === id ? {...current,status:order[Math.min(order.indexOf(current.status)+1,3)]} : current);
  };
  return <main id="main-content" className="dashboard-page">
    <PageBanner eyebrow="WARD OPERATIONS · AUTHORISED DEMO VIEW" title="Act on severity, not chronology." text="A decision workspace for ward teams, with suggested priority, ownership and resolution evidence." action={<button className="portal-button light">Export daily brief ↗</button>} />
    <section className="portal-shell dashboard-content">
      <div className="metric-grid">{[["Open queue","6","Across demo wards","inbox"],["Critical","2","Rapid review","alert"],["Resolved today","12","Evidence attached","check"],["Median response","3.2h","Illustrative metric","clock"]].map(([l,v,d,c]) => <article className={c} key={l}><div><span>{l}</span><b>{v}</b><small>{d}</small></div><i>{c === "inbox" ? "▣" : c === "alert" ? "!" : c === "check" ? "✓" : "◷"}</i></article>)}</div>
      <div className="dashboard-grid">
        <section className="queue-panel panel">
          <div className="queue-toolbar"><div><span>AI-PRIORITISED RESPONSE QUEUE</span><h2>Open civic signals</h2></div><div><select value={severity} onChange={e => setSeverity(e.target.value)}><option>All priorities</option><option>Critical</option><option>High</option><option>Medium</option></select><button>⌕</button></div></div>
          <div className="queue-columns"><span>Signal</span><span>Location & route</span><span>Status</span><span>Action</span></div>
          <div className="dashboard-queue">{shown.map(t => <article className={selected.id === t.id ? "selected" : ""} onClick={() => setSelected(t)} key={t.id}><div><i className={`${t.severity.toLowerCase()}-bg`}/><span><small>{t.id} · {t.age}</small><b>{t.issue}</b><em className={`${t.severity.toLowerCase()}-text`}>{t.severity}</em></span></div><div><b>{t.place}</b><small>{t.ward} · Sanitation team</small></div><span className={`queue-status ${t.status.toLowerCase().replace(" ","-")}`}>{t.status}</span><button onClick={e => {e.stopPropagation();advance(t.id);}} disabled={t.status === "Resolved"}>{t.status === "Resolved" ? "Complete" : "Advance →"}</button></article>)}</div>
        </section>
        <aside className="ticket-inspector panel">
          <div className="inspector-head"><span>SELECTED SIGNAL</span><b className={`${selected.severity.toLowerCase()}-text`}>{selected.severity}</b></div><h2>{selected.id}</h2><p>{selected.issue}</p><div className="inspector-map"><span/><i>⌖</i><b>{selected.place}</b></div><dl><div><dt>Suggested owner</dt><dd>Sanitation team · {selected.ward}</dd></div><div><dt>Citizen support</dt><dd>{selected.support} people</dd></div><div><dt>Duplicate confidence</dt><dd>87% · human review</dd></div></dl><button className="portal-button dark" onClick={() => advance(selected.id)} disabled={selected.status === "Resolved"}>{selected.status === "Resolved" ? "Resolution complete" : `Move from ${selected.status} →`}</button><small>AI suggests. A ward officer remains responsible for every action.</small>
        </aside>
      </div>
      <div className="insight-grid">
        <article className="prediction panel"><div><span>PREDICTIVE SIGNAL · ILLUSTRATIVE</span><h2>Where should the city act next?</h2><p>Ward 12 shows repeated drain-related signals after rainfall. Preventive cleaning could reduce predicted complaints next week.</p><a href="/map">Inspect Ward 12 on map →</a></div><div className="risk-ring"><b>78</b><span>RISK<br/>SCORE</span></div></article>
        <article className="weekly-chart panel"><div><span>7-DAY SIGNAL VOLUME</span><b>+18% <small>vs previous week</small></b></div><div className="bars">{[44,63,48,76,58,88,70].map((h,i) => <i style={{height:`${h}%`}} key={i}><span>{["M","T","W","T","F","S","S"][i]}</span></i>)}</div></article>
        <article className="sla-panel panel"><span>WARD RESPONSE HEALTH</span><h2>72%</h2><p>Signals acknowledged within the illustrative service window.</p><div><i style={{width:"72%"}}/></div><small>Target marker · 85%</small></article>
      </div>
    </section>
  </main>;
}

function FutureView() {
  const [post, setPost] = useState("");
  const [preview, setPreview] = useState(false);
  return <main id="main-content">
    <PageBanner eyebrow="FUTURE LAB · SAFE INTEGRATION ROADMAP" title="Meet citizens where they already speak." text="A consent-based path from a public social post to a confirmed, routable civic signal—without pretending an unapproved API is live." />
    <section className="portal-shell future-page">
      <div className="future-simulator panel"><div><span>INTERACTIVE CONCEPT DEMO</span><h2>Try the hashtag-to-report journey</h2><p>Paste any example URL. The prototype generates a safe preview locally and contacts no platform.</p><label>Public post URL<div><i>#</i><input value={post} onChange={e => {setPost(e.target.value);setPreview(false);}} placeholder="https://social.example/post/clean-indore"/><button onClick={() => setPreview(Boolean(post.trim()))}>Create preview →</button></div></label>{preview && <div className="post-preview" role="status"><i>✓</i><div><span>PUBLIC SIGNAL FOUND · DEMO</span><b>Possible overflowing waste</b><p>Photo available · location not confirmed · citizen consent required</p></div><a href="/report">Confirm as citizen →</a></div>}</div></div>
      <div className="future-principles"><article><i>01</i><span>SOCIAL SIGNALS</span><h3>Opted-in hashtags</h3><p>Approved platform APIs could identify public posts using #SwachhNexus or a city campaign tag.</p><b>Planned · not connected</b></article><article><i>02</i><span>LOCATION INTELLIGENCE</span><h3>Pin before routing</h3><p>Device coordinates or a Google Maps link can suggest a locality and ward for citizen review.</p><b className="ready">Device GPS works now</b></article><article><i>03</i><span>OFFICIAL HANDOFF</span><h3>Approved civic APIs</h3><p>A confirmed report can route only through a public authority API or an approved municipal sandbox.</p><b>Partnership required</b></article></div>
      <div className="flow-architecture panel"><div><span>PROPOSED WORKFLOW</span><h2>Consent is the bridge—not the hashtag.</h2></div><div className="architecture-steps">{[["1","Public post","Photo + opted-in tag"],["2","Consent link","Citizen confirms intent"],["3","Location review","Pin + landmark"],["4","AI suggestion","Category + duplicate"],["5","Official route","Approved API"],["6","Public proof","Status + evidence"]].map(([n,t,d]) => <article key={n}><i>{n}</i><b>{t}</b><small>{d}</small></article>)}</div><p><b>Safety rule:</b> a public post never creates a government complaint by itself. The citizen confirms intent and location; spam controls and human review remain in the loop.</p></div>
      <div className="roadmap panel"><div><span>DELIVERY ROADMAP</span><h2>Prototype → pilot → city platform</h2></div><div>{[["NOW","Hackathon prototype","Citizen journey, tracking, officer queue, GPS and transparent mocks"],["NEXT","Controlled pilot","One ward, approved sandbox, consent links and measurable service levels"],["LATER","Interoperable city layer","Multiple civic channels, official APIs and open accountability metrics"]].map(([tag,title,text],i) => <article className={i===0?"active":""} key={tag}><i>{i+1}</i><span>{tag}</span><b>{title}</b><p>{text}</p></article>)}</div></div>
    </section>
  </main>;
}

function Footer() {
  return <footer className="portal-footer"><div className="portal-shell footer-main"><div className="portal-brand footer-brand"><span className="portal-symbol">स</span><span><b>SwachhNexus</b><small>Cleaner streets. Clearer accountability.</small></span></div><div><b>Citizen services</b><a href="/report">Report an issue</a><a href="/track">Track a report</a><a href="/map">City signal map</a></div><div><b>Operations</b><a href="/dashboard">Officer dashboard</a><a href="/future">Future integrations</a><span>Demo city: Indore</span></div><div><b>Prototype standards</b><span>Accessible by design</span><span>Consent before location</span><span>Human decision-making</span></div></div><div className="portal-shell footer-note"><span>Independent prototype for Build What Moves India 2026 · Built with Codex</span><span>All data and authority actions are simulated</span></div></footer>;
}

export default function PortalPage({ view }: { view: PortalView }) {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [highContrast, setHighContrast] = useState(false);
  const [fontLevel, setFontLevel] = useState(1);
  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("snx-language") as LanguageCode | null;
    const savedFont = Number(window.localStorage.getItem("snx-font-level"));
    if (savedLanguage && languages.some(item => item.code === savedLanguage)) setLanguage(savedLanguage);
    if (Number.isInteger(savedFont) && savedFont >= 0 && savedFont <= 3) setFontLevel(savedFont);
  }, []);
  useEffect(() => {
    const sizes = [90, 100, 112.5, 125];
    document.documentElement.style.fontSize = `${sizes[fontLevel]}%`;
    window.localStorage.setItem("snx-font-level", String(fontLevel));
  }, [fontLevel]);
  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("snx-language", language);
  }, [language]);
  const className = useMemo(() => ["portal", highContrast && "high-contrast"].filter(Boolean).join(" "), [highContrast]);
  return <div className={className}>
    <Header view={view} language={language} setLanguage={setLanguage} highContrast={highContrast} setHighContrast={setHighContrast} fontLevel={fontLevel} setFontLevel={setFontLevel} />
    <Breadcrumb view={view} />
    <LanguageAssist language={language} />
    {view === "home" && <HomeView />}
    {view === "report" && <ReportView />}
    {view === "track" && <TrackView />}
    {view === "map" && <MapView />}
    {view === "dashboard" && <DashboardView />}
    {view === "future" && <FutureView />}
    <Footer />
  </div>;
}
