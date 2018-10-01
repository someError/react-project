import React from 'react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import './MainPage.css'

const PolicyPage = () => {
  return <div className='container-white'>

    <div className='policy-bg'>
      <div className='container'>
        <div className='wrapper-content content-text-right'>
          <h2 className='title-h2-light'>
            <FormattedMessage
              id='policy_page.policy.title'
              defaultMessage='Политика сервиса'
            />
          </h2>

          <FormattedHTMLMessage
            id='policy_page.policy.text'
            defaultMessage={`<ol class="ol-list">
              <li>Сайт <a href="#">phr.kz</a> осуществляет информационный сервис, предоставляя информацию о медицинских
                учреждениях, кабинетах и врачах, зарегистрированных в системе, а также дает возможность записываться на
                прием (процедуры) к врачам, ведущим расписание приемов в режиме on-line.
              </li>
              <li>Онлайновая запись на прием (обслуживание), закрытая переписка с врачами, ведение персональной
                электронной медицинской карты (ПЭМК) доступны только для зарегистрированных пользователей. Регистрация на
                сайте и использование сервиса бесплатны.
              </li>
              <li>При регистрации пользователь обязан сообщить правдивую информацию, для оптимального использования
                возможностей сервиса.
              </li>
              <li>Зарегистрированный пользователь обязан ответственно относиться к использованию возможностей Сервиса.
                Недопустимы злоупотребления записями на прием, ложные сообщения в консультациях и прочая информация, не
                соответствующая действительности.
              </li>
              <li>Сервис гарантирует конфиденциальность всей информации о пользователях и обязуется не использовать эту
                информацию ни в каких других целях кроме осуществления сервиса. Эта информация ни при каких
                обстоятельствах не будет доступна третьим лицам.
              </li>
              <li>Сервис гарантирует компетенцию и профессионализм представленных в нем врачей и медицинских
                учреждений,однако не несет ответственности за качество медицинских услуг.
              </li>
            </ol>`}
          />
        </div>
      </div>
      <div className='policy-bg-inner'>
        <div className='container'>
          <div className='wrapper-content content-text-left'>
            <h2 className='title-h2-light'>
              <FormattedMessage
                id='policy_page.confidential.title'
                defaultMessage='Конфиденциальность'
              />
            </h2>

            <FormattedHTMLMessage
              id='policy_page.confidential.text'
              defaultMessage='<ol class="ol-list">
              <li>Персональная информация пользователей, используемая и хранящаяся на Сервисе <a href="#">phr.kz</a>,
                защищена Законом РК "О персональных данных и их защите".
              </li>
              <li>Регистрируясь на Сервисе, пользователь дает согласие на хранение и обработку своих персональных
                данных.
              </li>
              <li>Сервис гарантирует конфиденциальность электронной медицинской карты и других персональных данных
                пользователей. Понятие "конфиденциальность" включает в себя:
                <ul className="ul-list">
                  <li>строгое и ясное ограничение круга лиц, имеющих доступ к персональным данным пользователей, и
                    определение этого круга исключительно самим пользователем;
                  </li>
                  <li>неиспользование Сервисом этих данных ни в каких других целях кроме осуществления функций Сервиса;
                  </li>
                  <li>меры защиты от несанкционированного доступа к персональной информации извне, включая шифрование и
                    мониторинг. Обмен данных с веб-сайтом осуществляется по безопасному протоколу HTTPS.
                  </li>
                </ul>
              </li>
              <li>Круг лиц, имеющих доступ к персональной информации, определяется следующим образом:
                <ul className="ul-list">
                  <li>Фамилия, имя, отчество, год рождения пользователя доступны врачам и медицинским учреждениям, с
                    которыми пользователь вступил в отношения посредством Сервиса: записался на прием, запросил
                    консультацию, дал доступ к своей медицинской карте и т.п.;
                  </li>
                  <li>Данные об обращениях пользователя за врачебной помощью и медицинскими услугами доступны только
                    медицинскому учреждению и врачу, к которому пользователь обратился;
                  </li>
                  <li>Записи персональной электронной медицинской карты пользователя доступны только врачам и медицинским
                    учреждениям, которым пользователь дал разрешение доступа, и только в режиме, указанном пользователем.
                  </li>
                </ul>
              </li>
            </ol>'
            />
            {/* <div className='content-link-downloads'> */}
            {/* <FeatherIcon icon='download' size={25} /> */}
            {/* <a href='#'>Скачать пользовательское соглашение (.docx, 64Kб)</a> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default PolicyPage
