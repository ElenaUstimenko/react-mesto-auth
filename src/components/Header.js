import React from 'react';
import { App } from './App.js';
import logo from '../images/logo/header__logo.svg';
import { Link, useLocation } from 'react-router-dom';

// нужно доработать компонент <Header />
// теперь в шапке в зависимости от страницы, на которой мы находимся, будут 
// так же отображаться разные ссылки: “Регистрация“, “Войти“, “[email пользователя] Выйти“. 
// для отображения соответствующей ссылки на странице можно использовать <Route />

function Header(props) {
  const { onSignOut, headerEmail } = props;

  // хук, который может вернуть объект с данными о текущем роуте
  // внутри location поле pathname - это текущий роут, например /sign-up
  // по этому полю прямо внутри хедера можно понять какую кнопку отрисовать
  const location = useLocation({});
  // console.log(location);
  
  const isSignUp = location.pathname === '/sign-up'
  const isLogin = location.pathname === '/sign-in'
  const isLoginIn = location.pathname === '/'
 
  return (
    <header className="header">
      <img
        className="header__logo"
        src={logo}
        alt="место Россия на английском языке"
      />
      <div className="header__links">
      {isLoginIn && <p className="header__email">{headerEmail}</p>}
      {(isSignUp || isLogin) && <Link className="header__link" to={isSignUp ? '/sign-in' : '/sign-up'}>
        {isSignUp ? 'Войти' : 'Регистрация'}</Link>}
      {isLoginIn && (<Link to="/sign-in" className="header__exit" onClick={onSignOut}>Выйти</Link>)}
      </div>
    </header>
  )
};

export { Header };