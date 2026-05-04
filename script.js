const toggles = document.querySelectorAll('.toggle-btn');

toggles.forEach((btn) => {
  btn.addEventListener('click', () => {
    const panel = btn.closest('.expand-panel');
    const isOpen = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    const defaultLabel = btn.closest('.prequel-card') ? 'Read More' : 'View More';
    btn.textContent = isOpen ? 'Show Less' : defaultLabel;
  });
});

const modal = document.getElementById('inquiryModal');
const openModalButtons = document.querySelectorAll('.open-modal');
const closeModalButton = document.querySelector('.modal-close');
const backdrop = document.querySelector('.modal-backdrop');
const form = document.querySelector('.inquiry-form');

const HUBSPOT_PORTAL_ID = '246002302';
const HUBSPOT_FORM_ID = '2b07ad7f-c9f9-43a7-a40e-90fee19c11e5';
const HUBSPOT_ENDPOINT = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`;

function openModal(eventType = '') {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const eventTypeSelect = form.querySelector('select[name="event_type"]');

  if (eventTypeSelect && eventType) {
    const matchingOption = Array.from(eventTypeSelect.options).find(
      (option) => option.textContent.trim() === eventType.trim()
    );

    if (matchingOption) {
      eventTypeSelect.value = matchingOption.value;
    }
  }
}

function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

openModalButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    openModal(button.dataset.eventType || '');
  });
});

closeModalButton.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const existingSuccess = form.querySelector('.form-success');
  if (existingSuccess) existingSuccess.remove();

  const existingError = form.querySelector('.form-error');
  if (existingError) existingError.remove();

  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;

  submitButton.disabled = true;
  submitButton.textContent = 'Submitting...';

  const formData = new FormData(form);

  const payload = {
    fields: [
      { name: 'firstname', value: formData.get('first_name') || '' },
      { name: 'lastname', value: formData.get('last_name') || '' },
      { name: 'email', value: formData.get('email') || '' },
      { name: 'phone', value: formData.get('phone') || '' },
      { name: 'event_organization_name', value: formData.get('organization_name') || '' },
      { name: 'event_venue', value: formData.get('venue_name') || '' },
      { name: 'event_venue_location', value: formData.get('venue_location') || '' },
      { name: 'event_type_correct', value: formData.get('event_type') || '' },
      { name: 'event_expected_guests', value: formData.get('guest_count') || '' },
      { name: 'event_expected_timeframe', value: formData.get('date_timeframe') || '' },
      { name: 'event_notes', value: formData.get('event_details') || '' }
    ],
    context: {
      pageUri: window.location.href,
      pageName: document.title
    }
  };

  try {
    const response = await fetch(HUBSPOT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HubSpot error:', errorText);
      throw new Error('HubSpot submission failed');
    }

    const success = document.createElement('p');
    success.className = 'form-success';
    success.textContent = 'Inquiry submitted successfully.';
    form.appendChild(success);

    form.reset();
    submitButton.textContent = 'Submitted';

    setTimeout(() => {
      closeModal();
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      success.remove();
    }, 1400);
  } catch (error) {
    console.error(error);

    const errorMessage = document.createElement('p');
    errorMessage.className = 'form-error';
    errorMessage.textContent = 'Something went wrong. Please try again.';
    form.appendChild(errorMessage);

    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
