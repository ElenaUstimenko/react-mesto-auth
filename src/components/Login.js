import React, { useState, useEffect } from 'react';
import { App } from './App.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { Link } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';

// компонент авторизации пользователя с необходимыми стейт-переменными
// из себя представляет форму где пользователь вводит данные (почту и пароль) 
// и передает их в функцию отправки на сервер 
// сама функция должна быть описана выше, на уровне app.js
const Login = (props) => {
  const { onLogin } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (!password || !email) { // проверка почты и пароля 
      return;
    }
 
    onLogin({email, password}) // сюда попадают данные из инпутов
  };
 
  return (
    <div className="login"> 
    <div className="login__container">
      <h3 className="popup__header login__header">Вход</h3>
      <form action="#" name="login" className=".popup__form"
        // noValidate="" вернём, когда будет своя валидация
        onSubmit={handleSubmit}
      >
         <label className="popup__field">
        <input id="email-login-input" type="email" name="email"
          className="popup__input popup__input_type_login login__input"
          placeholder="Email" minLength={2} maxLength={30} required
          value={email} 
          onChange={({target: {value}}) => setEmail(value)}
        />
        <span className="email-input popup__input-error" />
      </label>
      <label className="popup__field">
        <input id="password-login-input" name="password"
          className="popup__input popup__input_type_password login__input"
          placeholder="Пароль" type="password" required
          value={password} 
          onChange={({target: {value}}) => setPassword(value)}
        />
        <span className="password-input popup__input-error" />
      </label> 
        <button name="button" type="submit"
            className="popup__save login__button popup__save_login">Войти</button>
      </form> 
    </div>
  </div>
  )
};

export { Login };