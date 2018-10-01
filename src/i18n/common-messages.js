import { defineMessages } from 'react-intl'

export default defineMessages({
  fullName: {
    id: 'common.fullName',
    defaultMessage: 'Фамилия Имя Отчество'
  },
  firstName: {
    id: 'common.firstName',
    defaultMessage: 'Имя'
  },
  lastName: {
    id: 'common.lastName',
    defaultMessage: 'Фамилия'
  },
  middleName: {
    id: 'common.middleName',
    defaultMessage: 'Отчество'
  },
  phone: {
    id: 'common.phone',
    defaultMessage: 'Телефон'
  },
  email: {
    id: 'common.email',
    defaultMessage: 'E-mail'
  },
  remove: {
    id: 'common.remove',
    defaultMessage: 'Удалить'
  },
  cancel: {
    id: 'common.cancel',
    defaultMessage: 'Отменить'
  },
  invite: {
    id: 'common.invite',
    defaultMessage: 'Пригласить'
  },
  createButton: {
    id: 'common.create',
    defaultMessage: 'Создать'
  },
  createRecordButton: {
    id: 'common.create_record',
    defaultMessage: 'Создать запись'
  },
  accessType: {
    id: 'common.label.access_type',
    description: 'Лебл "вид доступа"',
    defaultMessage: 'Вид доступа'
  },
  accessRead: {
    id: 'common.access.read',
    defaultMessage: 'Чтение'
  },
  accessReadWrite: {
    id: 'common.access.read_write',
    defaultMessage: 'Чтение и запись'
  },
  accessUnlimited: {
    id: 'common.access.unlimit',
    defaultMessage: 'Бессрочный доступ'
  },
  confirm: {
    id: 'common.confirm',
    description: 'текст кнопки "подтвердить"',
    defaultMessage: 'подтвердить'
  },
  decline: {
    id: 'common.decline',
    description: 'текст кнопки "отказать"',
    defaultMessage: 'отказать'
  },
  statusActive: {
    id: 'common.status.active',
    description: 'название статуса "активен"',
    defaultMessage: 'активен'
  },
  activePeriodLabel: {
    id: 'common.active_period',
    description: 'лейбл "период действия"',
    defaultMessage: 'Период действия'
  },
  prepositionUntil: {
    id: 'common.preposition.until',
    description: 'предлог "до"',
    defaultMessage: 'до'
  },
  prepositionFrom: {
    id: 'common.preposition.from',
    description: 'предлог "с"',
    defaultMessage: 'с'
  },
  prepositionAt: {
    id: 'common.preposition.at',
    description: 'предлог "в"',
    defaultMessage: 'в'
  },
  editButton: {
    id: 'common.edit',
    description: 'текст кнопки "Изменить"',
    defaultMessage: 'Изменить'
  },
  publish: {
    id: 'common.publish',
    description: 'текст кнопки "Опубликовать"',
    defaultMessage: 'Опубликовать'
  },
  recordDraftStatus: {
    id: 'common.record_draft',
    description: 'текст "Статус записи: черновик"',
    defaultMessage: 'Статус записи: черновик'
  },
  labelChooseSection: {
    id: 'common.form.label.choose_section',
    description: 'Текст лейбла "выберите раздел"',
    defaultMessage: 'Выберите раздел'
  },
  labelSection: {
    id: 'common.form.label.section',
    description: 'Текст лейбла "Раздел"',
    defaultMessage: 'Раздел'
  },
  optionNotChosen: {
    id: 'common.form.label.not_chosen',
    defaultMessage: 'не выбран'
  },
  labelDoctor: {
    id: 'common.form.label.doctor',
    description: 'Текст лейбла "врач"',
    defaultMessage: 'Врач'
  },
  labelRegistry: {
    id: 'common.form.label.registry',
    description: 'Текст лейбла "Регистратура"',
    defaultMessage: 'Регистратура'
  },
  labelExpert: {
    id: 'common.form.label.expert',
    description: 'Текст лейбла "Эксперт по качеству"',
    defaultMessage: 'Эксперт по качеству'
  },
  labelPatient: {
    id: 'common.form.label.patient',
    description: 'Текст лейбла "пациент"',
    defaultMessage: 'Пациент'
  },
  labelMyRecords: {
    id: 'common.form.label.my_records',
    defaultMessage: 'Мои записи'
  },
  labelOrgsRecords: {
    id: 'common.form.label.orgs_records',
    defaultMessage: 'Записи медучреждений'
  },
  labelOrg: {
    id: 'common.form.label.org',
    description: 'Текст лейбла "мед. организация"',
    defaultMessage: 'Мед. организация'
  },
  labelCellStatus: {
    id: 'label.cell_status',
    defaultMessage: 'Статус ячейки'
  },
  labelDate: {
    id: 'common.form.label.date',
    defaultMessage: 'Дата'
  },
  labelAuthor: {
    id: 'common.form.label.author',
    defaultMessage: 'Автор'
  },
  labelPrivateRecords: {
    id: 'common.form.label.private_records',
    defaultMessage: 'Личные записи'
  },
  labelDoctors: {
    id: 'common.form.label.doctors',
    defaultMessage: 'Врачи'
  },
  startsLabel: {
    id: 'common.form.label.starts',
    description: 'Текст лейбла "начало"',
    defaultMessage: 'Начало'
  },
  endsLabel: {
    id: 'common.form.label.ends',
    description: 'Текст лейбла "конец"',
    defaultMessage: 'Конец'
  },
  labelDescription: {
    id: 'common.form.label.description',
    defaultMessage: 'Описание'
  },
  labelLink: {
    id: 'common.form.label.link',
    defaultMessage: 'Ссылка'
  },
  addFormTabsLabel: {
    id: 'add.form.tabs.label',
    description: 'Лебл для табов в окне добавки сущностей',
    defaultMessage: 'Добавить'
  },
  addFormRecordTab: {
    id: 'add.form.tabs.medical_record',
    description: 'Таб добавки медицинской записи',
    defaultMessage: 'запись'
  },
  addFormMedicationTab: {
    id: 'add.form.tabs.medications',
    description: 'Таб добавки приёма лекарств',
    defaultMessage: 'приём лекарств'
  },
  addFormParametersTab: {
    id: 'add.form.tabs.diary',
    description: 'Таб добавки в личный дневник',
    defaultMessage: 'личный дневник'
  },
  addFormEventTab: {
    id: 'add.form.tabs.event',
    description: 'Таб добавки события',
    defaultMessage: 'дело'
  },
  noteLabel: {
    id: 'common.form.note.label',
    description: 'лейбл "примечание"',
    defaultMessage: 'Примечание'
  },
  saveAsDraftBtn: {
    id: 'add.form.btn.save_draft',
    defaultMessage: 'Сохранить как черновик'
  },
  saveBtn: {
    id: 'add.form.btn.save',
    defaultMessage: 'Сохранить'
  },
  recordsFilter: {
    id: 'filter.records',
    defaultMessage: 'Фильтр по записям'
  },
  doctorInfoTitle: {
    id: 'doctor.title.info',
    defaultMessage: 'Информация о враче'
  },
  doctorSpecialtiesTitle: {
    id: 'doctor.title.specialties',
    defaultMessage: 'Специализация'
  },
  doctorServicesTitle: {
    id: 'doctor.title.services',
    defaultMessage: 'Виды обслуживания'
  },
  doctorOrgsTitle: {
    id: 'doctor.title.orgs',
    defaultMessage: 'Медучреждения'
  },
  doctorDiplomasTitle: {
    id: 'doctor.title.diplomas',
    defaultMessage: 'Дипломы'
  },
  orgLicenseTitle: {
    id: 'org.licence.title',
    defaultMessage: 'Лицензия'
  },
  paidServicesTitle: {
    id: 'doctor.title.paid',
    defaultMessage: 'Платные услуги'
  },
  labelQueue: {
    id: 'common.form.label.queue',
    defaultMessage: 'Очередь'
  },
  labelAddress: {
    id: 'common.form.label.address',
    defaultMessage: 'Адрес'
  },
  sortingAlphabetAsc: {
    id: 'common.sorting.alphabet_asc',
    defaultMessage: 'Алфавиту (от А до Я)'
  },
  sortingAlphabetDesc: {
    id: 'common.sorting.alphabet_desc',
    defaultMessage: 'Алфавиту (от Я до А)'
  },
  sortBy: {
    id: 'common.sort_by',
    defaultMessage: 'Сортировать по'
  },
  labelSpecialty: {
    id: 'common.label.specialty',
    defaultMessage: 'Специальность'
  },
  favoriteDoctors: {
    id: 'common.favorite_doctors',
    defaultMessage: 'Избранные врачи'
  },
  recordsPlural: {
    id: 'common.records.plural',
    description: 'N записей',
    defaultMessage: '{count} {count, plural, one {запись} few {записи} other {записей}}'
  },
  patientsReception: {
    id: 'doctor.title.patient_reception',
    defaultMessage: 'Прием пациентов'
  },
  enrollTitle: {
    id: 'doctor.title.enroll',
    defaultMessage: 'Записаться на прием к врачу'
  },
  receptionDuration: {
    id: 'doctor.reception_duration',
    defaultMessage: 'Продолжительность приема {duration} {duration, plural, one {минута} few {минуты} other {минут}}.'
  },
  visitDate: {
    id: 'doctor.label.visit_date',
    defaultMessage: 'Дата посещения'
  },
  chooseQueue: {
    id: 'doctor.label.choose_queue',
    defaultMessage: 'Выберите очередь'
  },
  confirmReceptionDate: {
    id: 'doctor.confirm_reception_date',
    defaultMessage: 'Прием у врача в {weekDay} <br />{date} в {time}'
  },
  enroll: {
    id: 'doctor.actions.enroll',
    defaultMessage: 'Записаться на прием'
  },
  receptionRequest: {
    id: 'doctor.actions.request',
    defaultMessage: 'Заявка на прием'
  },
  grantAccess: {
    id: 'doctor.actions.grant_access',
    defaultMessage: 'Предоставить доступ'
  },
  requestAccess: {
    id: 'common.request_access',
    defaultMessage: 'Запросить доступ'
  },
  enrollPatient: {
    id: 'doctor.enroll_patient',
    description: '"записать на приём" пациента',
    defaultMessage: 'Записать на приём'
  },
  filterPatients: {
    id: 'filter.patients',
    defaultMessage: 'Фильтр по пациентам'
  },
  filterEvents: {
    id: 'filter.events',
    defaultMessage: 'Фильтр по событиям'
  },
  filterDoctors: {
    id: 'filter.events',
    defaultMessage: 'Фильтр по событиям'
  },
  filterOrgs: {
    id: 'filter.orgs',
    defaultMessage: 'Фильтр по организациям'
  },
  sortingActivityDesc: {
    id: 'common.sorting.activity_desc',
    defaultMessage: 'Активности (новые сверху)'
  },
  sortingActivityAsc: {
    id: 'common.sorting.activity_asc',
    defaultMessage: 'Активности (новые внизу)'
  },
  addCardBtn: {
    id: 'common.add_card',
    defaultMessage: 'Добавить карту'
  },
  patientsTitle: {
    id: 'title.patients',
    description: 'Заголовок страницы "Пациенты"',
    defaultMessage: 'Пациенты'
  },
  invitePatient: {
    id: 'doctor.invite_patient',
    defaultMessage: 'Пригласить пациента'
  },
  accessRequested: {
    id: 'common.access_requested',
    defaultMessage: 'Доступ запрошен'
  },
  patientIsMine: {
    id: 'patient.is_mine',
    defaultMessage: 'Мой пациент'
  },
  addPatientBtn: {
    id: 'common.add_patient',
    defaultMessage: 'Добавить пациента'
  },
  addRecordBtn: {
    id: 'common.add_record',
    defaultMessage: 'Добавить запись'
  },
  labelTypeInLastName: {
    id: 'common.label.last_name',
    defaultMessage: 'Введите фамилию'
  },
  labelTypeInFirstName: {
    id: 'common.label.first_name',
    defaultMessage: 'Введите имя'
  },
  labelTypeInMidName: {
    id: 'common.label.mid_name',
    defaultMessage: 'Введите отчество'
  },
  labelTypeInNote: {
    id: 'common.label.note',
    defaultMessage: 'Введите примечание'
  },
  labelBirthDate: {
    id: 'common.label.birth_date',
    defaultMessage: 'Дата рождения'
  },
  labelBlood: {
    id: 'common.label.blood',
    defaultMessage: 'Группа крови'
  },
  labelIin: {
    id: 'common.label.iin',
    defaultMessage: 'ИИН'
  },
  labelGender: {
    id: 'common.label.gender',
    defaultMessage: 'Пол'
  },
  genderMale: {
    id: 'common.gender.male',
    defaultMessage: 'Муж'
  },
  genderFemale: {
    id: 'common.gender.female',
    defaultMessage: 'Жен'
  },
  labelRequestText: {
    id: 'common.label.request_text',
    defaultMessage: 'Текст запроса'
  },
  sendRequestBtn: {
    id: 'common.send_request',
    defaultMessage: 'Отправить запрос'
  },
  nothingFound: {
    id: 'common.nothing_found',
    defaultMessage: 'Ничего не найдено'
  },
  eventsTitle: {
    id: 'common.events.title',
    defaultMessage: 'События'
  },
  tasksLinesTitle: {
    id: 'common.tasks_lines.title',
    defaultMessage: 'Линейки дел'
  },
  tasksListsTitle: {
    id: 'common.tasks_lists.title',
    defaultMessage: 'Списки дел'
  },
  tasksLinesAdd: {
    id: 'common.tasks_lines.add',
    defaultMessage: 'Добавить линейку дел'
  },
  turnOn: {
    id: 'common.turn_on',
    defaultMessage: 'Включить'
  },
  eventStatusDone: {
    id: 'common.event.status.done',
    defaultMessage: 'Выполнено'
  },
  eventStatusNotDone: {
    id: 'common.event.status.not_done',
    defaultMessage: 'Не выполнено'
  },
  eventStatusExpired: {
    id: 'common.event.status.expired',
    defaultMessage: 'Незапланированные'
  },
  eventStatusNotPlanned: {
    id: 'common.event.status.not_planned',
    defaultMessage: 'Просроченные'
  },
  labelTasksList: {
    id: 'common.label.tasks_list',
    defaultMessage: 'Список дел'
  },
  labelEventRemind: {
    id: 'common.label.remind',
    defaultMessage: 'Напомнить о событии'
  },
  labelRemindExact: {
    id: 'common.label.exact',
    defaultMessage: 'В момент наступления события'
  },
  labelRemindHour: {
    id: 'common.label.hour',
    defaultMessage: 'За час до события'
  },
  labelRemind3hours: {
    id: 'common.label.3_hours',
    defaultMessage: 'За 3 часа до события'
  },
  labelRemind10hours: {
    id: 'common.label.10_hours',
    defaultMessage: 'За 10 часов до события'
  },
  labelRemindDay: {
    id: 'common.label.day',
    defaultMessage: 'За день до события'
  },
  labelReminderTypes: {
    id: 'common.label.reminder_types',
    defaultMessage: 'Способ получения уведомления'
  },
  labelReminderTypeEmail: {
    id: 'common.label.reminder_types.email',
    defaultMessage: 'Отправить письмо на почту'
  },
  labelReminderTypeSms: {
    id: 'common.label.reminder_types.sms',
    defaultMessage: 'Получить SMS'
  },
  labelReminderTypePush: {
    id: 'common.label.reminder_types.push',
    defaultMessage: 'Получить Push-уведомление'
  },
  addEventBtn: {
    id: 'common.add_event.btn',
    defaultMessage: 'Добавить дело'
  },
  attachDoctor: {
    id: 'common.attach_doctor',
    defaultMessage: 'Прикрепить врача'
  },
  detach: {
    id: 'common.detach',
    defaultMessage: 'Открепить'
  },
  workersTitle: {
    id: 'workers.title',
    defaultMessage: 'Сотрудники'
  },
  grantAccessToCard: {
    id: 'common.grant_access_to_card',
    defaultMessage: 'Предоставить доступ к медкарте'
  },
  desiredReceptionDays: {
    id: 'common.label.desired_reception_days',
    defaultMessage: 'Желаемые дни приема'
  },
  desiredReceptionTime: {
    id: 'common.label.desired_reception_time',
    defaultMessage: 'Желаемое время'
  },
  additionalReceptionInfo: {
    id: 'common.label.additional_reception_days',
    defaultMessage: 'Дополнительная информация, пожелания'
  },
  receptionRequestTitle: {
    id: 'common.reception.title',
    defaultMessage: 'Заявка на прием к врачу'
  },
  readMore: {
    id: 'common.read_more',
    defaultMessage: 'Читать дальше'
  },
  menuPatients: {
    id: 'menu.patients',
    defaultMessage: 'Для пациентов'
  },
  menuCard: {
    id: 'menu.card',
    defaultMessage: 'Медкарта'
  },
  menuDoctors: {
    id: 'menu.doctors',
    defaultMessage: 'Для врачей'
  },
  menuContacts: {
    id: 'menu.contacts',
    defaultMessage: 'Контакты'
  },
  menuPolicy: {
    id: 'menu.policy',
    defaultMessage: 'Политика безопасности'
  },
  address: {
    id: 'address',
    defaultMessage: '010000, Астана, улица Сыганак, 29, БЦ «Евроцентр»'
  },
  labelDraft: {
    id: 'label.draft',
    defaultMessage: 'Черновик'
  },
  labelPatientFullName: {
    id: 'common.label.patient_full_name',
    defaultMessage: 'Пациент'
  },
  receptionStatusNotConfirmed: {
    id: 'reception.status.not_confirmed',
    defaultMessage: 'Визит заявлен, но не подтвержден'
  },
  receptionStatusConfirmed: {
    id: 'reception.status.confirmed',
    defaultMessage: 'Визит назначен'
  },
  receptionStatusCompleted: {
    id: 'reception.status.completed',
    defaultMessage: 'Визит состоялся'
  },
  receptionStatusMissed: {
    id: 'reception.status.patient_missing',
    defaultMessage: 'Визит пропущен'
  },
  receptionStatusCanceled: {
    id: 'reception.status.canceled',
    defaultMessage: 'Визит отменен'
  },
  receptionStatusCanceledByPatient: {
    id: 'reception.status.canceled_by_patien',
    defaultMessage: 'Визит отменен пациентом'
  },
  labelReceptionStatus: {
    id: 'label.reception.status',
    description: 'лейбл "затус записи" к врачу',
    defaultMessage: 'Статус записи'
  },
  receptionsAndRequestsTitle: {
    id: 'title.receptions_and_requests',
    defaultMessage: 'Заявки и записи на прием'
  },
  createScheduleBtn: {
    id: 'create_schedule',
    defaultMessage: 'Создать расписание'
  },
  receptionsRequestsTitle: {
    id: 'title.receptions_requests',
    defaultMessage: 'Заявки на прием'
  },
  receptionsTitle: {
    id: 'title.receptions',
    defaultMessage: 'Записи на прием'
  },
  collapse: {
    id: 'collapse',
    defaultMessage: 'скрыть'
  },
  expand: {
    id: 'expand',
    defaultMessage: 'раскрыть'
  },
  changeStatus: {
    id: 'change_status',
    defaultMessage: 'изменить статус'
  },
  labelRequestDate: {
    id: 'label.request_date',
    defaultMessage: 'Дата заявки'
  },
  profileTitle: {
    id: 'profile_title',
    defaultMessage: 'Настройка профиля'
  },
  fillProfile: {
    id: 'profile.fill',
    defaultMessage: 'Вам необходимо заполнить профиль.'
  },
  profileModerating: {
    id: 'profile.moderating',
    defaultMessage: 'Ваш аккаунт проходит модерацию'
  },
  personalDataTitle: {
    id: 'profile.personal',
    defaultMessage: 'Персональные данные'
  },
  publicDataTitle: {
    id: 'profile.public',
    defaultMessage: 'Публичные данные'
  },
  labelExperience: {
    id: 'label.experience',
    defaultMessage: 'Стаж (лет)'
  },
  labelAdditionalInfo: {
    id: 'label.additional_info',
    defaultMessage: 'Дополнительная информация'
  },
  labelRegion: {
    id: 'label.region',
    defaultMessage: 'Регион'
  },
  labelCity: {
    id: 'label.city',
    defaultMessage: 'Город'
  },
  labelPassword: {
    id: 'label.password',
    defaultMessage: 'Пароль'
  },
  labelOldPassword: {
    id: 'label.old_password',
    defaultMessage: 'Старый пароль'
  },
  labelNewPassword: {
    id: 'label.new_password',
    defaultMessage: 'Новый пароль'
  },
  labelSecure: {
    id: 'label.secure',
    defaultMessage: 'Надежный'
  },
  labelMedium: {
    id: 'label.medium',
    defaultMessage: 'Средний'
  },
  labelRepeatPassword: {
    id: 'label.repeate',
    defaultMessage: 'Повторите пароль'
  },
  wrongRepeatPassword: {
    id: 'wrong_password_repeat',
    defaultMessage: 'Введено неверно'
  },
  saveChangesBtn: {
    id: 'save_changes_btn',
    defaultMessage: 'Сохранить изменения'
  },
  cancelChangesBtn: {
    id: 'cancel_changes_btn',
    defaultMessage: 'Отменить изменения'
  },
  loginDataTitle: {
    id: 'title.login_data',
    defaultMessage: 'Данные входа в систему'
  },
  specialty: {
    id: 'label.specialty',
    defaultMessage: 'Специальность'
  },
  subscriptionsTitle: {
    id: 'subscriptions.title',
    defaultMessage: 'Подписки и уведомления'
  },
  labelSubscribe: {
    id: 'label.subscribe',
    defaultMessage: 'Подписаться на рассылки и уведомления'
  },
  labelDiseases: {
    id: 'label.diseases',
    defaultMessage: 'Болезни по справочнику'
  },
  labelContraindications: {
    id: 'label.contraindications',
    defaultMessage: 'Противопоказания, аллергии на лекарства'
  },
  labelChronic: {
    id: 'label.chronic',
    defaultMessage: 'Хронические заболевания'
  },
  labelDrugs: {
    id: 'label.drugs',
    defaultMessage: 'Принимаемые препараты'
  },
  labelBloodRhesus: {
    id: 'label.blood_rhesus',
    defaultMessage: 'Группа крови и резус-фактор'
  },
  labelEventStatus: {
    id: 'label.event_status',
    defaultMessage: 'Статус дела'
  },
  labelType: {
    id: 'label.type',
    defaultMessage: 'Тип'
  },
  labelPatientFio: {
    id: 'label.patient_fio',
    defaultMessage: 'ФИО пациента'
  },
  labelFree: {
    id: 'label.free',
    defaultMessage: 'Свободна'
  },
  labelVisitNotConfirmed: {
    id: 'label.visit_not_confirmed',
    defaultMessage: 'Визит не подтвержден'
  },
  labelScheduleDuration: {
    id: 'label.schedule_duration',
    defaultMessage: 'Продолжительность приема'
  },
  labelTimeoutDuration: {
    id: 'label.timeout_duration',
    defaultMessage: 'Перерыв между приемами'
  },
  selfEnrollConditions: {
    id: 'label.self_enroll_conditions',
    defaultMessage: 'Условия самозаписи пациентов'
  },
  medicalCardTitle: {
    id: 'cap.medical_card.title',
    defaultMessage: 'Медицинская карта'
  },
  labelDateTime: {
    id: 'common.label.datetime',
    defaultMessage: 'Дата и время'
  },
  signIn: {
    id: 'common.sign_in',
    defaultMessage: 'Войти'
  },
  authorizationTitle: {
    id: 'common.authorization_title',
    defaultMessage: 'Авторизация'
  },
  registrationTitle: {
    id: 'common.registration_title',
    defaultMessage: 'Регистрация'
  },
  restorePassword: {
    id: 'common.restore_password',
    defaultMessage: 'Восстановить пароль'
  },
  labelPhoneOrEmail: {
    id: 'common.label.phone_or_email',
    defaultMessage: 'Номер телефона или e-mail'
  },
  signUpBtn: {
    id: 'common.sign_up_btn',
    defaultMessage: 'Зарегистрироваться'
  },
  goToCabinet: {
    id: 'common.go_to_cabinet',
    defaultMessage: 'В кабинет'
  },
  createCard: {
    id: 'create_medical_card',
    defaultMessage: 'Завести медкарту'
  },
  accessDenied: {
    id: 'access_denied',
    defaultMessage: 'Нет доступа'
  },
  labelSearch: {
    id: 'label.search',
    defaultMessage: 'Поиск'
  },
  labelOrgs: {
    id: 'label.orgs',
    defaultMessage: 'Организации'
  },
  diplomaNumberTitle: {
    id: 'diploma.number.title',
    defaultMessage: 'Номер диплома'
  },
  diplomaYearTitle: {
    id: 'diploma.year.title',
    defaultMessage: 'Год выпуска'
  },
  diplomaSchoolTitle: {
    id: 'diploma.school.title',
    defaultMessage: 'Учебное заведение'
  },
  diplomaDescriptionTitle: {
    id: 'diploma.description.title',
    defaultMessage: 'Описание'
  },
  licenseNumberTitle: {
    id: 'license.number.title',
    defaultMessage: 'Номер лицензии'
  },
  licenseYearTitle: {
    id: 'license.year.title',
    defaultMessage: 'Дата лицензии'
  }
})
