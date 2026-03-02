import React from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import ContactForm from './ContactForm';
import ScrollToTopButton from '../Components/extras/ScrollToTopButton';

function Layout({ children, isHeroPage = false, headerTheme = 'dark', showContactForm = true }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isTransparent={isHeroPage} theme={headerTheme} />
      <div className="flex-grow">
        {children}
      </div>
      {showContactForm && <ContactForm />}
      <Footer />
      <WhatsAppButton />
      <ScrollToTopButton />
    </div>
  );
}

export default Layout;
