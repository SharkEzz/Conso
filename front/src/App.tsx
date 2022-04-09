import { Box, Container } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import FiltersDrawer from './components/UI/FiltersDrawer';
import Navbar from './components/UI/Navbar';
import TotalDay from './components/UI/TotalDay';
import configureAxios from './utils/configureAxios';

configureAxios();
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Container maxW="container.xl">
        <Box textAlign="right" mb={6}>
          <FiltersDrawer />
        </Box>
        <TotalDay />
      </Container>
    </QueryClientProvider>
  );
}

export default App;
