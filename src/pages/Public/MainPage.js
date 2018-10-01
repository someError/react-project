import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedHTMLMessage, FormattedMessage, defineMessages, injectIntl } from 'react-intl'

import Button from '../../components/Button'
import FeatherIcon from '../../components/Icons/FeatherIcon'
import Modal, { ModalBody } from '../../components/Modal'
import Map from '../../components/Map/Map'

import commonIntlMessages from '../../i18n/common-messages'
// import LangSwitcher from '../../i18n/Switcher'

import './MainPage.css'

const intlMessages = defineMessages({
  momsTitle: {
    id: 'landing.modal.title.moms',
    defaultMessage: 'Молодым мамам'
  },
  parentsTitle: {
    id: 'landing.modal.title.parents',
    defaultMessage: 'Заботливым родителям'
  },
  childrenTitle: {
    id: 'landing.modal.title.children',
    defaultMessage: 'Детям пожилых родителей'
  },
  healthyTitle: {
    id: 'landing.modal.title.healthy',
    defaultMessage: 'Абсолютно здоровым людям'
  },
  almostHealthyTitle: {
    id: 'landing.modal.title.almostHealthy',
    defaultMessage: 'Практически здоровым людям'
  },
  diagnoseTitle: {
    id: 'landing.modal.title.diagnose',
    defaultMessage: 'Пациентам с беспокоящим их диагнозом'
  },
  staffTitle: {
    id: 'landing.modal.title.staff',
    defaultMessage: 'Врачам и медперсоналу'
  },
  criticalTitle: {
    id: 'landing.modal.title.critical',
    defaultMessage: 'Пользователям "критического" возраста'
  },
  chronoTitle: {
    id: 'landing.modal.title.chrono',
    defaultMessage: 'Хроническим больным'
  },
  invalidTitle: {
    id: 'landing.modal.title.invalid',
    defaultMessage: 'Временно нетрудоспособным и инвалидам'
  },
  riskTitle: {
    id: 'landing.modal.title.risk',
    defaultMessage: 'Тем, чьи жизнь и деятельность связаны с постоянным риском'
  },
  notHomeTitle: {
    id: 'landing.modal.title.not_home',
    defaultMessage: 'Временно пребывающим вне дома'
  },
  foreignTitle: {
    id: 'landing.modal.title.foreign',
    defaultMessage: 'Выезжающим на лечение за рубеж'
  },
  animalsTitle: {
    id: 'landing.modal.title.animals',
    defaultMessage: 'Владельцам домашних животных'
  },
  aboutTitle: {
    id: 'landing.modal.title.about',
    defaultMessage: 'О проекте'
  }
})

const MODAL_DATA = {
  moms: {
    title: intlMessages.momsTitle,
    text: <div>
      <FormattedHTMLMessage id='landing.modal.text.moms' defaultMessage='<p>Будущие мамы с начала беременности должны регулярно посещать врачей, делать обследования и т.д.
        Возможны обследования и до беременности, если она – планируемая. После родов многие из них продолжают
        следить за своим здоровьем – нужно привести себя в первоначальный вид, могут быть осложнения после родов
        и т.д. Ведение медицинской карты позволит им «мониторить» нужные параметры и принимать меры для
        приведения их в норму.</p>
      <p>Молодые мамы (и папы)! Лучшее, что вы можете сделать для своего ребенка, - это позаботиться о его
        здоровье. У вас есть прекрасная возможность - с помощью сервиса phr.kz завести медицинскую карту на
        своего ребенка сразу же после его рождения. Здесь вы можете хранить результаты анализов, прививок и
        других обследований вашего ребенка, информацию о его заболеваниях и аллергиях, рекомендации педиатров и
        медсестер, а также всё, что вам будет интересно потом вспоминать, – например, когда ребенок начал
        держать головку; когда у него появился первый зуб; когда и какие слова он впервые произнес; когда встал,
        пошел и т.д.</p>
      <p>Эта база данных поможет вашему ребенку вырасти здоровым и сильным, а в дальнейшем при пользовании
        услугами врачей избежать множества врачебных ошибок.</p>' />
    </div>
  },
  parents: {
    title: intlMessages.parentsTitle,
    text: <div>
      <FormattedHTMLMessage id='landing.modal.text.parents' defaultMessage='<p>Независимо от возраста вашего ребенка сервис phr.kz предлагает вам постоянно, тщательно и эффективно следить за его здоровьем. Для этого вы можете создать и вести его медицинскую карту, регулярно внося туда результаты анализов, прививок и других обследований вашего ребенка, информацию о его заболеваниях и аллергиях, росте и весе, рекомендации педиатров и медсестер, а также всё, что вам будет интересно потом вспоминать.</p>
      <p>Повзрослев, ваш ребенок сможет продолжить это сам.</p>' />
    </div>
  },
  children: {
    title: intlMessages.childrenTitle,
    text: <div>
      <FormattedHTMLMessage id='landing.modal.text.children' defaultMessage='<p>Те, кто имеют родителей, как правило, готовы отдать всё, лишь бы они как можно дольше были живы и, по возможности, здоровы. Чем старше становятся люди, тем больше у них накапливается результатов обследований, аллергий, хронических заболеваний и т.д.</p>
      <p>Медицинская карта, которую будут вести для родителей на phr.kz их дети, обязательно поможет им продлить жизнь.</p>' />
    </div>
  },
  healthy: {
    title: intlMessages.healthyTitle,
    text: <div>
      <FormattedHTMLMessage id='landing.modal.text.healthy' defaultMessage='<p>Именно такие люди хорошо понимают, что их положение в обществе и роль в семье напрямую зависят от поддержания своего состояния здоровья. Они тщательно следят за своим здоровьем и регулярно проходят профилактические обследования.</p>
      <p>Сравнение результатов обследований, которое возможно в медицинской карте, позволит им вовремя заметить изменения какого-либо параметра, а также получать качественные консультации врачей через phr.kz или лично.</p>' />
    </div>
  },
  almostHealthy: {
    title: intlMessages.almostHealthyTitle,
    text: <div>
      <FormattedHTMLMessage id='landing.modal.text.almostHealthy' defaultMessage='<p>Часто людей в себе что-то не устраивает, и они стараются следить за своим состоянием: вес, морщины, сексуальные аспекты и т.д. Для поддержания хорошей формы люди следуют диете, посещают фитнесс-клубы, занимаются спортом или профилактикой здоровья.</p>
      <p>Ведение медицинской карты позволит легко «мониторить» соответствующие параметры и принимать меры для приведения их в норму.</p>' />
    </div>
  },
  diagnose: {
    title: intlMessages.diagnoseTitle,
    text: <div>
      <FormattedHTMLMessage id='landing.modal.text.diagnose' defaultMessage='<p>Как правило, больные обследуются в разных местах и консультируются у разных врачей, в том числе, и за пределами города, где они живут, и за рубежом.</p>
      <p>Создав медицинскую карту на сервисе phr.kz, внеся туда результаты обследований и дав разрешение соответствующему врачу ознакомиться с требуемыми записями из медицинской карты, они смогут получить профессиональную и качественную консультацию независимо от места нахождения этого врача. Если вы захотите проконсультироваться за рубежом или посетить зарубежных специалистов, требуемые записи вашей карты (по вашему желанию) можно перевести на соответствующие языки.</p>' />
    </div>
  },
  staff: {
    title: intlMessages.staffTitle,
    text: <div>
      <FormattedHTMLMessage id='landing.modal.text.staff' defaultMessage='<p>Врачи и мед.персонал более чем кто-либо информированы о необходимости профилактических обследований и лечении выявленных нарушений и знают не понаслышке, как важно постоянно следить за состоянием своего здоровья.</p>
      <p>Став пользователем phr.kz и активно ведя собственную электронную медицинскую карту, врач не только поможет собственному лечению, но и покажет своим пациентам пример ответственного отношения к здоровью.</p>' />
    </div>
  },
  critical: {
    title: intlMessages.criticalTitle,
    text: <div>
      <FormattedHTMLMessage id='landing.modal.text.critical' defaultMessage='<p>Врачи считают, что мужчины после 40 и женщины «критического возраста» (перед, во время и после климактерического периода) должны регулярно проходить обследования и обращаться к специалистам.</p>
      <p>Им необходимо ведение медицинской карты, чтобы отодвинуть старость и продолжать вести активную жизнь.</p>' />
    </div>
  },
  chrono: {
    title: intlMessages.chronoTitle,
    text: <div>
      <FormattedHTMLMessage id='landing.modal.text.chrono' defaultMessage='<p>Хронические больные (гемофилики, диабетики и др.) вынуждены непрерывно следить за состоянием своего здоровья, регулярно проводить многочисленные обследования и постоянно наблюдаться у врача.</p>
      <p>Только электронная медицинская карта поможет им не являться к врачам с портфелями бумажных обследований.</p>' />
    </div>
  },
  invalid: {
    title: intlMessages.invalidTitle,
    text: <div>
      <FormattedHTMLMessage id='landing.modal.text.invalid' defaultMessage='<p>Эта категория людей временно или постоянно нуждается в интенсивной помощи врачей.</p>
      <p>Ведение электронной медицинской карты поможет и им самим, и их врачам в борьбе за их здоровье.</p>' />
    </div>
  },
  risk: {
    title: intlMessages.riskTitle,
    text: <div>
      <FormattedHTMLMessage id='landing.modal.text.risk' defaultMessage='<p>К этой категории относятся военные, пожарники, МЧС, летчики, альпинисты, каскадеры, артисты цирка, спортсмены и т.д. В связи с постоянным риском травм, этим людям просто необходимо внести в медицинскую карту хотя бы жизненно важную информацию (группу крови и резус, аллергии, перенесенные и хронические заболевания, принимаемые лекарства, результаты последних обследований).</p>
      <p>Это может существенно ускорить восстановление людей этой категории в случае необходимости оказания им медицинской помощи.</p>' />
    </div>
  },
  notHome: {
    title: intlMessages.notHomeTitle,

    text: <div>
      <FormattedHTMLMessage id='landing.modal.text.notHome' defaultMessage='<p>В случае возникновения экстренных ситуаций наличие электронной медицинской карты позволит этим людям:</p>
      <p>
      - считывать жизненно важную информацию из их карты;<br />
      - предоставлять эту информацию соответствующей клинике (врачу),предварительно, при желании владельца карты, переведя эту информацию на требуемый язык.
      </p>' />
    </div>
  },
  foreign: {
    title: intlMessages.foreignTitle,
    text: <div>
      <FormattedHTMLMessage id='landing.modal.text.foreign' defaultMessage='<p>Это те, кто выезжают за рубеж с одной из двух целей:</p>
      <p>
      - лечебно-оздоровительный туризм (спа-курорты, талассотерапия и т.д.), при котором процедуры должны следовать принципу «не навреди», а потому требуют информации о здоровье клиента, которую удобно представить в виде электронной медицинской карты;<br />
      - лечение за рубежом, где необходимы результаты предварительных обследований с указанием диагноза, в любом объеме размещаемые в медицинской карте, причем, при желании пациента, с переводом на язык соответствующей страны.
      </p>' />
    </div>
  },
  animals: {
    title: intlMessages.animalsTitle,
    text: <div>
      <FormattedHTMLMessage id='landing.modal.text.animals' defaultMessage='<p>Хозяева могут вести медицинские карты своих любимцев (осмотр их врачами, прием лекарств, выписки после операций и т.д.)</p>' />
    </div>
  },
  aboutProject: {
    title: intlMessages.aboutTitle,
    text: <div>
      <FormattedHTMLMessage id='landing.modal.text.about' defaultMessage='<p>Проект организован с целью информационной поддержки медицинского обслуживания. phr.kz - это web-площадка для обмена медицинской информацией между врачами и медицинскими учреждениями, с одной стороны, и пациентами, с другой. Работа phr.kz ориентирована на потребности тех, кто лечит, и тех, кто лечится.</p>
      <p>Пациент и врач могут взаимодействовать через phr.kz почти так же, как реальном мире. Пациент рассказывает о проблеме, врач дает рекомендации, отправляет на обследование, ставит диагноз. Личная медицинская информация, включая консультации врача, электронную медицинскую карту, надежно и конфиденциально хранится в архиве пациента.</p>' />
    </div>
  }
}

const TABS_HASH = [
  '#forPatients',
  '#forDoctors',
  '#forOrgs'
]

class MainPage extends Component {
  constructor (props) {
    const { hash } = props.location

    super()
    this.state = {
      showModal: null,
      showMenu: false,
      tab: TABS_HASH.indexOf(hash) < 0 ? '#forPatients' : hash
    }
  }

  componentDidMount () {
    if (this.props.location.hash) {
      this.navigateToHash(this.props.location.hash)
    }
  }

  componentDidUpdate (prevProps) {
    const { hash } = this.props.location

    if (prevProps.location.hash !== hash) {
      this.navigateToHash(hash)
    }
  }

  navigateToHash (hash) {
    if (TABS_HASH.indexOf(hash) > -1) {
      this.setState({
        tab: hash
      })

      this.whomBlock.scrollIntoView({
        behavior: 'smooth'
      })
    }

    if (hash === '#contacts') {
      this.contactsBlock.scrollIntoView({
        behavior: 'smooth'
      })
    }

    if (hash === '#card') {
      this.cardBlock.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }

  render () {
    const isLoggedIn = !!this.props.user.id

    const { intl } = this.props

    return <div>
      <div className='container-white'>
        <div className='promo'>
          <div className='promo-wrapper'>
            <div className='promo-wave' />
            <div className='container--lg'>
              <div className='promo-img'>
                <img src={require('../../images/static/promo.png')} alt='' />
              </div>
              <div className='container'>
                <div className='promo-text'>
                  {/* <div className='landing-lang-container'> */}
                  {/* <LangSwitcher className='landing-lang' /> */}
                  {/* </div> */}
                  <h2><FormattedMessage id='landing.platform.title' defaultMessage='Персональная телемедицинская платформа' /></h2>
                  {/* <div className='promo-text__teaser'> */}
                  {/* <FormattedMessage */}
                  {/* id='landing.platform.text' */}
                  {/* defaultMessage='Наш сервис — это целая система взаимодействия, выстроенная между */}
                  {/* пациентами, врачами и медицинскими учреждениями. Мы заботимся о вашем здоровье, поэтому помогаем вам */}
                  {/* всегда оставаться на связи с вашим врачом, попадать на приём, минуя долгие очереди и бережно храним */}
                  {/* вашу медицинскую информацию.' */}
                  {/* /> */}
                  {/* </div> */}
                  {/* <a href='#' onClick={() => { this.setState({ showModal: MODAL_DATA['aboutProject'] }) }} className='promo-text__link'>{ intl.formatMessage(commonIntlMessages.readMore) }</a> */}
                  {/* <br /> */}

                  {
                    !isLoggedIn
                      ? <Button to='#registration' className='btn-main-page' size='lg' white>{ intl.formatMessage(commonIntlMessages.signUpBtn) }</Button>
                      : <Button to='/cabinet' className='btn-main-page' size='lg' white>{ intl.formatMessage(commonIntlMessages.goToCabinet) }</Button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-flex'>
          <div className='screen-browser'><img src={require('../../images/static/screen-browser-full-inner.png')} alt='' />
          </div>
          <div className='container'>
            <div className='tabs tabs-widget'>
              <form ref={(el) => { this.whomBlock = el }}>
                <input className='tabs-input' id='tab-one' type='radio' name='grp' onChange={() => { this.props.history.push('#forPatients') }} checked={this.state.tab === '#forPatients'} />
                <label id='forPatients' className='tab tab-one' htmlFor='tab-one'>
                  <FeatherIcon icon='tab1' size={60} />
                  <br />
                  { intl.formatMessage(commonIntlMessages.menuPatients) }
                </label>
                <div className='tab-content'>
                  <FormattedHTMLMessage
                    id='landing.text.for_patients'
                    defaultMessage='Найдите подходящего врача или клинику, минуя очереди в регистратурах, избавьтесь от необходимости
                      проходить одни и те же процедуры, получайте консультации, не посещая врачей.
                      <ul class="list-round">
                        <li>Онлайн-запись на приём к специалистам</li>
                        <li>Получение экспертного мнения от нескольких специалистов</li>
                        <li>Полный доступ к личной медкарте</li>
                        <li>Доступ с любого устройства</li>
                      </ul>'
                  />

                  {
                    !isLoggedIn
                      ? <Button
                        to={{
                          hash: '#registration',
                          state: {
                            type: 'patient'
                          }
                        }}
                        className='btn-main-page' size='lg'>{ intl.formatMessage(commonIntlMessages.signUpBtn) }</Button>
                      : null
                  }

                </div>
                <input className='tabs-input' id='tab-two' type='radio' name='grp' onChange={() => { this.props.history.push('#forDoctors') }} checked={this.state.tab === '#forDoctors'} />
                <label id='forDoctors' className='tab tab-two' htmlFor='tab-two'>
                  <FeatherIcon icon='tab2' size={60} />
                  <br />
                  { intl.formatMessage(commonIntlMessages.menuDoctors) }
                </label>
                <div className='tab-content'>
                  <FormattedHTMLMessage
                    id='landing.text.for_doctors'
                    defaultMessage='Предложите свои услуги пользователям сервиса! Удобная система отзывов и рекомендаций поможет увеличить
                      количество ваших пациентов, а благодаря возможности прямого диалога с пациентами в рамках сервиса PHR
                      часть работы вы сможете выполнять дистанционно, при этом зная, кто и в какое время записан к вам на
                      приём.
                      <ul class="list-round">
                        <li>Доступ к необходимым данным пациента даже из других клиник</li>
                        <li>Возможность дистанционного контроля выздоровления</li>
                        <li>Планирование и организация очередей</li>
                      </ul>'
                  />

                  {
                    !isLoggedIn
                      ? <Button
                        to={{
                          hash: '#registration',
                          state: {
                            type: 'doctor'
                          }
                        }}
                        className='btn-main-page' size='lg'>{ intl.formatMessage(commonIntlMessages.signUpBtn) }</Button>
                      : null
                  }
                </div>

                <input className='tabs-input' id='tab-three' type='radio' name='grp' onChange={() => { this.props.history.push('#forOrgs') }} checked={this.state.tab === '#forOrgs'} />
                <label className='tab tab-three' htmlFor='tab-three'>
                  <FeatherIcon icon='tab3' size={60} />
                  <br />
                  <FormattedMessage id='landing.title.for_orgs' defaultMessage='Для учреждений' />
                </label>
                <div className='tab-content'>
                  <FormattedHTMLMessage
                    id='landing.text.for_orgs'
                    defaultMessage='Создайте редактируемую страницу учреждения с указанием положения на карте, перечнем врачей с личной
                      страницей для каждого, прейскурантом услуг, а также расписанием работы и возможностью записи к
                      специалистам, отслеживайте качество работы сотрудников по отзывам и оценкам, публикуйте статьи и
                      научные материалы, храните электронные версии медицинских документов в сервисе PHR.
                      <ul class="list-round">
                        <li>Собственная страница учреждения в рамках сервиса</li>
                        <li>Управление расписанием и записью пациентов</li>
                        <li>Электронный архив документов учреждения</li>
                      </ul>'
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div ref={(el) => { this.cardBlock = el }} id='forMed' className='container-flex container--lg med-card'>
          <div className='container'>
            <div className='med-card__text'>
              <h2 className='title-h2-light'>
                <FormattedMessage
                  id='landing.card.title'
                  defaultMessage='Персональная электронная медкарта'
                />
              </h2>
              <FormattedMessage
                id='landing.card.text'
                defaultMessage='Персональная Электронная Медицинская Карта (ПЭМК или просто медкарта) — электронный аналог обычной
                  медицинской карты пациента. Это хранилище записей, каждая из которых содержит информацию медицинского
                  характера: диагноз, прием лекарств, результат лабораторных исследований, медицинские показатели и т.д. В
                  отличие от бумажных карт, информация в ПЭМК всегда доступна и понятна для пациента, а врачам нет
                  необходимости отправлять человека на одни и те же процедуры, пройденные в другой клинике. При этом данные
                  строго конфиденциальны и предоставляются только с разрешения пациента.'
              />
            </div>
          </div>
          <div className='doctor-right'><img src={require('../../images/static/doctor.png')} alt='' /></div>
        </div>
        <div className='section-shadow iphone-bg'>
          <div className='container'>
            <div className='who-med-card'>
              <h2 className='title-h2-light'>
                <FormattedMessage
                  id='landing.users.title'
                  defaultMessage='Кому необходима медкарта?'
                />
              </h2>
              <ul className='list-dashed'>
                <li><a href='javascript:;' onClick={() => { this.setState({showModal: MODAL_DATA['moms']}) }}>{ intl.formatMessage(MODAL_DATA.moms.title) }</a></li>
                <li><a href='javascript:;' onClick={() => { this.setState({showModal: MODAL_DATA['parents']}) }}>{ intl.formatMessage(MODAL_DATA.parents.title) }</a>
                </li>
                <li><a href='javascript:;' onClick={() => { this.setState({showModal: MODAL_DATA['children']}) }}>{ intl.formatMessage(MODAL_DATA.children.title) }
                  родителей</a></li>
                <li><a href='javascript:;' onClick={() => { this.setState({showModal: MODAL_DATA['healthy']}) }}>{ intl.formatMessage(MODAL_DATA.healthy.title) }
                  людям</a></li>
                <li><a href='javascript:;' onClick={() => { this.setState({showModal: MODAL_DATA['almostHealthy']}) }}>{ intl.formatMessage(MODAL_DATA.almostHealthy.title) }
                  людям</a></li>
                <li><a href='javascript:;' onClick={() => { this.setState({showModal: MODAL_DATA['staff']}) }}>{ intl.formatMessage(MODAL_DATA.staff.title) }</a></li>
                <li><a href='javascript:;' onClick={() => { this.setState({showModal: MODAL_DATA['diagnose']}) }}>{ intl.formatMessage(MODAL_DATA.diagnose.title) }</a></li>
                <li><a href='javascript:;' onClick={() => { this.setState({showModal: MODAL_DATA['critical']}) }}>{ intl.formatMessage(MODAL_DATA.critical.title) }</a></li>
              </ul>
              <ul className='list-dashed'>
                <li><a href='javascript:;' onClick={() => { this.setState({showModal: MODAL_DATA['chrono']}) }}>{ intl.formatMessage(MODAL_DATA.chrono.title) }</a>
                </li>
                <li><a href='javascript:;' onClick={() => { this.setState({showModal: MODAL_DATA['invalid']}) }}>{ intl.formatMessage(MODAL_DATA.invalid.title) }</a></li>
                <li><a href='javascript:;' onClick={() => { this.setState({showModal: MODAL_DATA['risk']}) }}>{ intl.formatMessage(MODAL_DATA.risk.title) }</a></li>
                <li><a href='javascript:;' onClick={() => { this.setState({showModal: MODAL_DATA['notHome']}) }}>{ intl.formatMessage(MODAL_DATA.notHome.title) }</a></li>
                <li><a href='javascript:;' onClick={() => { this.setState({showModal: MODAL_DATA['foreign']}) }}>{ intl.formatMessage(MODAL_DATA.foreign.title) }</a></li>
                <li><a href='javascript:;' onClick={() => { this.setState({showModal: MODAL_DATA['animals']}) }}>{ intl.formatMessage(MODAL_DATA.animals.title) }</a></li>
              </ul>
            </div>

            {
              !isLoggedIn
                ? <div className='who-med-card__bottom'>
                  <Button to='#registration' className='btn-main-page' size='lg'>{ intl.formatMessage(commonIntlMessages.createCard) }</Button>
                </div>
                : null
            }
          </div>
        </div>
        {/*
        <div id="forPartners" className='container'>
          <h2 className='title-h2-light'>Наши партнёры</h2>
          <div className='pertner-list-wrapper'>
            <div className='pertner-list'>
              <div className='partner-list__item'>
                <img src={require('../../images/static/partner1.png')} alt='' />
              </div>
              <div className='partner-list__item'>
                <img src={require('../../images/static/partner2.png')} alt='' />
              </div>
              <div className='partner-list__item'>
                <img src={require('../../images/static/partner3.png')} alt='' />
              </div>
              <div className='partner-list__item'>
                Центр матери и ребёнка г. Усть-Каменогорска
              </div>
              <div className='partner-list__item'>
                Центральный госпиталь с поликлиникой МВД РК
              </div>
              <div className='partner-list__item'>
                Восточно-Казахстанская областная больница
              </div>
            </div>
          </div>
        </div>
        */}
        <div ref={(el) => { this.contactsBlock = el }} id='forContacts' className='map'>
          <Map />
          <div className='container'>
            <div className='map-info'>
              <h2 className='title-h2-light'><FormattedMessage id='main_page.contacts.title' defaultMessage='Контакты' /></h2>
              <div className='map-info__item'>
                <div className='map-info__phone'>
                  <a href='tel:+77172249320'>+7 (717-2) 24-9320</a>
                </div>
              </div>
              <div className='map-info__item'>
                <div className='map-info__address'>{ intl.formatMessage(commonIntlMessages.address) }</div>
              </div>
              <div className='map-info__item'>
                <div className='map-info__mail'><a href='mailto:phr@hdg.kz'>phr@hdg.kz</a></div>
              </div>
              <div className='map-info__item'>
                <div className='map-info__teaser'>
                  <FormattedMessage id='main_page.contacts.tech' defaultMessage='По техническим вопросам' />:
                  <div className='map-info__mail'>E-mail: <a href='mailto:support@phr.kz'>support@phr.kz</a></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        this.state.showModal
          ? <Modal className='modal-lg' onRequestClose={() => { this.setState({showModal: null}) }}>
            <ModalBody>
              <h2 className='title-h2-light'>{ this.state.showModal.title.id ? intl.formatMessage(this.state.showModal.title) : this.state.showModal.title }</h2>
              <div className='modal-content'>
                { this.state.showModal.text }
              </div>
            </ModalBody>
          </Modal>
          : null
      }
    </div>
  }
}

export default injectIntl(connect(({ user }) => ({ user }))(MainPage))
