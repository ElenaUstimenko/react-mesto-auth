import React, { useState, useEffect } from 'react';
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
import { Login } from './Login.js';
import { Register } from './Register.js';
import { InfoToolip } from './InfoToolip.js';
import { register, login, checkToken } from '../utils/Auth.js';

function App(props) {
  //////////////////////////////////////////////////////////////////////////////////////////// регистрация и авторизация
  const navigate = useNavigate();
  
  // хранение состояния авторизации (true/false)
  const [loggedIn, setLoggedIn] = useState(false);

  // checkToken - вызывается при монтировании App, и отправляет запрос checkToken если jwt есть в хранилище
  useEffect (() => {
    const /*jwt*/token = localStorage.getItem(/*'jwt'*/'token');
      if(/*jwt*/token) {
        auth(/*jwt*/token);
      }
  }, [loggedIn]);

  const auth = (/*jwt*/token) => {
    return checkToken(/*jwt*/token).then((res) => {
      if (res) {
        setLoggedIn(true);
        navigate('/');
      }
    })
  };
  
  // хранение состояния открытия попапа успеха или ошибки регистрации
  const [isSuccessPopupOpen, setSuccessPopupOpen] = useState(false);
  // хранение состояния изменения картинки в зависимости от ситуации
  const [isSuccessImage, setIsSuccessImage] = React.useState(false);

  // handleRegister - передается в <Register />, при вызове отправляет запрос регистрации, 
  // в зависимости от результата задается стейт для <InfoTooltip /> 
  // и при успешном выполнении запроса перенаправление на страницу /sing-in

   const handleRegister = ({email, password}) => {
    //console.log(password);
    //console.log(email);
    return register({email, password})
    .then((res) => { 
      if (res) {
        setIsSuccessImage(true); // попап с инфо об успешной регистрации
        navigate('/sign-in')
      }
    }).catch((err) => {
      setIsSuccessImage(false); // попап с ошибкой
      navigate('/sign-up')
        console.log(err);
    }).finally(() => {
      setSuccessPopupOpen(true); // открыть попап
    })
  };

  // хранение email авторизированного пользователя
  const [isHeaderEmail, setIsHeaderEmail] = useState(false);

  // handleLogin - передается в <Login />, при вызове отправляет запрос авторизации, 
  // в случае успеха сохраняет email в стейте главного компонента, 
  // затем устанавливает в стейте флажок который говорит о том что пользователь залогинился, 
  // сохраняет в localStorage jwt токен который прилетает с сервера 
  // и отправляет пользователя на корневую страницу сайта. Выполняется это с помощью history.push
  const handleLogin = ({email, password}) => {
    return login({email, password}).then((res) => {
      // console.log(res)
      
      if (res.token) {
        setLoggedIn(true);
        localStorage.setItem(/*'jwt'*/'token', res.token)
        console.log(localStorage.getItem(/*'jwt'*/'token'))
        navigate('/')
        setIsHeaderEmail(email);
      }
    })
  };

  // handleSignout - передается в компонент Header, в котором будет кнопка выхода, 
  // при нажатии на кнопку выхода происходит очистка хранилища, 
  // перенаправление на страницу входа и очистка стейта, отвечающего за состояние авторизации

  const handleSignout = (res) => {
    setLoggedIn(false);
    localStorage.removeItem(/*'jwt'*/'token'/*, res.token*/);
    navigate('/sign-in');
  };
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////// 3 popups
  
  // объявляем переменные состояния с исходным значением
  // [текущее состояние и функция, обновляющая состояние]
  // чтобы проинициализировать функцию, мы передаём значение false в качестве единственного аргумента функции useState
  // второе возвращённое нам значение позволяет обновлять isEditProfilePopupOpen и т.д.
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setisAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setisEditAvatarPopupOpen] = useState(false);

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
  const [selectedCard, setSelectedCard] = useState(null);

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
    setSuccessPopupOpen(false);
    setSelectedCard(null);
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////// cards
  
  // переменная состояния для карточек
  const [cards, setCards] = useState([]);
  
  // сохраняем в стэйт весь массив, который получаем с сервера
  useEffect(() => {
    
    api.getCards()
   .then((cards) => { 
      setCards(cards);
    }).catch(console.error)
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////////////////// user's context
  
  // стейт, отвечающий за данные пользователя
  const [currentUser, setCurrentUser] = useState({});
  // эффект, вызываемый при монтировании компонента, который будет 
  // совершать запрос в API за пользовательскими данными
  useEffect(() => {
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
        <Header
        onSignOut={handleSignout}
        headerEmail={isHeaderEmail}
        />
        <Routes>
          <Route path='/' element={
            <ProtectedRouteElement 
              element={Main}
              onEditProfile={handleEditProfileClick} 
              onAddPlace={handleAddPlaceClick} 
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}  
              loggedIn={loggedIn} /> 
          } />
          <Route path='/sign-in' element={<Login onLogin={handleLogin}/>} />
          <Route path='/sign-up' element={<Register onRegister={handleRegister}/>} />
          <Route path='*' element={loggedIn ? <Navigate to='/' replace /> : <Navigate to='/sign-in' replace />} />
        </Routes>
        
        <EditProfilePopup isOpen={isEditProfilePopupOpen} 
        onClose={closeAllPopups} onUpdateUser={handleUpdateUser} /> 
         
        <AddPlacePopup isOpen={isAddPlacePopupOpen} 
        onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} 
        onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
          
        <PopupWithForm name="popup_confirm-delete" title="Вы уверены?" buttonText={"Да"} />
         
        <ImagePopup name="popup_open-image" onClose={closeAllPopups} card={selectedCard} /> 

        <InfoToolip isOpen={isSuccessPopupOpen} onClose={closeAllPopups} isSuccess={isSuccessImage} />
      </div>

    </CurrentUserContext.Provider>
  )
};

export { App };