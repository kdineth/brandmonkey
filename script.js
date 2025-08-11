// ====== Data ======
const OPTION_LABELS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];

const sections = [
  {
    title: 'Brand Awareness',
    questions: [
      [1, 'People in Kandy recognize our shop name.'],
      [2, 'Customers remember our logo and store colors.'],
      [3, 'Our shop’s appearance stands out from competitors.'],
      [4, 'People know exactly what we sell.'],
      [5, 'We tell our story (why we started, what we stand for).'],
      [6, 'Customers can easily describe us to their friends.'],
      [7, 'Our brand is seen as trustworthy.'],
      [8, 'People think of us first when they need our products.']
    ]
  },
  {
    title: 'Marketing Presence',
    questions: [
      [9,'We post regularly on Facebook or Instagram.'],
      [10,'Our posts get likes, comments, or shares.'],
      [11,'We use photos to show our products clearly.'],
      [12,'We use videos to show how products work.'],
      [13,'We use paid ads online.'],
      [14,'We appear in Google searches for our products.'],
      [15,'We reply to customer messages quickly.'],
      [16,'Our shop is easy to find on Google Maps.']
    ]
  },
  {
    title: 'Customer Engagement',
    questions: [
      [17,'We ask customers for reviews or feedback.'],
      [18,'We share positive customer reviews online.'],
      [19,'Customers recommend us to friends or family.'],
      [20,'We give product tips or useful health information in posts.'],
      [21,'We celebrate holidays or special days with posts/offers.'],
      [22,'Customers interact with us through comments or messages.'],
      [23,'We post about real customers using our products.'],
      [24,'We answer product-related questions publicly online.']
    ]
  },
  {
    title: 'Sales & Promotions',
    questions: [
      [25,'We run discounts or special offers.'],
      [26,'We promote slow-moving stock to clear space.'],
      [27,'We promote seasonal products at the right time.'],
      [28,'Our online posts lead to actual sales.'],
      [29,'We create bundle deals for higher sales.'],
      [30,'We upsell or cross-sell products in-store.'],
      [31,'Customers come back because of our promotions.'],
      [32,'We get online orders from our marketing.']
    ]
  },
  {
    title: 'Marketing Resources & Tracking',
    questions: [
      [33,'We have someone to take good product photos/videos.'],
      [34,'We can post at least 3 times a week.'],
      [35,'We have a budget for monthly advertising.'],
      [36,'We track which posts bring the most attention.'],
      [37,'We track which ads bring the most sales.'],
      [38,'We have a list of our customer contacts.'],
      [39,'We can send promotions via SMS/WhatsApp/Email.'],
      [40,'We are willing to try new marketing ideas to get more sales.']
    ]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const totalQuestions = 40;

  const form = document.getElementById('assessmentForm');
  const sectionsWrap = document.getElementById('sections');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const submitBtn = document.getElementById('submitBtn');
  const resetBtn = document.getElementById('resetBtn');

  const resultsModal = document.getElementById('resultsModal');
  const modalCard   = document.getElementById('modalCard');
  const closeModal  = document.getElementById('closeModal');
  const restartBtn  = document.getElementById('restartBtn');

  const planTitleEl = document.getElementById('planTitle');
  const planSubtitleEl = document.getElementById('planSubtitle');
  const planDescEl = document.getElementById('planDesc');
  const planFeaturesEl = document.getElementById('planFeatures');
  const scoreBadge = document.getElementById('scoreBadge');

  // ====== Render ======
  sections.forEach(({title, questions}) => {
    const sectionEl = document.createElement('section');
    sectionEl.className = 'section';

    sectionEl.innerHTML = `
      <h2 class="section-title"><span class="dot"></span>${title}</h2>
      <div class="grid"></div>
    `;

    const grid = sectionEl.querySelector('.grid');

    questions.forEach(([id, text]) => {
      const q = document.createElement('div');
      q.className = 'question';
      q.innerHTML = `
        <div class="question-text">${id}. ${text}</div>
        <div class="options" role="radiogroup" aria-label="Q${id}"></div>
      `;
      const opts = q.querySelector('.options');

      for (let v = 1; v <= 5; v++) {
        const opt = document.createElement('div');
        opt.className = 'option';

        const input = document.createElement('input');
        input.type = 'radio';
        input.id = `q${id}_${v}`;
        input.name = `q${id}`;
        input.value = String(v);

        const label = document.createElement('label');
        label.setAttribute('for', input.id);
        label.textContent = OPTION_LABELS[v - 1];

        opt.appendChild(input);
        opt.appendChild(label);
        opts.appendChild(opt);
      }

      grid.appendChild(q);
    });

    sectionsWrap.appendChild(sectionEl);
  });

  // ====== Progress ======
  function updateProgress(){
    const fd = new FormData(form);
    let answered = 0;
    for(let i=1;i<=totalQuestions;i++){
      if(fd.get('q'+i)) answered++;
    }
    const pct = Math.round((answered/totalQuestions)*100);
    progressBar.style.width = pct + '%';
    progressText.textContent = pct + '% Complete';
    submitBtn.disabled = answered !== totalQuestions;
  }

  form.addEventListener('change', e => {
    if (e.target.matches('input[type="radio"]')) updateProgress();
  });

  resetBtn.addEventListener('click', ()=>{
    form.reset();
    updateProgress();
    window.scrollTo({top:0, behavior:'smooth'});
  });

  // ====== Submit / Score ======
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    let score = 0;
    for(let i=1;i<=totalQuestions;i++){
      score += parseInt(fd.get('q'+i), 10);
    }
    showResults(score);
  });

  // ====== Modal helpers ======
  function onEsc(e){ if(e.key === 'Escape') closeModalFn(); }

  function openModal(){
    resultsModal.classList.add('show');
    resultsModal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onEsc);
  }
  function closeModalFn(){
    resultsModal.classList.remove('show');
    resultsModal.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onEsc);
  }
  closeModal.addEventListener('click', closeModalFn);
  resultsModal.addEventListener('click', (e)=>{ if(e.target===resultsModal) closeModalFn(); });
  restartBtn.addEventListener('click', ()=>{
    closeModalFn();
    form.reset();
    updateProgress();
    window.scrollTo({top:0, behavior:'smooth'});
  });

  // ====== Plan Logic ======
  function showResults(score){
    scoreBadge.textContent = `${score} / 200`;

    let planClass = 'plan-a';
    let title = 'Plan A: Brand Builder';
    let subtitle = 'Foundation & Trust Building';
    let desc = 'Focus on awareness, consistency and trust. Establish clear identity and become discoverable for sustained growth.';
    let features = [
      '3 posts per week: brand story, product education, helpful tips',
      'Google Business Profile setup + weekly updates',
      'Collect and showcase customer reviews (in-store & online)',
      'Highlight store visuals, team members, and behind-the-scenes',
      'Define consistent brand colors, logo usage, and tone of voice',
      'Create simple FAQ posts addressing common customer queries',
      'Neighborhood awareness: flyers around Kandy medical hotspots',
      'Basic tracking: log post dates and enquiries in a simple sheet'
    ];

    if(score >= 101 && score <= 160){
      planClass = 'plan-b';
      title = 'Plan B: Growth Booster';
      subtitle = 'Balanced Growth Strategy';
      desc = 'You have foundations in place—now balance awareness with sales. Add light ad spend and clear offers to accelerate.';
      features = [
        '4–5 posts weekly mixing offers, product highlights, testimonials',
        'Simple monthly campaigns (seasonal bundles, slow-mover clearance)',
        'Short videos: demo glucometers, BP monitors, nebulizers, etc.',
        'Targeted social ads with modest budget (audiences in Kandy)',
        'Starter bundles: “New-mom pack”, “Home care essentials”',
        'SMS/WhatsApp list for repeat promotions & reminders',
        'UTM links on posts; track clicks and enquiries',
        'Monthly review: top posts, best-performing offers'
      ];
    } else if(score >= 161){
      planClass = 'plan-c';
      title = 'Plan C: Sales Accelerator';
      subtitle = 'Aggressive Growth & Optimization';
      desc = 'You’re marketing-ready. Scale with advanced ads, automation, and data-driven optimization to maximize ROI.';
      features = [
        'Daily content cadence (photos, reels, carousels, live Q&A)',
        'Professional photo/video shoots and regular livestream demos',
        'Full-funnel ads: prospecting + retargeting + lookalikes',
        'Influencer/clinician partnerships & community workshops',
        'Automated customer journeys (welcome, reorder, seasonal)',
        'A/B test creatives, captions, and landing pages monthly',
        'Advanced analytics dashboard (ad ROAS, CAC, LTV)',
        'Geo-targeted offers for Kandy neighborhoods & delivery promos'
      ];
    }

    modalCard.classList.remove('plan-a','plan-b','plan-c');
    modalCard.classList.add(planClass);

    planTitleEl.textContent = title;
    planSubtitleEl.textContent = subtitle;
    planDescEl.textContent = desc;

    planFeaturesEl.innerHTML = '';
    features.forEach(f=>{
      const li = document.createElement('li');
      li.textContent = f;
      planFeaturesEl.appendChild(li);
    });

    openModal();
  }

  // initial progress state
  updateProgress();
});
