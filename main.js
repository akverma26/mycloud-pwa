window.onload = () => {
    initUI();
}

const showElement = (selector, flex = true) => {
    if (flex) {
        $(selector).css({ display: 'flex' });
    } else {
        $(selector).show();
    }
}

const changeDisplayContainer = (container) => {
    $(".container").hide()
    showElement(container);
}

const initUI = () => {
    $(".main").css({
        'margin-top': $("header")[0].offsetHeight
    });
    showElement(".main");
    changeDisplayContainer(".navigation-container");
    // changeDisplayContainer(".list-today-schedule-container");
}

$('header').click(() => {
    initUI();
})

const getISTTime = (datetime) => {
    return new Date(datetime).toString();
}

$('.navigation-container button').click((event) => {
    let container = $(event.target).attr('for');
    if (container == ".settings") {
        if ($(container).css('display') == 'none') $(container).show();
        else $(container).hide();
        return;
    }
    changeDisplayContainer(container);
    if (container === '.list-today-schedule-container') {
        listTodaysSchedule(event);
    }
})

$(".new-schedule-container button").click(() => {
    showLoader();
    let title = $(".new-schedule-container input#title").val();
    let description = $(".new-schedule-container input#description").val();
    let schedule_at = $(".new-schedule-container input#schedule-time").val().replace("T", " ") + " +0530";
    let notify_from = $(".new-schedule-container input#notify-from").val().replace("T", " ") + " +0530";
    fetchFromAPI(
        '/schedule/save-schedule', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                schedule_at,
                notify_from
            }),
        }
    )
        .then((res) => res.text())
        .then((res) => {
            $(".new-schedule-container .status").html(res);
            hideLoader();
        })
        .catch((err) => {
            $(".new-schedule-container .status").html(err);
            hideLoader();
        })
})

const listTodaysSchedule = (event) => {
    let url = '/schedule/todays-schedules';
    let header = 'Todays Schedules';
    if (event.target.id == "list-all-schedules") {
        url = '/schedule/list-schedules';
        header = 'All Schedules';
    }
    showLoader();
    fetchFromAPI(url)
        .then((res) => res.text())
        .then((res) => {
            res = JSON.parse(res);
            let schedules = res.schedules;
            if (res.schedules) {
                schedules = schedules.map((s) => `
                <div class="schedule">
                    <div class="title">${s.title}</div>
                    <div class="description">${s.description}</div>
                    <div class="schedule-at">${getISTTime(s.schedule_at)}</div>
                    <div class="notify-from">${getISTTime(s.notify_from)}</div>
                    <div class="status">${s.status}</div>
                </div>
                `).join("");
            }
            $(".list-today-schedule-container").html(`<h1>${header} :</h1>${schedules}`);
            hideLoader();
        })
        .catch((err) => {
            $(".list-today-schedule-container").html(`<h1>${header} :</h1>${err}`);
            hideLoader();
        })
}