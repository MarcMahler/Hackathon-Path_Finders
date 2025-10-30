import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import { Requests } from './components/Requests';
import { Personnel } from './components/Personnel';
import { Locations } from './components/Locations';
import { Database } from './components/Database';
import { ToDos } from './components/ToDos';
import { History } from './components/History';
import { DirectMessages } from './components/DirectMessages';

export default function App() {
  const [activeModule, setActiveModule] = useState('home');

  const renderModule = () => {
    switch (activeModule) {
      case 'home':
        return <Home setActiveModule={setActiveModule} />;
      case 'requests':
        return <Requests />;
      case 'personnel':
        return <Personnel />;
      case 'locations':
        return <Locations />;
      case 'database':
        return <Database />;
      case 'todos':
        return <ToDos />;
      case 'history':
        return <History />;
      case 'messages':
        return <DirectMessages />;
      default:
        return <Home setActiveModule={setActiveModule} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="flex-1 overflow-auto">
        {renderModule()}
      </main>
    </div>
  );
}
