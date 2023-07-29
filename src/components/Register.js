import React, { useState } from 'react';
import { App } from './App.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { Link } from 'react-router-dom';
import { Login } from './Login.js';
import { Navigate, useNavigate } from 'react-router-dom';


// компонент авторизации пользователя с необходимыми стейт-переменными
// компонент практически полностью дублирует логику компонента выше, 
// но при сабмите форма вызывает другую функцию 
// она отправляет данные через функцию регистрации и получает ответ что все ок, или не совсем

const Register = (props) => {

  const { onRegister } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = (evt) => {
    evt.preventDefault();

    onRegister({email, password}) // сюда попадают данные из инпутов
  };
    

  return (
    <div className="register"> 
    <div className="login__container">
      <h3 className="popup__header login__header">Регистрация</h3>
      <form action="#" name="register" className=".popup__form"
        // noValidate="" вернём, когда будет своя валидация
        onSubmit={handleSubmit}
      >
         <label className="popup__field">
        <input id="email-register-input" type="email" name="email"
          className="popup__input popup__input_type_login login__input"
          placeholder="Email" minLength={2} maxLength={30} required
          value={email} 
          onChange={({target: {value}}) => setEmail(value)}
        />
        <span className="email-input popup__input-error"/>
      </label>
      <label className="popup__field">
        <input id="password-register-input" name="password"
          className="popup__input popup__input_type_password login__input"
          placeholder="Пароль" type="password" required
          value={password} 
          onChange={({target: {value}}) => setPassword(value)}
        />
        <span className="password-input popup__input-error"/>
      </label> 
        <button name="button" type="submit" 
          className="popup__save login__button popup__save_register">Зарегистрироваться</button>
        <h3 className="login__text">Уже зарегистрированы? <Link to="../sign-in" className="login__link">Войти</Link></h3>
      </form> 
    </div>
  </div>
  )
};

export { Register };