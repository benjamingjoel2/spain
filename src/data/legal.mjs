/**
 * Legal pages: Privacy Policy, Booking Terms and Cookie Policy.
 *
 * Plain data so it can move to a CMS later. Each page has a title, a short
 * lede, a "last updated" date and sections of paragraphs. `legal(site)` fills in
 * the brand name, email and business address. `storage` lists what the site
 * actually stores in the visitor's browser (see the Cookie Policy).
 * Have a lawyer review these before launch.
 */
const UPDATED = '2026-10-30';

function legal({ brand, email, address, storage = [], processors = [] }) {
  const addr = address.join(', ');
  const mail = `<a href="mailto:${email}">${email}</a>`;
  const storageList = storage.length
    ? `<ul>${storage.map((s) => `<li><b>${s.name}</b> (${s.type}, ${s.duration}): ${s.purpose}</li>`).join('')}</ul>`
    : '';
  const processorList = processors.length
    ? `<ul>${processors.map((p) => `<li><b>${p.name}</b>: ${p.purpose}</li>`).join('')}</ul>`
    : '';

  return [
    {
      slug: 'privacy',
      title: 'Privacy Policy',
      lede: `How ${brand} collects, uses and protects your personal information.`,
      updated: UPDATED,
      sections: [
        { h: 'Who we are', p: [
          `${brand} plans tailor-made journeys. We are the controller of the personal information described in this policy. You can reach us at ${mail} or by post at ${addr}.`,
        ] },
        { h: 'What we collect', p: [
          'When you send an enquiry we collect what you choose to give us: your name, email address and, if you add them, your phone number, travel dates, number of travellers, interests, budget range and any message.',
          'When we plan and arrange a journey for you we may also need the names, dates of birth, passport details, dietary needs, health or mobility information and emergency contacts of everyone travelling. We ask for these only when they are needed to make the arrangements, and we treat health information with extra care.',
          'Like every website, our hosting provider records technical information such as your IP address, browser type and the pages requested, so that the site can be delivered and kept secure.',
        ] },
        { h: 'How we use it and our legal basis', p: [
          'We use your information to reply to your enquiry, prepare proposals and quotes, make and manage bookings with hotels, guides, drivers and other suppliers, look after you while you travel, and keep the records we are required to keep by law.',
          'Our legal bases are: taking steps at your request before entering into a contract and performing that contract; your consent where we ask for it (for example, the consent box on our enquiry form, or to keep in touch about future trips); our legitimate interest in running and securing our business; and compliance with legal obligations such as accounting and tax rules.',
          'We do not sell your personal information and we do not use it for automated decision-making.',
        ] },
        { h: 'Who we share it with', p: [
          'We share only what is needed with the suppliers who provide your journey (accommodation, transport, guides and activity providers), with insurers or emergency services if you need help while travelling, and with service providers who help us run the business, such as our website host and email provider, under contracts that require them to protect it.',
          ...(processorList ? [`The service providers involved in this website are:${processorList}`] : []),
          'Some suppliers and service providers are outside your country. Where information is transferred outside the UK or the European Economic Area, we make sure appropriate safeguards are in place, such as standard contractual clauses.',
        ] },
        { h: 'How long we keep it', p: [
          'We keep enquiries that do not lead to a booking for up to two years, then delete them. We keep booking records for as long as the law requires for accounting and tax purposes, usually up to seven years after your journey.',
        ] },
        { h: 'Your rights', p: [
          `You can ask for a copy of your information, ask us to correct or delete it, object to or restrict how we use it, ask for it to be transferred, and withdraw any consent you have given at any time. Write to ${mail}; we reply within one month.`,
          'If you are unhappy with how we have handled your information, please tell us first. You also have the right to complain to the data protection authority in the country where you live or work.',
        ] },
        { h: 'Security', p: [
          'We use reputable providers, encrypted connections (HTTPS) and limited access to protect your information. No method of transmission over the internet is completely secure, so please do not send passport scans or card details by ordinary email unless we ask you to.',
        ] },
        { h: 'Cookies', p: [
          'Our use of cookies and similar technologies is explained in our <a href="/cookies/">Cookie Policy</a>.',
        ] },
        { h: 'Changes to this policy', p: [
          'We may update this policy from time to time. The date at the top shows when it last changed.',
        ] },
      ],
    },
    {
      slug: 'terms',
      title: 'Booking Terms',
      lede: `The terms on which ${brand} plans and arranges tailor-made journeys. Please read them before you confirm a booking.`,
      updated: UPDATED,
      sections: [
        { h: 'About these terms', p: [
          `These terms apply to every journey arranged by ${brand} (“we”, “us”), contact ${mail}, ${addr}. “You” means the person making the booking and everyone travelling on it. The person who makes the booking confirms that they are authorised to accept these terms on behalf of everyone named on it.`,
        ] },
        { h: 'Enquiries and proposals', p: [
          'Every journey starts with an enquiry and a conversation. We then send a written proposal with an itinerary and a quote. Proposals and quotes are free and are not a booking: places are not held until a booking is confirmed, and availability and prices can change until then.',
        ] },
        { h: 'Prices', p: [
          'Our quotes are tailor-made and state what is and is not included. Unless the quote says otherwise, international flights, travel insurance, visas, tips, and personal expenses are not included. Once a booking is confirmed we will not change its price except where permitted by law, for example because of changes in transport costs, taxes or fees imposed by third parties or exchange rates, and we will tell you as early as possible and explain how the change was calculated.',
        ] },
        { h: 'Booking, deposit and balance', p: [
          'A booking is confirmed when you accept the proposal, pay the deposit stated in it and we send you a written confirmation. The deposit secures the arrangements and is used to pay suppliers.',
          'The balance is due by the date stated in your confirmation, usually some weeks before you travel. If the balance is not received on time we may treat the booking as cancelled by you and apply the cancellation charges below. Bookings made close to departure may require full payment at the time of booking.',
        ] },
        { h: 'Changes by you', p: [
          'If you want to change your booking after it is confirmed, tell us in writing as soon as possible. We will do our best to help, but changes depend on availability and suppliers’ own conditions. We will pass on any extra cost and may charge a reasonable fee for the work involved; both will be agreed with you before we make the change.',
          'You may transfer your booking to another person who meets any conditions of the journey, provided you give us reasonable notice before departure. You and the new traveller are jointly responsible for any balance and for any extra costs arising from the transfer.',
        ] },
        { h: 'Cancellation by you', p: [
          'You may cancel at any time by writing to us. Because we pay suppliers in advance, cancellation charges apply; they increase as departure gets closer and are set out in your proposal and confirmation before you book. Where suppliers refund us, we will pass the refund on to you less the cancellation charge. Your travel insurance may cover cancellation charges in some circumstances.',
          'You may cancel without a charge if unavoidable and extraordinary circumstances at your destination significantly affect the journey, such as war, natural disaster or a serious outbreak of disease, as recognised by the relevant government travel advice.',
        ] },
        { h: 'Changes and cancellation by us', p: [
          'We plan carefully, but occasionally we have to make changes. If a change is minor we will tell you as soon as we can. If we have to make a significant change, or cancel your journey, we will tell you as soon as possible and offer you the choice of the changed arrangements, an alternative journey of equivalent or higher standard if available, or a full refund of the money you have paid us.',
          'We will not cancel your journey after the balance is due unless we are forced to by unavoidable and extraordinary circumstances, or because you have not paid.',
        ] },
        { h: 'Travel insurance', p: [
          'Comprehensive travel insurance is a condition of booking. It must cover cancellation and curtailment, medical treatment, repatriation and any activities included in your journey. Please arrange it when you book and send us the policy details before you travel.',
        ] },
        { h: 'Passports, visas and health', p: [
          'Each traveller is responsible for holding a valid passport, any visas and entry permits, and meeting the health and vaccination requirements for every country on the itinerary, including any rules on passport validity and blank pages. We will share general guidance, but requirements change: please check the official government advice for your nationality before you book and again before you travel. We are not responsible for costs arising from missing or incorrect documents.',
          'Please tell us before you book about any medical condition, disability or reduced mobility that may affect your journey, so that we can advise whether the arrangements are suitable.',
        ] },
        { h: 'Our responsibilities and limits', p: [
          'We are responsible for making sure that the arrangements we book are provided as described, by suppliers we have selected with reasonable care. If something goes wrong, tell us or the supplier straight away so that it can be put right.',
          'We are not responsible where a failure is caused by you, by a third party not connected with providing your journey, or by unavoidable and extraordinary circumstances beyond our control. Where we are liable, our liability is limited as permitted by law and by the international conventions that apply to air, sea and rail travel and to hotels. Nothing in these terms limits liability for death or personal injury caused by negligence, or any other liability that cannot be limited by law.',
          'Excursions or services that you book directly with a local supplier during your journey are not part of our arrangements, and we are not responsible for them.',
        ] },
        { h: 'Your responsibilities', p: [
          'We ask you to follow the reasonable instructions of our suppliers, respect local laws and customs, and not behave in a way that puts others at risk or causes damage. We may end the journey of anyone who does, without refund.',
        ] },
        { h: 'Complaints', p: [
          `If you have a problem during your journey, tell the supplier and us at once so that we can try to resolve it on the spot. If it is not resolved, write to us at ${mail} within 28 days of your return and we will reply promptly. If we cannot agree, you may be able to use an alternative dispute resolution scheme.`,
        ] },
        { h: 'Governing law', p: [
          'These terms are governed by the law that applies where our business is established, and any dispute will be dealt with by the courts there. This does not take away any protection given to you by the mandatory consumer laws of the country where you live.',
        ] },
      ],
    },
    {
      slug: 'cookies',
      title: 'Cookie Policy',
      lede: `What ${brand} stores on your device when you use this website, and how to control it.`,
      updated: UPDATED,
      sections: [
        { h: 'Cookies and similar technologies', p: [
          'Cookies are small text files that a website saves in your browser. Similar technologies, such as local storage, work in much the same way. They can be strictly necessary for a site to work, or used for things like analytics and advertising, which need your consent.',
        ] },
        { h: 'What this site uses', p: storage.length
          ? [`This site does not use advertising or tracking cookies, and does not set cookies of its own. It uses only the following, which are strictly necessary for features you ask for:${storageList}Because these are strictly necessary, they do not need consent, and nothing is stored until you use the feature concerned.`]
          : ['This site does not use any cookies or similar technologies: no analytics, no advertising and no tracking. It does not store anything in your browser.'] },
        { h: 'Third-party content', p: [
          'Photographs on this site are loaded from an image delivery service, which receives your IP address and browser details in order to send the images to you, in the same way as any website you visit. It does not set cookies through this site.',
        ] },
        { h: 'Consent and how to withdraw it', p: [
          'If we ever add analytics or any other cookies that are not strictly necessary, we will ask for your consent first, through a banner on the site, and update this policy. You will be able to withdraw your consent at any time from the same place.',
          'You can also delete cookies and site data, or block them, in your browser settings at any time. Blocking strictly necessary storage may stop some features from working.',
        ] },
        { h: 'Contact', p: [
          `Questions about this policy: ${mail}, ${addr}. See also our <a href="/privacy/">Privacy Policy</a>.`,
        ] },
      ],
    },
  ];
}

export { legal, UPDATED };
