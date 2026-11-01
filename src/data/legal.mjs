/**
 * Legal pages: Privacy Policy, Booking Terms and Cookie Policy (owner checklist, 1 November 2026).
 * Plain data so it can move to a CMS later. `legal(site)` fills in the brand name, email and business
 * address. The Cookie Policy matches the site: no cookies, no browser storage, no analytics.
 */
const UPDATED = '2026-11-01';

function legal({ brand, email, address }) {
  const addr = address.join(', ');
  const mail = `<a href="mailto:${email}">${email}</a>`;
  return [
    {
      "slug": "privacy",
      "title": "Privacy Policy",
      "lede": `How ${brand} collects, uses and protects your personal data when you visit this website, send us an enquiry or book a trip.`,
      "updated": UPDATED,
      "sections": [
        {
          "h": "Who we are",
          "p": [
            `${brand} plans and arranges tailor-made trips. We are the controller of the personal data described in this policy.`,
            `Address: ${addr}`,
            `<p>Email: ${mail}</p>`
          ]
        },
        {
          "h": "What data we collect",
          "p": [
            "<ul><li>Enquiry details: what you enter in our enquiry form or send us by email, such as your name, email address, travel dates, number of travellers, interests, budget and your message.</li><li>Booking details: when you book, what we need to arrange your trip, such as the full names of travellers as shown in their passports, dates of birth, nationality, arrival and departure details, dietary requirements and, only if you choose to share them, health or mobility needs.</li><li>Correspondence: the emails and messages you exchange with us.</li><li>Technical data: when you visit the site, our hosting provider automatically records server logs with your IP address, browser type, the pages requested and the date and time. They are used only to run the site securely and to fix errors.</li><li>Browser storage: the small items described in our cookie policy.</li></ul>",
            "We do not collect payment card details through this website, and the site uses no analytics or advertising trackers."
          ]
        },
        {
          "h": "Why we use it and our legal bases",
          "p": [
            "<ul><li>To answer your enquiry and prepare a proposal: steps taken at your request before entering into a contract, and our legitimate interest in replying to people who contact us.</li><li>To book and run your trip, including passing the necessary details to the suppliers who deliver it: performance of our contract with you.</li><li>To take account of health or mobility information you choose to share: your explicit consent, which you can withdraw at any time.</li><li>To keep the site secure and working, and to handle complaints or legal claims: our legitimate interests.</li><li>To keep accounting and tax records: compliance with our legal obligations.</li><li>To send you news, only if you have asked for it: your consent, which you can withdraw at any time.</li></ul>",
            "We never sell your personal data, and we do not use it for automated decision-making or profiling."
          ]
        },
        {
          "h": "Who we share it with",
          "p": [
            "<ul><li>Vercel Inc., which hosts this website and processes the technical logs described above.</li><li>Our email provider, which stores and delivers the messages we exchange with you.</li><li>The travel suppliers who deliver your trip, such as hotels, lodges and camps, transport and transfer companies, airlines, activity providers and park or permit authorities. Each receives only what it needs for your booking.</li><li>Professional advisers, public authorities or courts, where the law requires it or to establish or defend legal claims.</li></ul>",
            "When you send the enquiry form, it opens your own email program with your message ready to send to us, so the form itself does not transmit your data to any third party.",
            "Our service providers act on our instructions and must keep your data secure and confidential."
          ]
        },
        {
          "h": "International transfers",
          "p": [
            "Vercel and some of our other providers may process data in the United States and other countries. Your trip takes place in Spain, so the suppliers there receive the details they need. Where data protection law requires it, we rely on adequacy decisions, standard contractual clauses or equivalent safeguards, or on the transfer being necessary to perform the contract you asked us for. You can ask us for details of these safeguards."
          ]
        },
        {
          "h": "How long we keep it",
          "p": [
            "<ul><li>Enquiries that do not lead to a booking: up to two years after our last contact.</li><li>Booking records: as long as tax and accounting law requires, usually up to seven years after your trip.</li><li>Health or mobility details: deleted once your trip is over, unless you ask us to keep them for a future trip.</li><li>Server logs: kept by our hosting provider for a short period, normally no more than 30 days.</li></ul>"
          ]
        },
        {
          "h": "How we protect it",
          "p": [
            "We keep personal data in access-controlled systems, use encrypted connections (HTTPS) on this site and share data only as described here. If a breach affects your data and puts your rights at risk, we will tell you without undue delay."
          ]
        },
        {
          "h": "Your rights",
          "p": [
            "Depending on where you live, you have the right to:",
            "<ul><li>access the personal data we hold about you;</li><li>have inaccurate data corrected (rectification);</li><li>have your data deleted (erasure);</li><li>restrict how we use your data (restriction);</li><li>receive your data in a portable format or have it sent to someone else (portability);</li><li>object to our use of your data based on legitimate interests, and to direct marketing at any time (objection);</li><li>withdraw your consent at any time, without affecting what we did before;</li><li>complain to a data protection supervisory authority, in particular in the country where you live or work.</li></ul>",
            "To exercise any of these rights, email us. We reply within one month.",
            `<p>Email: ${mail}</p>`
          ]
        },
        {
          "h": "Cookies",
          "p": [
            "This site uses only the browser storage described in our cookie policy.",
            "<p><a href=\"/cookies/\">Read our cookie policy</a></p>"
          ]
        },
        {
          "h": "Children",
          "p": [
            "This website is not aimed at children and we do not knowingly collect data from children under 16. We only process details of children travelling with their family when a parent or guardian gives them to us for a booking."
          ]
        },
        {
          "h": "Changes to this policy",
          "p": [
            "We may update this policy when our services or the law change. The date at the top shows when it was last updated."
          ]
        },
        {
          "h": "Contact",
          "p": [
            `Questions about this policy or your personal data: write to ${brand} at the address above, or email us.`,
            `<p>Email: ${mail}</p>`
          ]
        }
      ]
    },
    {
      "slug": "terms",
      "title": "Booking Terms",
      "lede": `The terms that apply when you book a trip with ${brand}. Please read them before you book: when you confirm a booking, you accept them.`,
      "updated": UPDATED,
      "sections": [
        {
          "h": "1. Who we are",
          "p": [
            `${brand} (“we”, “us”) plans and arranges tailor-made trips. These terms, together with your proposal and booking confirmation, form your contract with us.`,
            `Address: ${addr}`,
            `<p>Email: ${mail}</p>`
          ]
        },
        {
          "h": "2. How a booking is made and confirmed",
          "p": [
            "Every trip starts with an enquiry. We then send you a written proposal with the itinerary, the price and what is included. Prices on this website are “from” prices per person, given as a guide; your final price is the one confirmed in writing in your proposal.",
            "Your booking is made when you accept the proposal in writing and pay the deposit, and it is confirmed when we send you a written booking confirmation. The person who makes the booking must be at least 18 years old and accepts these terms on behalf of everyone travelling."
          ]
        },
        {
          "h": "3. Deposit, balance and prices",
          "p": [
            "A deposit, stated in your proposal, is due when you book. The balance is due on the date shown in your booking confirmation, normally 60 days before departure. If you book less than 60 days before departure, the full price is due when you book.",
            "If the balance is not paid on time, we may treat the booking as cancelled by you and apply the cancellation charges below.",
            "Once your booking is confirmed we will not increase the price, except where taxes, park or entry fees or fuel costs imposed by third parties change. We will tell you as soon as possible and show how the change was calculated. If the increase is more than 8% of the trip price, you may cancel and receive a full refund."
          ]
        },
        {
          "h": "4. What is included",
          "p": [
            "Your proposal and booking confirmation list exactly what is included, typically the accommodation, transport, transfers and activities in your itinerary, and the meals stated.",
            "Unless stated otherwise, the price does not include international flights, travel insurance, visas, vaccinations, drinks, tips, personal expenses, optional activities or anything not listed as included."
          ]
        },
        {
          "h": "5. Changes by you",
          "p": [
            "If you want to change your trip after it is confirmed, tell us in writing. We will do our best to make the change, subject to availability. You pay any costs charged by suppliers and any difference in price. Changing your travel dates, or a major change close to departure, may be treated as a cancellation.",
            "You may transfer your booking to another person who meets all the conditions of the trip by telling us in writing at least 14 days before departure. You and that person are jointly responsible for any balance and for the extra costs the transfer causes."
          ]
        },
        {
          "h": "6. Cancellation by you",
          "p": [
            "You may cancel at any time by writing to us; the cancellation takes effect on the day we receive it. Unless your booking confirmation sets different charges, we charge the following share of the total trip price:",
            "<ul><li>More than 60 days before departure: loss of the deposit</li><li>60 to 31 days before departure: 50% of the trip price</li><li>30 to 15 days before departure: 75% of the trip price</li><li>14 days or less before departure, or if you do not travel: 100% of the trip price</li></ul>",
            "Some elements, such as flights, permits and certain peak-season stays, cannot be refunded once booked; your proposal says so where this applies. Your travel insurance may cover cancellation charges."
          ]
        },
        {
          "h": "7. Changes and cancellation by us",
          "p": [
            "We plan carefully, but we sometimes have to change arrangements. If we make a minor change, such as a comparable hotel or a different route, we will tell you as soon as we can. If we have to make a significant change or cancel your trip, we will tell you promptly and you may accept the change, choose a comparable alternative, or cancel and receive a full refund of everything you have paid us.",
            "For departures with a minimum number of travellers, we may cancel if that number is not reached, telling you at least 45 days before departure and refunding everything you have paid us."
          ]
        },
        {
          "h": "8. Travel insurance",
          "p": [
            "Travel insurance is a condition of booking. Your policy must cover cancellation, medical treatment, emergency evacuation and repatriation, and the activities in your itinerary. Please send us the policy details before you travel."
          ]
        },
        {
          "h": "9. Passports, visas and health",
          "p": [
            "You are responsible for holding a valid passport, any visas or entry permits, and the vaccinations and health documents your trip requires, and for checking the rules that apply to your nationality. Entry and health rules change; we share the information we have, but please confirm it with the relevant embassy, official government sources and your doctor before you travel."
          ]
        },
        {
          "h": "10. Our responsibility",
          "p": [
            "We are responsible for arranging the services in your booking confirmation with reasonable skill and care. If any part of your trip is not provided as agreed, tell the supplier and us straight away so we can try to put it right.",
            "We are not responsible for loss, damage or delay caused by you or a member of your party, by a third party unconnected with the services we arranged, or by unusual and unforeseeable circumstances beyond our control. Where international conventions limit a supplier’s liability, for example for flights, our liability is limited in the same way. Except for death or personal injury caused by our negligence, our liability is limited to the total price of your trip. Nothing in these terms limits rights you have under consumer law that cannot be excluded."
          ]
        },
        {
          "h": "11. Your behaviour",
          "p": [
            "Please respect the laws and customs of the places you visit, follow the safety instructions of our suppliers and local hosts, and our reasonable instructions. If your behaviour puts others at risk or seriously disturbs them, we or the supplier may end your trip without refund, and you will pay any costs that result."
          ]
        },
        {
          "h": "12. Complaints",
          "p": [
            "If something goes wrong during your trip, tell the supplier and us straight away so we can try to fix it on the spot. If it is not resolved, email us within 28 days of your return. We acknowledge complaints within 14 days and aim to reply in full within 28 days.",
            `<p>Email: ${mail}</p>`
          ]
        },
        {
          "h": "13. Force majeure",
          "p": [
            "We are not liable for any failure or delay caused by unusual and unforeseeable circumstances beyond our control whose consequences could not have been avoided even with all due care, such as war, civil unrest, terrorism, natural disaster, epidemic, severe weather, strikes, or the closure of airports, borders or parks. If such circumstances prevent your trip from going ahead as booked, we will offer you a comparable alternative or a refund of the money you have paid us."
          ]
        },
        {
          "h": "14. Data protection",
          "p": [
            "We use your personal data to arrange your trip, as explained in our privacy policy.",
            "<p><a href=\"/privacy/\">Read our privacy policy</a></p>"
          ]
        },
        {
          "h": "15. Governing law",
          "p": [
            "These terms, and any dispute arising from them, are governed by the law of Spain, and the courts of Spain have jurisdiction. If you are a consumer, you may also bring proceedings in the courts of the country where you live, and you keep the protection of the mandatory consumer law of that country."
          ]
        },
        {
          "h": "16. Contact",
          "p": [
            "Questions about these terms or your booking:",
            `<p>Email: ${mail}</p>`
          ]
        }
      ]
    },
    {
      "slug": "cookies",
      "title": "Cookie Policy",
      "lede": `What the ${brand} website stores in your browser, and why.`,
      "updated": UPDATED,
      "sections": [
        {
          "h": "What cookies are",
          "p": [
            "Cookies are small text files that a website saves in your browser. Similar technologies, such as local storage and session storage, let a site keep small pieces of information in your browser. In this policy, “cookies” covers all of them."
          ]
        },
        {
          "h": "What this site uses",
          "p": [
            "This site sets no cookies and stores nothing in your browser.",
            "We do not use analytics, advertising or social-media tracking cookies."
          ]
        },
        {
          "h": "Consent",
          "p": [
            "Essential items do not need your consent because the site, or a feature you ask for, cannot work without them. If we ever add cookies that are not essential, such as analytics, we will ask for your consent first and update this policy."
          ]
        },
        {
          "h": "Third-party content",
          "p": [
            "<ul><li>This website is hosted by Vercel, which processes your IP address in its server logs to deliver the pages. Vercel sets no cookies on this site.</li><li>Some photographs are delivered from third-party image servers. Your browser sends your IP address to those servers so they can deliver the images; they set no cookies on this site.</li><li>Our fonts are served from this website, so no font provider receives your data.</li><li>We do not embed maps, videos, social-media widgets or advertising.</li></ul>"
          ]
        },
        {
          "h": "How to manage or disable cookies",
          "p": [
            "You can view and delete cookies and site data at any time in your browser settings, and you can block them altogether. Look for “cookies” or “site data” in the privacy settings of Chrome, Firefox, Safari or Edge; each browser’s help pages explain the steps."
          ]
        },
        {
          "h": "Changes to this policy",
          "p": [
            "We will update this policy if the way this site uses cookies changes. The date at the top shows the latest version."
          ]
        },
        {
          "h": "Contact",
          "p": [
            "Questions about this policy:",
            `<p>Email: ${mail}</p>`
          ]
        }
      ]
    }
  ];
}

export { legal, UPDATED };
