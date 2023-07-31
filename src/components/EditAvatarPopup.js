import React from 'react';
import { Main } from './Main.js';
import { App } from './App.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { PopupWithForm } from './PopupWithForm.js';

function EditAvatarPopup(props) {
  const { isOpen, onClose, isLoading } = props;

// подписываемся на CurrentUserContext и получаем значение контекста
const currentUser = React.useContext(CurrentUserContext);

// записываем объект, возвращаемый хуком, в переменную
 const avatarRef = React.useRef('');

 function handleSubmit(evt) {
   evt.preventDefault();
   props.onUpdateAvatar({
    // вызываем нужный метод на поле current объекта
      avatar: avatarRef.current.value, // значение инпута, полученное с помощью рефа
   });
 }

// указали элементу атрибут ref => получили прямой доступ к DOM-элементу
  return(
    <PopupWithForm name="popup_update-avatar" title="Обновить аватар" isOpen={isOpen} 
        onClose={onClose} buttonText={isLoading ? 'Сохранение...' : 'Сохранить'} onSubmit={handleSubmit}>
            <label className="popup__field">
              <input
                id="link-inputAvatar"
                name="avatar"
                className="popup__input popup__input_type_link"
                placeholder="Ссылка на картинку"
                type="url"
                required
                ref={avatarRef}
              />
              <span className="link-input popup__input-error" />
            </label>
        </PopupWithForm>
  )
}

export { EditAvatarPopup };