const sourceUrl = 'https://sre.google/workbook/implementing-slos/';

const principles = [
  {
    title: 'Start with the user journey',
    body:
      'The workbook frames reliability around what users are trying to accomplish, not around isolated service components.',
  },
  {
    title: 'Model interactions and required systems',
    body:
      'For each journey step, include both user-visible actions and backend dependencies needed for the activity to complete.',
  },
  {
    title: 'Grade interaction importance',
    body:
      'Not every click is equal. Distinguish common tasks from truly critical activities, then prioritize your SLO investment.',
  },
  {
    title: 'Measure the whole path',
    body:
      'The implementation should track every required interaction in the CUJ so you can detect when users fail to complete goals.',
  },
];

const journeySteps = [
  { id: 'browse', label: 'Browse product catalog', critical: false },
  { id: 'search', label: 'Search by keyword', critical: false },
  { id: 'add', label: 'Add item to cart', critical: true },
  { id: 'pay', label: 'Complete purchase and payment', critical: true },
  { id: 'invoice', label: 'Receive order confirmation', critical: false },
];

const measurementPrompts = [
  {
    id: 'checkout-latency',
    step: 'Checkout submit',
    correct: 'latency',
    options: ['latency', 'availability'],
  },
  {
    id: 'payment-success',
    step: 'Payment authorization',
    correct: 'availability',
    options: ['latency', 'availability'],
  },
  {
    id: 'checkout-page-load',
    step: 'Checkout page load',
    correct: 'latency',
    options: ['latency', 'availability'],
  },
];

const app = document.querySelector('#app');

app.innerHTML = `
  <main>
    <header class="hero">
      <p class="eyebrow">Google SRE Workbook Study</p>
      <h1>Critical User Journeys (CUJs)</h1>
      <p>
        Learn how to define and measure CUJs from <a href="${sourceUrl}" target="_blank" rel="noreferrer">Implementing SLOs</a> through interactive knowledge checks.
      </p>
    </header>

    <section class="panel">
      <h2>Core CUJ Concepts</h2>
      <div class="grid" id="principles"></div>
    </section>

    <section class="panel">
      <h2>Why CUJs Matter for Reliability</h2>
      <p>
        Reliability work is most effective when it protects the moments where users get real value. CUJs make those moments explicit, so engineering effort maps to user outcomes.
      </p>
      <div class="grid">
        <article class="card">
          <h3>Aligns SLOs to user value</h3>
          <p>
            CUJs keep objectives tied to user success, instead of over-optimizing internal components that users do not directly feel.
          </p>
        </article>
        <article class="card">
          <h3>Improves incident prioritization</h3>
          <p>
            When a failure affects a critical journey, teams can escalate quickly with clear justification and less ambiguity during incidents.
          </p>
        </article>
        <article class="card">
          <h3>Finds hidden weak links</h3>
          <p>
            Mapping the full path exposes dependencies that can silently break completion, even when individual services look healthy.
          </p>
        </article>
        <article class="card">
          <h3>Guides smarter tradeoffs</h3>
          <p>
            CUJs help decide where to spend reliability budget: stricter targets for critical activities, lighter treatment for low-impact paths.
          </p>
        </article>
      </div>
    </section>

    <section class="panel">
      <h2>Knowledge Check 1: Spot the Critical Activities</h2>
      <p>
        Pick the steps that are truly mission-critical for user value. Hint: completion matters more than browsing.
      </p>
      <form id="criticalForm" class="exercise"></form>
      <div class="actions">
        <button id="checkCritical" type="button">Score This Round</button>
        <button id="resetCritical" type="button" class="ghost">Play Again</button>
      </div>
      <p id="criticalFeedback" class="feedback"></p>
    </section>

    <section class="panel">
      <h2>Knowledge Check 2: Match Steps to Signals</h2>
      <p>
        Match each step to the signal that best catches user-visible trouble: availability or latency.
      </p>
      <div id="measurement" class="stack"></div>
      <div class="actions">
        <button id="gradeMeasurement" type="button">Check My Matchups</button>
      </div>
      <p id="measurementFeedback" class="feedback"></p>
    </section>

    <section class="panel">
      <h2>Knowledge Check 3: Priority Meter</h2>
      <p>
        Slide the meter and decide how much SLO attention this journey should get. Use user impact and business harm as your compass.
      </p>
      <label for="priorityRange">Journey Priority: <strong id="priorityLabel">Medium</strong></label>
      <input id="priorityRange" type="range" min="1" max="5" value="3" />
      <p id="priorityNarrative" class="note"></p>
    </section>
  </main>
`;

const principlesContainer = document.querySelector('#principles');
principlesContainer.innerHTML = principles
  .map(
    (item) => `
      <article class="card">
        <h3>${item.title}</h3>
        <p>${item.body}</p>
      </article>
    `,
  )
  .join('');

const criticalForm = document.querySelector('#criticalForm');
criticalForm.innerHTML = journeySteps
  .map(
    (step) => `
      <label class="check-row">
        <input type="checkbox" data-step="${step.id}" />
        <span>${step.label}</span>
      </label>
    `,
  )
  .join('');

const checkCritical = document.querySelector('#checkCritical');
const resetCritical = document.querySelector('#resetCritical');
const criticalFeedback = document.querySelector('#criticalFeedback');

checkCritical.addEventListener('click', () => {
  let score = 0;
  for (const step of journeySteps) {
    const input = document.querySelector(`input[data-step="${step.id}"]`);
    if (!input) continue;
    const row = input.parentElement;
    const selectedCritical = input.checked && step.critical;
    const selectedCommon = input.checked && !step.critical;
    const missedCritical = !input.checked && step.critical;

    row.classList.remove('correct', 'wrong', 'missed');
    row.classList.toggle('correct', selectedCritical);
    row.classList.toggle('wrong', selectedCommon);
    row.classList.toggle('missed', missedCritical);

    if ((step.critical && input.checked) || (!step.critical && !input.checked)) score += 1;
  }

  const total = journeySteps.length;
  const perfect = score === total;
  criticalFeedback.textContent = perfect
    ? 'Perfect round. You found the purchase-critical path that defines the core CUJ.'
    : `Round score: ${score}/${total}. Re-check the steps where user value is actually completed.`;
});

resetCritical.addEventListener('click', () => {
  for (const step of journeySteps) {
    const input = document.querySelector(`input[data-step="${step.id}"]`);
    if (!input) continue;
    input.checked = false;
    input.parentElement.classList.remove('correct', 'wrong', 'missed');
  }
  criticalFeedback.textContent = '';
});

const measurement = document.querySelector('#measurement');
measurement.innerHTML = measurementPrompts
  .map(
    (prompt) => `
      <label class="measure-row">
        <span>${prompt.step}</span>
        <select data-measure="${prompt.id}">
          ${prompt.options.map((option) => `<option value="${option}">${option}</option>`).join('')}
        </select>
      </label>
    `,
  )
  .join('');

const gradeMeasurement = document.querySelector('#gradeMeasurement');
const measurementFeedback = document.querySelector('#measurementFeedback');

gradeMeasurement.addEventListener('click', () => {
  let score = 0;
  for (const prompt of measurementPrompts) {
    const select = document.querySelector(`select[data-measure="${prompt.id}"]`);
    if (!select) continue;
    const correct = select.value === prompt.correct;
    select.classList.toggle('correct', correct);
    select.classList.toggle('wrong', !correct);
    if (correct) score += 1;
  }

  const perfect = score === measurementPrompts.length;
  measurementFeedback.textContent = perfect
    ? 'Strong match. Your SLI choices now cover the CUJ path end to end.'
    : `Round score: ${score}/${measurementPrompts.length}. Re-check which signal best surfaces user-visible failure for each step.`;
});

const priorityRange = document.querySelector('#priorityRange');
const priorityLabel = document.querySelector('#priorityLabel');
const priorityNarrative = document.querySelector('#priorityNarrative');

const describePriority = (value) => {
  if (value <= 2) {
    return {
      label: 'Low',
      text: 'Low priority journeys can still be monitored, but they should consume less error budget focus and paging urgency.',
    };
  }
  if (value === 3) {
    return {
      label: 'Medium',
      text: 'Medium priority journeys often get office-hours follow-up and broader thresholds while you validate impact.',
    };
  }
  return {
    label: 'High',
    text: 'High priority CUJs represent direct user value and should drive strict SLO targets and rapid response.',
  };
};

const setPriority = () => {
  const value = Number(priorityRange.value);
  const view = describePriority(value);
  priorityLabel.textContent = view.label;
  priorityNarrative.textContent = view.text;
};

priorityRange.addEventListener('input', setPriority);
setPriority();

// Caching is intentionally disabled: remove any previous service workers/caches.
window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch((error) => {
        console.error('Service worker cleanup failed', error);
      });
  }

  if ('caches' in window) {
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .catch((error) => {
        console.error('Cache storage cleanup failed', error);
      });
  }
});
