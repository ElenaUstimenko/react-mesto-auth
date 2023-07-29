import React, { useState, useEffect, useContext, useLocation } from 'react';
import { Main } from './Main.js';
import { App } from './App.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { PopupWithForm } from './PopupWithForm.js';
import { usePopupClose } from '../hooks/usePopupClose.js';

/// попап, который показывает сообщение об успешной регистрации, или наоборот - 
// о произошедшей при регистрации ошибке 

function InfoToolip(props) {
  const { isOpen, onClose, isSuccess } = props;

  // подписываемся на CurrentUserContext и получаем значение контекста
  const currentUser = useContext(CurrentUserContext); 

    // используем в любом компоненте (попапе), которому нужно установить эти обработчики
    usePopupClose(props.card?.link, onClose);

  return (
    <div className = {`popup popup_type_login ${isOpen ?'popup_type_login_opened':''}`}>
      <div className="popup__container popup__container_type_login">
      <button className="popup__close popup__close_login" type="button" onClick={onClose}/>
      <div className={`login__image ${isSuccess ? 'login__image_yes' : 'login__image_no'}`}></div>
      <h3 className="login__paragraph">
       {isSuccess
          ? 'Вы успешно зарегистрировались!'
          : 'Что-то пошло не так! Попробуйте ещё раз.'} 
      </h3> 
      </div>    
    </div>
  )
};

export { InfoToolip };