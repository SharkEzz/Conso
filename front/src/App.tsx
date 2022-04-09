import { Container } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/UI/Navbar';
import Index from './pages';
import Stats from './pages/historyPage';
import configureAxios from './utils/configureAxios';

configureAxios();
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Container maxW="container.xl">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/historique" element={<Stats />} />
        </Routes>
      </Container>
    </QueryClientProvider>
  );
}

export default App;
