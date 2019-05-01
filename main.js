const container = document.querySelector('.clock-calendar');
const buttonDisplay = document.querySelector('.button-display');
const buttonDisable = document.querySelector('.button-disable');
let clock = document.querySelector('.my-clock-calendar');

customElements.define('my-clock-calendar', MyClockCalendar);
clock.style.display = 'none';

buttonDisplay.addEventListener('click', (event) => {
	buttonDisable.style.display = 'inline-block';
	event.target.style.display = 'none';
	clock.style.display = 'block';
	clock.mode = 'clock';
});

buttonDisable.addEventListener('click', (event) => {
	buttonDisplay.style.display = 'inline-block';
	event.target.style.display = 'none';
	clock.style.display = 'none';
	clock.stopped = true;
});