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

function openModal() {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

openModalButtons.forEach((button) => button.addEventListener('click', (event) => {
  event.preventDefault();
  openModal();
}));
closeModalButton.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const existing = form.querySelector('.form-success');
  if (existing) existing.remove();

  const success = document.createElement('p');
  success.className = 'form-success';
  success.textContent = 'Inquiry captured in this draft preview. When you are ready, this form can be connected to live delivery while keeping the same required fields and flow.';
  form.appendChild(success);
  form.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
