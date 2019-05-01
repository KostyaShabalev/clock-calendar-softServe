class MyClockCalendar extends HTMLElement {
	
	static get observedAttributes() {

		return ['fullTime', 'dateFormat', 'stopped', 'mode'];
	}

	get fullTime() {

		return this.hasAttribute('fullTime');
	}

	set fullTime(isFull) {
		if (isFull) {
			this.setAttribute('fullTime', '');
		} else {
			this.removeAttribute('fullTime');
		}
	}

	set dateFormat(format) {
		this.setAttribute('dateFormat', format);
	}

	get stopped() {

		return this.hasAttribute('stopped');
	}

	set stopped(isStopped) {
		if (isStopped) {
			this.setAttribute('stopped', '');
		} else {
			this.removeAttribute('stopped');
		}
	}

	set mode(mode) {
		this.setAttribute('mode', mode);
	}

	constructor() {
		super();

		this.setAttributes();
		this.createShadowDOM();
		this.addListeners();
	}

	attributeChangedCallback(name, oldVal, newVal) {
		console.log(`Attribute ${name} changed`);

		switch (name) {
			case 'mode':
				if ( (oldVal === 'clock') && (newVal !== oldVal)) {
					this.stopped = true;
					this.shadowDOM.children[1].style.display = 'none';
					this.shadowDOM.children[2].style.display = 'inline';
					this.displayDate();
				} else {
					this.stopped = false;
					this.runTimer();
					this.shadowDOM.children[2].style.display = 'none';
					this.shadowDOM.children[1].style.display = 'inline';
				}
		}
	}

	setAttributes() {
		this.fullTime = false;
		this.dateFormat = 'eu';
		this.stopped = false;
	}

	createShadowDOM() {
		const myStyle = `<link rel="stylesheet" href="./clock-style.css">`;
		const timeElementTemplate = `<p class="shadow-time" style="display: 'none';"></p>`;
		const dateElementTemplate = `<p class="shadow-date" style="display: 'none';"></p>`;

		this.shadowDOM = this.attachShadow({mode: 'open'});
		this.shadowDOM.innerHTML = myStyle + timeElementTemplate + dateElementTemplate;
	}

	addListeners() {
		let timeElement = this.shadowDOM.querySelector('.shadow-time');
		let dateElement = this.shadowDOM.querySelector('.shadow-date');

		timeElement.addEventListener('click', (event) => {
			this.fullTime = !this.fullTime;
			this.runTimer();
		});

		timeElement.addEventListener('contextmenu', (event) => {
			event.preventDefault();
			this.toggleMode();
		});

		dateElement.addEventListener('click', (event) => {
			this.dateFormat = (this.getAttribute('dateFormat') === 'eu') ? 'ua': 'eu';
			this.displayDate();
		});

		dateElement.addEventListener('contextmenu', (event) => {
			event.preventDefault();
			this.toggleMode();
		});
	}

	runTimer() {
		let timeComponents = [];
		let container = this.shadowDOM.children[1];
		let date = new Date();
		let updateTime;

		timeComponents.push(date.getHours());
		timeComponents.push(date.getMinutes());

		if (this.fullTime) {
			timeComponents.push(date.getSeconds());
			updateTime = 1000;
		} else {
			updateTime = 60000;
		}

		if (!this.stopped) {
			container.innerHTML = this.displayTime(...timeComponents);
			setTimeout(this.runTimer.bind(this), updateTime);
		}
	}

	displayDate() {
		let container = this.shadowDOM.children[2];
		let dateToDisplay = this.getDate();

		container.innerHTML = dateToDisplay;
	}

	getDate() {
		let date = new Date();
		let formattedDate = '';

		if (this.getAttribute('dateFormat') === 'eu') {
			let euFormatter = new Intl.DateTimeFormat('en-us', {
				year: "2-digit",
				month: "2-digit",
				day: "2-digit"
			});
			formattedDate = euFormatter.format(date);
		} else {
			let uaFormatter = new Intl.DateTimeFormat('ru');
			formattedDate = uaFormatter.format(date);
		}

		return formattedDate;
	}

	displayTime(hours, minutes, seconds) {
		let timeTemplate = ``;
		hours = this.addZeroIfNeed(hours);
		minutes = this.addZeroIfNeed(minutes);
		
		if (this.fullTime) {
			seconds = this.addZeroIfNeed(seconds);
			timeTemplate = `${hours} : ${minutes} : ${seconds}`;
		} else {
			timeTemplate = `${hours} : ${minutes}`;
		}

		return timeTemplate;
	}

	addZeroIfNeed(val) {

		return val = (val < 10) ? `0${val}` : `${val}`;
	}

	toggleMode() {
		this.mode = ( this.getAttribute('mode') === 'clock' ) ? 'date' : 'clock';
	}
}