let events = []

async function CalendarD() {
    chartLabels = []
    chartData = []
    try {
        events = []

        let res = await fetch(`${SERVER_URL}/weather`);
        weather = await res.json();

        weather.forEach(day => {
            events.push(
                { title: `Típus: ${day.type}`, start: day.date },
                { title: `Min: ${day.min} °C`, start: day.date, backgroundColor: "green" },
                { title: `Max: ${day.max} °C`, start: day.date, backgroundColor: "orange" },

            )
        });

    } catch (err) {
        console.log(err)
        showAlert("Hiba!", "Hiba az adatok lekérdezésében!", "danger")
    }
}


function initCalendar() {
    var DOCcalendar = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(DOCcalendar, {
        initialView: 'dayGridMonth',
        locale: 'hu',
        headerToolbar: {
            left: 'prev,today,next',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        events: events
    });
    calendar.render();
}