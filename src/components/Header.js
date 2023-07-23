import logo from '../images/logo/header__logo.svg';

function Header() {
  return (
    <header className="header">
      <img
        className="header__logo"
        src={logo}
        alt="место Россия на английском языке"
      />
    </header>
  )
};

export { Header };