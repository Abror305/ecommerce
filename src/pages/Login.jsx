import React from 'react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const TelegramIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.12.19.14.27-.01.06.01.24-.02.37z"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl mb-6">
              Войти в аккаунт
            </h2>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email" 
                  placeholder="example@email.com" 
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Пароль</span>
                </label>
                <input 
                  type="password"
                  placeholder="Введите пароль" 
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input type="checkbox" className="checkbox mr-3" />
                  <span className="label-text">Запомнить меня</span>
                </label>
              </div>

              <button className="btn btn-primary w-full">Войти</button>

              <div className="divider">или</div>

              <button className="btn w-full bg-blue-500 hover:bg-blue-600 text-white border-0">
                <TelegramIcon />
                Войти через Telegram
              </button>

              <div className="text-center space-y-2">
                <div>
                  <a href="#" className="link link-primary text-sm">Забыли пароль?</a>
                </div>
                <div className="text-sm">
                  Нет аккаунта? <Link to="/register" className="link link-primary">Зарегистрируйтесь</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
