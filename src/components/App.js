import React from 'react';
import { Header } from './Header.js';
import { Footer } from './Footer.js';
import { Main } from './Main.js';
import { PopupWithForm } from './PopupWithForm.js';
import { ImagePopup } from './ImagePopup.js';
import { Card } from './Card.js';
import { api } from '../utils/Api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { EditProfilePopup } from './EditProfilePopup.js';
import { EditAvatarPopup } from './EditAvatarPopup.js';
import { AddPlacePopup } from './AddPlacePopup.js';
import { usePopupClose } from '../hooks/usePopupClose.js';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';// импортируем Routes
import { ProtectedRouteElement } from './ProtectedRoute.js'; // импортируем HOC

function App(props) {

  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = React.useState(false);

  /////////////////////////////////////////////////////////////////////////////////////////////////////// 3 popups
  
  // объявляем переменные состояния с исходным значением
  // [текущее состояние и функция, обновляющая состояние]
  // чтобы проинициализировать функцию, мы передаём значение false в качестве единственного аргумента функции useState
  // второе возвращённое нам значение позволяет обновлять isEditProfilePopupOpen и т.д.
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setisAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setisEditAvatarPopupOpen] = React.useState(false);
    
  // меняем аргумент функции на true, чтобы открыть попап
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setisAddPlacePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setisEditAvatarPopupOpen(true);
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////// zoom
  
  // Значение selectedCard должно передаваться с помощью пропса card в компонент ImagePopup, 
  // где оно будет использоваться для определения наличия CSS-класса видимости и задания 
  // адреса изображения в теге img
  
  // card's zoom 
  const [selectedCard, setSelectedCard] = React.useState(null);

  // card's zoom
  const handleCardClick = (data) => {
    setSelectedCard(data);
  };
  // console.log(selectedCard)

  /////////////////////////////////////////////////////////////////////////////////////////////////////// all popups

  // закрытие попапов
  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setisAddPlacePopupOpen(false);
    setisEditAvatarPopupOpen(false);
    setSelectedCard(null);
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////// cards
  
  // переменная состояния для карточек
  const [cards, setCards] = React.useState([]);
  
  // сохраняем в стэйт весь массив, который получаем с сервера
  React.useEffect(() => {
    
    api.getCards()
   .then((cards) => { 
      setCards(cards);
    }).catch(console.error)
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////////////////// user's context
  
  // стейт, отвечающий за данные пользователя
  const [currentUser, setCurrentUser] = React.useState({});
  // эффект, вызываемый при монтировании компонента, который будет 
  // совершать запрос в API за пользовательскими данными
  React.useEffect(() => {
    api.getUserIDInfo()
    .then((currentUser) => {
      console.log(currentUser);
    // user information - обновление стейт переменной из получ.значения
    setCurrentUser({
      name: currentUser.name,
      about: currentUser.about,
      avatar: currentUser.avatar,
      _id: currentUser._id,
    })
    }).catch(console.error)
    }, []);

  /////////////////////////////////////////////////////////////////////////////////////////////////////// likes
  
  const handleCardLike = (card) => {
	  //проверяем, есть ли уже лайк на этой карточке
	   const isLiked = card.likes.some(i => i._id === currentUser._id);
    // отправляем запрос в API и получаем обновлённые данные карточки
    if (!isLiked) {
      api.addLike(card._id)
      .then((newCard) => { 
        setCards((state) => 
        // формируем новый массив на основе имеющегося, подставляя в него новую карточку
        state.map((c) => (c._id === card._id ? newCard : c))
      );
      }).catch(console.error)
    } else {
      api.deleteLike(card._id)
      .then((newCard) => { 
        setCards((state) => 
        state.map((c) => (c._id === card._id ? newCard : c))
      );
      }).catch(console.error)
    }
  };
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////// delete

  const handleCardDelete = (cardID) => {
    api.deleteCard(cardID)
    .then(() => {
      // используя методы массива, создаем новый массив карточек, 
      // где не будет карточки, которую мы только что удалили
      setCards((cards) => cards.filter((c) => c._id !== cardID)); 
    }).catch(console.error)
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////// edit profile
  
  // после завершения запроса обновляем стейт currentUser из полученных данных 
  const handleUpdateUser = ({name, about}) => {
   
    api.userInformation({name, about})
    .then((newProfile) => {
      setCurrentUser(newProfile)
       closeAllPopups();
    }).catch(console.error)
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////// edit avatar
  
  const handleUpdateAvatar = (avatar) => {
    api.photoOfAvatar(avatar)
    .then((newAvatar) => {
      setCurrentUser(newAvatar)
      closeAllPopups();
    }).catch(console.error)
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////// card
  
  // в data name и link 
  const handleAddPlaceSubmit = (data) => {
    api.newCardData(data)
    .then((newCard)=> {
      setCards([newCard, ...cards]);
      closeAllPopups();
      // console.log(data)
    }).catch(console.error)
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Routes>
          <Route path='/' element={loggedIn ? <Navigate to='/main' replace /> : <Navigate to='/sign-in' replace />} />
          <Route path='/main' element={
            <ProtectedRouteElement 
            element={Main}
            onEditProfile={handleEditProfileClick} 
            onAddPlace={handleAddPlaceClick} 
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
            loggedIn={loggedIn}
            />
          } />
          <Route path='/sign-in' element={<Footer />} />
          <Route path='/sign-up' element={<Footer />} />
        </Routes>

        <EditProfilePopup isOpen={isEditProfilePopupOpen} 
        onClose={closeAllPopups} onUpdateUser={handleUpdateUser} /> 
         
        <AddPlacePopup isOpen={isAddPlacePopupOpen} 
        onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} 
        onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
          
        <PopupWithForm name="popup_confirm-delete" title="Вы уверены?" buttonText={"Да"} />
         
        <ImagePopup name="popup_open-image" onClose={closeAllPopups} card={selectedCard} /> 
      </div>

    </CurrentUserContext.Provider>
  )
};

export { App };