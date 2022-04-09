import { Box } from '@chakra-ui/react';
import FiltersDrawer from '../components/UI/FiltersDrawer';

export default function HistoryPage() {
  return (
    <Box textAlign="right" mb={6}>
      <FiltersDrawer />
    </Box>
  );
}
