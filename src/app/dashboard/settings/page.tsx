'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiUser, FiMail, FiShield } from 'react-icons/fi';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Nastavení</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('account')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'account'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Účet
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Notifikace
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'appearance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vzhled
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'account' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Informace o účtu</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <FiUser className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Jméno</p>
                    <p className="text-base font-medium text-gray-900">{session?.user?.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <FiMail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base font-medium text-gray-900">{session?.user?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <FiShield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="text-base font-medium text-gray-900">
                      {session?.user?.role === 'admin' ? 'Administrátor' : 'Manažer'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Toto je demonstrační aplikace, proto zde není možné měnit údaje o účtu.
                </p>
                <p className="text-sm text-gray-500">
                  V reálné aplikaci by zde byly možnosti pro změnu hesla, aktualizaci osobních údajů a další nastavení účtu.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Nastavení notifikací</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Denní přehled</p>
                    <p className="text-sm text-gray-500">Zasílání denního přehledu prodejů</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none"
                      role="switch"
                      aria-checked="false"
                    >
                      <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Upozornění na nízké prodeje</p>
                    <p className="text-sm text-gray-500">Upozornění při poklesu prodejů pod stanovený limit</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none"
                      role="switch"
                      aria-checked="false"
                    >
                      <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Týdenní reporty</p>
                    <p className="text-sm text-gray-500">Zasílání týdenních souhrnných reportů</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none"
                      role="switch"
                      aria-checked="false"
                    >
                      <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  Toto je demonstrační aplikace, proto zde není možné měnit nastavení notifikací.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Nastavení vzhledu</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Barevné schéma</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border border-gray-300 rounded-md p-4 flex items-center justify-center cursor-pointer bg-blue-50 border-blue-500">
                      <span className="text-sm font-medium text-blue-700">Modré (výchozí)</span>
                    </div>
                    <div className="border border-gray-300 rounded-md p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50">
                      <span className="text-sm font-medium text-gray-700">Zelené</span>
                    </div>
                    <div className="border border-gray-300 rounded-md p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50">
                      <span className="text-sm font-medium text-gray-700">Fialové</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Výchozí zobrazení</label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option>Přehled všech prodejen</option>
                    <option>Prodejna Brno</option>
                    <option>Prodejna Praha - OC Lužiny</option>
                    <option>Prodejna Praha - Centrála</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Výchozí časové období</label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option>Den</option>
                    <option selected>Týden</option>
                    <option>Měsíc</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  Toto je demonstrační aplikace, proto zde není možné měnit nastavení vzhledu.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
