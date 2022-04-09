import { Container } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { Route, Routes } from 'react-router-dom';
import fetchPricing from './actions/fetchPricing';
import Navbar from './components/UI/Navbar';
import PricingContext, {
  initialValue as pricingInitialValue,
} from './context/princingContext';
import Index from './pages';
import Stats from './pages/historyPage';
import configureAxios from './utils/configureAxios';

configureAxios();

function App() {
  // eslint-disable-next-line no-lone-blocks
  {
    /* TODO: optimize this to prevent useless render */
  }
  const { data: pricingData } = useQuery('pricing', fetchPricing);

  return (
    <>
      <Navbar />
      <Container maxW="container.xl">
        <PricingContext.Provider value={pricingData ?? pricingInitialValue}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/historique" element={<Stats />} />
          </Routes>
        </PricingContext.Provider>
      </Container>
    </>
  );
}

export default App;
