import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="footer">
      <div>Contactame</div>
      <div className="socials" style={{ fontSize: 22, display: 'flex', gap: 18, justifyContent: 'center', alignItems: 'center' }}>
        <a
          href="https://wa.me/543512196503"
          target="_blank"
          rel="noreferrer"
          title="Chatear por WhatsApp"
          style={{ color: '#25D366', textDecoration: 'none' }}
        >
          <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
        </a>
        <a
          href="https://instagram.com/oriana_bxj"
          target="_blank"
          rel="noreferrer"
          title="Ver Instagram"
          style={{ color: '#E1306C', textDecoration: 'none' }}
        >
          <FontAwesomeIcon icon={faInstagram} /> Instagram
        </a>
      </div>
    </footer>
  );
}
