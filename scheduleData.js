const callsScheduleDefault = [
  { lessonNumber: 1, start: '08:15', end: '09:00' },
  { lessonNumber: 2, start: '09:10', end: '09:55' },
  { lessonNumber: 3, start: '10:05', end: '10:50' },
  { lessonNumber: 4, start: '11:05', end: '11:50' },
  { lessonNumber: 5, start: '12:00', end: '12:45' },
  { lessonNumber: 6, start: '13:05', end: '13:45' },
  { lessonNumber: 7, start: '13:55', end: '14:40' }
];

const callsScheduleThursday = [
  { lessonNumber: 1, start: '08:30', end: '09:15' },
  { lessonNumber: 2, start: '09:25', end: '10:10' },
  { lessonNumber: 3, start: '10:20', end: '11:05' },
  { lessonNumber: 4, start: '11:15', end: '12:00' },
  { lessonNumber: 5, start: '12:10', end: '12:55' },
  { lessonNumber: 6, start: '13:05', end: '13:50' },
  { lessonNumber: 7, start: '14:00', end: '14:45' }
];

const lessonsByDay = {
  "Понедельник": [
    { lessonNumber: 1, subject: 'Химия (36)' },
    { lessonNumber: 2, subject: 'Бел лит (38)' },
    { lessonNumber: 3, subject: 'Информатика/Англ (21/22)' },
    { lessonNumber: 4, subject: 'Физ-ра' },
    { lessonNumber: 5, subject: 'Англ/Информатика (35а/22)' },
    { lessonNumber: 6, subject: 'Труд (оператор ЭВМ) (22)' },
    { lessonNumber: 7, subject: 'Труд (оператор ЭВМ) (22)' }
  ],
  "Вторник": [
    { lessonNumber: 1, subject: 'Геометрия (29)' },
    { lessonNumber: 2, subject: 'Рус мова (37)' },
    { lessonNumber: 3, subject: 'Рус лит (37)' },
    { lessonNumber: 4, subject: 'Биалогия (35)' },
    { lessonNumber: 5, subject: 'Всемирная история (29)' },
    { lessonNumber: 6, subject: 'Физика(33)' }
  ],
  "Среда": [
    { lessonNumber: 1, subject: 'Общество (29)' },
    { lessonNumber: 2, subject: 'Алгебра (29)' },
    { lessonNumber: 3, subject: 'Англ мова (32/35а)' },
    { lessonNumber: 4, subject: 'Физ-ра' },
    { lessonNumber: 5, subject: 'Окошко' },
    { lessonNumber: 6, subject: 'Труд (оператор ЭВМ) (22)' },
    { lessonNumber: 7, subject: 'Труд (оператор ЭВМ) (22)' }
  ],
  "Четверг": [
    { lessonNumber: 1, subject: 'География (33)' },
    { lessonNumber: 2, subject: 'допризыв/мед' },
    { lessonNumber: 3, subject: 'Геометрия (29)' },
    { lessonNumber: 4, subject: 'Бел мова (38)' },
    { lessonNumber: 5, subject: 'Химия (36)' },
    { lessonNumber: 6, subject: 'Бел лит (38)' }
  ],
  "Пятница": [
    { lessonNumber: 1, subject: 'Биология (35)' },
    { lessonNumber: 2, subject: 'Астрономия (33)' },
    { lessonNumber: 3, subject: 'Алгебра (29)' },
    { lessonNumber: 4, subject: 'История Бел (29)' },
    { lessonNumber: 5, subject: 'Рус мова (37)' },
    { lessonNumber: 6, subject: 'Труд (оператор ЭВМ)' },
    { lessonNumber: 7, subject: 'Труд (оператор ЭВМ)' }
  ],
  "Суббота": [],
  "Воскресенье": []
};

function parseTime(t) {
  let parts = t.split(':').map(Number);
  let d = new Date();
  d.setHours(parts[0], parts[1], 0, 0);
  return d;
}

function getCallsScheduleForDay(dayName) {
  if (dayName === "Суббота" || dayName === "Воскресенье") {
    return [];
  }
  return dayName === "Четверг" ? callsScheduleThursday : callsScheduleDefault;
}

function getCurrentSession(schedule) {
  let now = new Date();
  for (let i = 0; i < schedule.length; i++) {
    let st = parseTime(schedule[i].start);
    let en = parseTime(schedule[i].end);
    if (now >= st && now < en) return { session: schedule[i], endTime: en };
  }
  return null;
}

function getNextSession(schedule) {
  let now = new Date();
  for (let i = 0; i < schedule.length; i++) {
    let st = parseTime(schedule[i].start);
    if (now < st) return schedule[i];
  }
  return null;
}

function updateCurrentLesson() {
  let dEl = document.getElementById('currentLesson');
  if (!dEl) return;
  let now = new Date();
  let days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
  let dayName = days[now.getDay()];
  
  // Если сегодня суббота или воскресенье, выводим сообщение "Сегодня уроков нет"
  if (dayName === "Суббота" || dayName === "Воскресенье") {
    dEl.innerHTML = `<div>Сегодня уроков нет</div>`;
    return;
  }
  
  let schedule = getCallsScheduleForDay(dayName);
  let tLessons = lessonsByDay[dayName] || [];
  let tLessonsStripped = tLessons.map(item => ({
    ...item,
    subject: item.subject.replace(/\s*\(.*?\)/, '')
  }));
  let curr = getCurrentSession(schedule);
  let next = getNextSession(schedule);
  let output = '';
  
  if (curr) {
    let remainMs = curr.endTime - now;
    let min = Math.floor(remainMs / 60000);
    let sec = Math.floor((remainMs % 60000) / 1000);
    let cl = tLessonsStripped.find(x => x.lessonNumber === curr.session.lessonNumber);
    let lessonDisplay = cl ? cl.subject : `Урок ${curr.session.lessonNumber}`;
    output += `<div>Сейчас: ${lessonDisplay}</div>`;
    output += `<div>Конец через: ${min} мин ${sec} сек</div>`;
    if (next) {
      let nl = tLessons.find(x => x.lessonNumber === next.lessonNumber);
      let nextDisplay = nl ? `${next.lessonNumber}. ${nl.subject}` : `Урок ${next.lessonNumber}`;
      output += `<div>Следующий: ${nextDisplay}</div>`;
    } else {
      output += `<div>Уроков больше нет</div>`;
    }
  } else {
    if (next) {
      output += `<div>Сейчас: перемена</div>`;
      let st = parseTime(next.start);
      let remainMs = st - now;
      let min = Math.floor(remainMs / 60000);
      let sec = Math.floor((remainMs % 60000) / 1000);
      let nl = tLessons.find(x => x.lessonNumber === next.lessonNumber);
      let nextDisplay = nl ? `${next.lessonNumber}. ${nl.subject}` : `Урок ${next.lessonNumber}`;
      output += `<div>Начнется через: ${min} мин ${sec} сек</div>`;
      output += `<div>Следующий: ${nextDisplay}</div>`;
    } else {
      output += `<div>Уроков больше нет</div>`;
    }
  }
  dEl.innerHTML = output;
}

setInterval(updateCurrentLesson, 1000);
