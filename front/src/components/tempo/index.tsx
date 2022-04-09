import { Badge, Flex, Spinner, Text } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import fetchTempo from '../../actions/fetchTempo';

function tempoToString(tempoStr: string | undefined): string {
  switch (tempoStr) {
    case 'TEMPO_BLEU':
      return 'Bleu';
    case 'TEMPO_BLANC':
      return 'Blanc';
    case 'TEMPO_ROUGE':
      return 'Rouge';
    default:
      return '';
  }
}

function getTempo(
  isLoading: boolean,
  tempo: string | undefined,
): JSX.Element | null {
  if (!isLoading && !tempo) {
    return <Badge colorScheme="red">Une erreur est survenue</Badge>;
  }

  if (isLoading) {
    return <Spinner size="sm" />;
  }

  return (
    <Badge variant="solid" colorScheme="blue">
      {tempoToString(tempo)}
    </Badge>
  );
}

export default function Tempo() {
  const { isLoading, data } = useQuery('tempo', fetchTempo);

  return (
    <Flex gap={6}>
      <Text as="span">Tempo J : {getTempo(isLoading, data?.Today)}</Text>
      <Text as="span">Tempo J + 1 : {getTempo(isLoading, data?.Tomorrow)}</Text>
    </Flex>
  );
}
