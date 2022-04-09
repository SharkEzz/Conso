import { Box, Text } from '@chakra-ui/react';

export default function TotalDay() {
  return (
    <Box borderWidth="thin" borderRadius="lg" boxShadow="md">
      <Box py={3} px={6} borderBottomWidth="thin">
        <Text>Lundi 5 Juillet 2022</Text>
      </Box>
      <Box p={6}>oui</Box>
    </Box>
  );
}
