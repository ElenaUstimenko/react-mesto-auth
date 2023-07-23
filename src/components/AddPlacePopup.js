import React from 'react';
import { Main } from './Main.js';
import { App } from './App.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { PopupWithForm } from './PopupWithForm.js';


function AddPlacePopup(props) {
  const { isOpen, onClose } = props;

  // подписываемся на CurrentUserContext и получаем значение контекста
  const currentUser = React.useContext(CurrentUserContext); 
 
  // cтейт, в котором содержится значение инпута
  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');

  // обработчик изменения инпута обновляет стейт
  function handleChangeName(evt) {
    setName(evt.target.value);
  };

  function handleChangeLink(evt) {
    setLink(evt.target.value);
  };

  React.useEffect(() => {
    setName(name);
    setLink(link);
  }, [isOpen]);

  // очищение инпутов после успешного добавления карточки,  для того чтобы пользователь мог сразу же 
  // еще раз добавить что-то новое и ему не пришлось бы очищать инпуты вручную перед этим
  React.useEffect(() => {
    setName('');
    setLink('');
  }, [isOpen]);

  const handleSubmit = (evt) => {
    // запрещаем браузеру переходить по адресу формы
    evt.preventDefault();
    // передаём значения управляемых компонентов во внешний обработчик
    props.onAddPlace({ name: name, link: link });
  };

  return (
  <PopupWithForm name="popup_add-image" title="Новое место" isOpen={isOpen} 
  onClose={onClose} buttonText={"Сохранить"} onSubmit={handleSubmit} >
      <label className="popup__field">
        <input
          id="place-input"
          type="text"
          name="name"
          className="popup__input popup__input_type_place"
          placeholder="Название"
          minLength={2}
          maxLength={30}
          required
          value={name} 
          onChange={handleChangeName}
        />
        <span className="place-input popup__input-error" />
      </label>
      <label className="popup__field">
        <input
          id="link-input"
          name="link"
          className="popup__input popup__input_type_link"
          placeholder="Ссылка на картинку"
          type="url"
          required
          value={link} 
          onChange={handleChangeLink}
        />
        <span className="link-input popup__input-error" />
      </label>
  </PopupWithForm>
)};


export { AddPlacePopup };
