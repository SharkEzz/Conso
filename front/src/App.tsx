import { Container } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/UI/Navbar';
import Index from './pages';
import Stats from './pages/historyPage';
import configureAxios from './utils/configureAxios';

configureAxios();

function App() {
  return (
    <>
      <Navbar />
      <Container maxW="container.xl">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/historique" element={<Stats />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
