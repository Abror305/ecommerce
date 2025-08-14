import React, { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';

export default function RegisterPage() {
  const [showTelegramPopup, setShowTelegramPopup] = useState(false);
  const [telegramStep, setTelegramStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Узбекистан');
  const [countryCode, setCountryCode] = useState('+998');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [telegramUserId, setTelegramUserId] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  });

  // Your bot token
  const BOT_TOKEN = `${import.meta.env.REACT_APP_BOT_TOKEN}`

  const countries = [
    { name: 'Узбекистан', code: '+998' },
    { name: 'Россия', code: '+7' },
    { name: 'Казахстан', code: '+7' },
    { name: 'Кыргызстан', code: '+996' },
    { name: 'Таджикистан', code: '+992' },
  ];

  const TelegramIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.12.19.14.27-.01.06.01.24-.02.37z"/>
    </svg>
  );

  const handleCountryChange = (e) => {
    const country = countries.find(c => c.name === e.target.value);
    setSelectedCountry(country.name);
    setCountryCode(country.code);
  };

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Function to get user by phone number (simulation)
  const getUserByPhone = async (phoneNumber) => {
    try {
      // This is a simulation. In reality, you would:
      // 1. Have a database of users with their phone numbers and Telegram user IDs
      // 2. Query your backend API to find the user
      // 3. Return the Telegram user ID if found
      
      // For demo purposes, we'll simulate some known users
      const knownUsers = {
        '+998901234567': '123456789', // Replace with actual Telegram user ID
        '+998909876543': '987654321'  // Replace with actual Telegram user ID
      };
      
      return knownUsers[phoneNumber] || null;
    } catch (error) {
      console.error('Error getting user by phone:', error);
      return null;
    }
  };

  // Function to send message via Telegram Bot API
  const sendTelegramMessage = async (chatId, message) => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      return false;
    }
  };

  const handleSendCode = async () => {
    if (phoneNumber.length < 7) return;
    
    setIsLoading(true);
    const fullPhoneNumber = countryCode + phoneNumber;
    
    try {
      // Check if user exists in your system
      const userId = await getUserByPhone(fullPhoneNumber);
      
      if (!userId) {
        alert('Пользователь с таким номером не найден в Telegram. Убедитесь, что вы написали боту @YourBotUsername');
        setIsLoading(false);
        return;
      }

      // Generate verification code
      const code = generateVerificationCode();
      
      // Store verification data
      const verificationData = {
        phone: fullPhoneNumber,
        code: code,
        timestamp: Date.now(),
        expires: Date.now() + (5 * 60 * 1000), // 5 minutes
        userId: userId
      };
      
      // Store in memory (in real app, store in database)
      window.telegramVerification = verificationData;
      
      // Send verification code via Telegram
      const message = `
🔐 <b>Код подтверждения для Uzmovi.tv</b>

Ваш код: <code>${code}</code>

⏰ Код действителен 5 минут
🚫 Не передавайте этот код никому!

Если вы не запрашивали этот код, просто проигнорируйте это сообщение.
      `;
      
      const sent = await sendTelegramMessage(userId, message);
      
      if (sent) {
        setTelegramUserId(userId);
        setTelegramStep('code');
        alert(`Код отправлен в Telegram на номер ${fullPhoneNumber}`);
      } else {
        alert('Ошибка отправки кода. Убедитесь, что вы начали чат с ботом.');
      }
    } catch (error) {
      console.error('Error sending code:', error);
      alert('Произошла ошибка. Попробуйте снова.');
    }
    
    setIsLoading(false);
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length < 6) return;
    
    const savedData = window.telegramVerification;
    if (!savedData) {
      alert('Код истек. Запросите новый код.');
      return;
    }
    
    if (Date.now() > savedData.expires) {
      alert('Код истек. Запросите новый код.');
      delete window.telegramVerification;
      return;
    }
    
    if (savedData.code === verificationCode) {
      // Send confirmation message
      const confirmMessage = `
✅ <b>Успешная верификация!</b>

Ваш номер телефона подтвержден для регистрации на Uzmovi.tv

Добро пожаловать! 🎉
      `;
      
      await sendTelegramMessage(savedData.userId, confirmMessage);
      
      // Update form data
      setUserData(prev => ({ 
        ...prev, 
        phone: savedData.phone 
      }));
      
      alert('Успешная верификация через Telegram!');
      closeTelegramPopup();
      delete window.telegramVerification;
    } else {
      alert('Неверный код. Попробуйте снова.');
    }
  };

  const closeTelegramPopup = () => {
    setShowTelegramPopup(false);
    setTelegramStep('phone');
    setPhoneNumber('');
    setVerificationCode('');
    setTelegramUserId('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = () => {
    // Form validation
    if (!userData.name || !userData.email || !userData.password) {
      alert('Заполните все обязательные поля');
      return;
    }
    
    if (userData.password !== userData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    
    if (!userData.agreedToTerms) {
      alert('Необходимо согласиться с условиями использования');
      return;
    }
    
    // Registration logic
    console.log('Данные регистрации:', userData);
    alert('Регистрация прошла успешно!');
  };

  const resendCode = () => {
    setVerificationCode('');
    handleSendCode();
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl mb-6">
              Создать аккаунт
            </h2>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Имя</span>
                </label>
                <input 
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  placeholder="Введите ваше имя" 
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com" 
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Телефон</span>
                </label>
                <input 
                  type="tel"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  placeholder="+998 90 123 45 67" 
                  className="input input-bordered w-full"
                  readOnly={userData.phone.startsWith('+')}
                />
                {userData.phone.startsWith('+') && (
                  <label className="label">
                    <span className="label-text-alt text-success">✓ Подтверждено через Telegram</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Пароль</span>
                </label>
                <input 
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  placeholder="Создайте пароль" 
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Подтвердите пароль</span>
                </label>
                <input 
                  type="password"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Повторите пароль" 
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input 
                    type="checkbox" 
                    name="agreedToTerms"
                    checked={userData.agreedToTerms}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary mr-3" 
                  />
                  <span className="label-text text-sm">Я согласен с условиями использования</span>
                </label>
              </div>

              <button 
                onClick={handleRegister}
                className="btn btn-primary w-full"
              >
                Зарегистрироваться
              </button>

              <div className="divider">или</div>

              <button 
                onClick={() => setShowTelegramPopup(true)}
                className="btn w-full bg-blue-500 hover:bg-blue-600 text-white border-0"
              >
                <TelegramIcon />
                Регистрация через Telegram
              </button>

              <div className="text-center">
                <div className="text-sm">
                  Уже есть аккаунт? <a href="#" className="link link-primary">Войти</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Telegram Popup */}
      {showTelegramPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-2xl p-8 w-full max-w-md mx-4 relative">
            <button 
              onClick={closeTelegramPopup}
              className="btn btn-sm btn-ghost absolute top-4 right-4"
            >
              <X size={18} />
            </button>

            {/* Header Icons */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="avatar">
                <div className="w-16 rounded-full bg-blue-500 flex items-center justify-center">
                  <MessageCircle size={32} className="text-white" />
                </div>
              </div>
              <div className="text-base-content opacity-50">→</div>
              <div className="avatar">
                <div className="w-16 rounded-full bg-error flex items-center justify-center text-white text-2xl font-bold">
                  U
                </div>
              </div>
            </div>

            {telegramStep === 'phone' ? (
              <>
                <h2 className="text-center text-xl font-semibold mb-2">
                  Войдите, чтобы использовать аккаунт Telegram
                </h2>
                <p className="text-center text-base-content opacity-70 mb-6">
                  для uzmovi.tv и <span className="text-primary">Uzmovi Registratsiya</span>.
                </p>

                <div className="alert alert-info mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <div>
                    <div className="text-sm">
                      Сначала напишите боту <strong>@YourBotUsername</strong> в Telegram
                    </div>
                  </div>
                </div>

                <p className="text-center text-base-content opacity-70 mb-4">
                  Введите свой номер телефона в{' '}
                  <span className="text-primary">международном формате</span>.<br />
                  Подтверждение будет отправлено в Telegram.
                </p>

                <div className="form-control w-full mb-4">
                  <select 
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="select select-bordered w-full"
                  >
                    {countries.map(country => (
                      <option key={country.name} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="join w-full mb-6">
                  <div className="join-item bg-base-200 px-4 py-3 flex items-center">
                    <span className="font-medium">{countryCode}</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="-- --- -- --"
                    className="input input-bordered join-item flex-1"
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={closeTelegramPopup}
                    className="btn btn-ghost flex-1"
                  >
                    ОТМЕНА
                  </button>
                  <button 
                    onClick={handleSendCode}
                    disabled={phoneNumber.length < 7 || isLoading}
                    className={`btn flex-1 ${
                      phoneNumber.length >= 7 && !isLoading
                        ? 'btn-primary' 
                        : 'btn-disabled'
                    }`}
                  >
                    {isLoading && <span className="loading loading-spinner loading-sm"></span>}
                    {isLoading ? 'ОТПРАВКА...' : 'ДАЛЕЕ'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-center text-xl font-semibold mb-2">
                  Введите код подтверждения
                </h2>
                <p className="text-center text-base-content opacity-70 mb-6">
                  Код отправлен в Telegram на номер<br />
                  <span className="font-medium">{countryCode} {phoneNumber}</span>
                </p>

                <div className="form-control w-full mb-6">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Введите код"
                    className="input input-bordered w-full text-center text-lg tracking-wider"
                    maxLength="6"
                  />
                </div>

                <div className="flex gap-3 mb-4">
                  <button 
                    onClick={() => setTelegramStep('phone')}
                    className="btn btn-ghost flex-1"
                  >
                    НАЗАД
                  </button>
                  <button 
                    onClick={handleVerifyCode}
                    disabled={verificationCode.length < 6}
                    className={`btn flex-1 ${
                      verificationCode.length >= 6
                        ? 'btn-primary' 
                        : 'btn-disabled'
                    }`}
                  >
                    ПОДТВЕРДИТЬ
                  </button>
                </div>

                <p className="text-center text-sm opacity-70">
                  Не получили код?{' '}
                  <button 
                    onClick={resendCode}
                    className="link link-primary"
                  >
                    Отправить повторно
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}