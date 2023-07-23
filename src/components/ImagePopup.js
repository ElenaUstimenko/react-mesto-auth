import React from 'react';
import { Card } from './Card.js';
import { usePopupClose } from '../hooks/usePopupClose.js';

function ImagePopup({onClose, ...props}) {
  // console.log(props)

  // используем в любом компоненте (попапе), которому нужно установить эти обработчики
  usePopupClose(props.card?.link, onClose);

  // так как card может быть null (не выбран), то нужно это учесть и писать
  // {card?.name} {card?.link} этот оператор будет проверять, есть ли card или нет
  return (
   
    <div className={`popup popup_open-image ${props.card ? 'popup_opened':''}`}>
     
      <div className="popup__container popup__container_type_open-image">
        <button className="popup__close popup__close_open-image" type="button" onClick={onClose}/>
        <img className="popup__image" 
        src={props.card?.link}
        alt={props.card?.name}/>
        <h3 className="popup__paragraph">{props.card?.name}</h3>
    </div>
  </div>
  ) 
};

export { ImagePopup };