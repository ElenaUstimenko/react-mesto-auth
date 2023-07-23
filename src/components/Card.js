import React from 'react';
import { Main } from './Main.js';
import { App } from './App.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function Card({onCardClick, onCardLike, onCardDelete, ...props}) { 
  //console.log(props)
 
  const handleClick = () => {
    onCardClick(props); // наши карточки при загрузке
  }

  const handleLikeClick = () => {
    onCardLike(props.card);
    // console.log(isLiked)
  }

  const handleDeleteClick = () => {
    onCardDelete(props._id); 
    console.log(props._id);
  }

  // подписали его на CurrentUserContext и получили значение контекста
  const currentUser = React.useContext(CurrentUserContext);
  
  // проверяем, есть ли уже лайк на этой карточке
   const isLiked = props.card.likes.some(i => i._id === currentUser._id);
  // создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `element__button_like ${isLiked ? 'element__button_like_active' :' '}`;
  
  // для корзины удаления => определяем, являемся ли мы владельцем текущей карточки
  const isOwn = props.card.owner._id === currentUser._id;
  // создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = 
  `${isOwn ? 'element__button_delete' : ' '}`;
  
  return (
          <li className="element">
            <div className="element__group_image">
              <img className="element__image"
              src={props.link}
              alt={props.name}
              onClick={handleClick}
              />
              <button className={cardDeleteButtonClassName} type="button" onClick={handleDeleteClick}></button>
            </div>
            <div className="element__group_like">
              <h2 className="element__title">{props.name}</h2>
              <div className="element__group_counter">
                <button className={cardLikeButtonClassName} type="button" onClick={handleLikeClick}></button>
                <p className="element__counter">{props.likes.length}</p>
              </div>
            </div>
          </li>
  )
};

export { Card };